import OpenAI from 'openai'
import { prisma } from '../prisma'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createEmbeddings(chunks: string[]): Promise<number[][]> {
	if (chunks.length === 0) return []
	const resp = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: chunks,
	})
	return resp.data.map((d) => d.embedding as unknown as number[])
}

export async function getRelevantChunks(
	pdfId: string,
	question: string
): Promise<string[]> {
	const resp = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: question,
	})
	const embedding = resp.data[0].embedding

	const rows = await prisma.$transaction(async (tx) => {
		await tx.$executeRawUnsafe('SET LOCAL diskann.query_rescore = 400')
		await tx.$executeRawUnsafe('SET LOCAL diskann.query_search_list_size = 100')
		await tx.$executeRawUnsafe('SET LOCAL hnsw.ef_search = 50')
		return tx.$queryRawUnsafe<any[]>(
			`
      SELECT "chunk"
      FROM "Embeddings"
      WHERE "pdfId" = $1::uuid
      ORDER BY "embedding" <-> $2::vector 
      LIMIT 3
      `,
			pdfId,
			embedding
		)
	})
	return rows.map((r) => r.chunk)
}
