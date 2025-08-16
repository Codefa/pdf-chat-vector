import express from 'express'
import { prisma } from '../prisma'
import { getRelevantChunks } from '../services/embeddings'
import { streamAI } from '../services/Ai'

const router = express.Router()

router.post('/:pdfId', async (req, res) => {
	try {
		const { pdfId } = req.params
		const { question, chatId } = req.body

		// Get relevant chunks
		const t0 = Date.now()
		const contextChunks = await getRelevantChunks(pdfId, question)
		const tRetrieval = Date.now()

		// Find or create chat
		let chat = null
		if (chatId) {
			chat = await prisma.chat.findUnique({ where: { id: chatId } })
			if (!chat) {
				chat = await prisma.chat.create({ data: { pdfId } })
			}
		} else {
			chat = await prisma.chat.create({ data: { pdfId } })
		}

		// Create user message
		await prisma.message.create({
			data: { chatId: chat.id, role: 'user', content: question },
		})

		// Set headers for streaming
		res.setHeader('Content-Type', 'text/plain; charset=utf-8')
		res.setHeader('Transfer-Encoding', 'chunked')

		let answer = ''
		let firstChunkAt: number | null = null

		for await (const part of streamAI(question, contextChunks)) {
			if (!firstChunkAt) firstChunkAt = Date.now()
			answer += part
			res.write(part) // Send partial answer to frontend
		}

		const tEnd = Date.now()
		console.log(
			JSON.stringify({
				event: 'chat_perf',
				retrieval_ms: tRetrieval - t0,
				ttfb_ms: (firstChunkAt ?? tEnd) - t0,
				total_ms: tEnd - t0,
				model: 'gpt-4o-mini',
				top_k: 3,
			})
		)

		// Create assistant message after streaming is done
		const msg = await prisma.message.create({
			data: { chatId: chat.id, role: 'assistant', content: answer },
		})

		res.end() // End streaming response
	} catch (err) {
		console.error(err)
		res.status(500).send('Internal Server Error')
	}
})

router.get('/history/:chatId', async (req, res) => {
	const { chatId } = req.params
	const messages = await prisma.message.findMany({
		where: { chatId },
		orderBy: { createdAt: 'asc' },
	})
	res.json(messages)
})

router.get('/bench/:pdfId', async (req, res) => {
	const { pdfId } = req.params
	const question = (req.query.q as string) || 'test'
	const t0 = Date.now()
	const chunks = await getRelevantChunks(pdfId, question)
	const t1 = Date.now()
	res.json({ retrieval_ms: t1 - t0, k: chunks.length })
})

export default router
