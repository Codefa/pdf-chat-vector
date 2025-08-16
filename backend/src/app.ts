import express from 'express'
import cors from 'cors'
import pdfRoutes from './routes/pdf'
import chatRoutes from './routes/chat'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/pdf', pdfRoutes)
app.use('/api/chat', chatRoutes)

export default app
