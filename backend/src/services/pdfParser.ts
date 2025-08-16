import fs from 'fs'
import pdfParse from 'pdf-parse'

export async function parsePdfChunks(filePath: string): Promise<string[]> {
	const buffer = fs.readFileSync(filePath)
	const data = await pdfParse(buffer)

	// Split into chunks of ~1000 characters for embedding
	const text = data.text
	const chunkSize = 1000
	const chunks: string[] = []
	for (let i = 0; i < text.length; i += chunkSize) {
		chunks.push(text.slice(i, i + chunkSize))
	}
	return chunks
}
