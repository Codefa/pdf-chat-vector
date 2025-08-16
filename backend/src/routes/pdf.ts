import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { prisma } from '../prisma'
import { parsePdfChunks } from '../services/pdfParser'
import { createEmbeddings } from '../services/embeddings'

const router = express.Router()
const upload = multer({ dest: path.join(__dirname, '../../uploads') })

router.post('/upload', upload.single('pdf'), async (req, res) => {
	try {
		const { title } = req.body
		const file = req.file
		if (!file) return res.status(400).json({ error: 'No file uploaded' })

		const pdf = await prisma.pDF.create({
			data: { title, filename: file.filename },
		})

		// Parse PDF into text chunks
		const chunks = await parsePdfChunks(file.path)

		// Delete the uploaded file after parsing
		fs.unlinkSync(file.path)

		// Generate embeddings for each chunk (OpenAI)
		const embeddings = await createEmbeddings(chunks)

		// Insert embeddings into Embeddings table
		for (let i = 0; i < chunks.length; i++) {
			await prisma.$executeRawUnsafe(
				`INSERT INTO "Embeddings" ("pdfId", "chunk", "embedding") VALUES ($1::uuid, $2, $3)`,
				pdf.id,
				chunks[i],
				embeddings[i]
			)
		}

		res.json(pdf)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

router.get('/list', async (_, res) => {
	const pdfs = await prisma.pDF.findMany({ orderBy: { createdAt: 'desc' } })
	res.json(pdfs)
})

router.delete('/:id', async (req, res) => {
	const { id } = req.params
	try {
		await prisma.pDF.delete({
			where: { id },
			include: {
				chats: {
					include: { messages: true },
				},
				Embeddings: true,
			},
		})
		res.status(204).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

export default router
