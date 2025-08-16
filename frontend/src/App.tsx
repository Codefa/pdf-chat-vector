import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PdfUpload from './components/PdfUpload'
import PdfList from './components/PdfList'
import ChatRoute from './routes/ChatRoute'

const App: React.FC = () => (
	<div className="min-h-screen bg-gray-100 p-4">
		<nav className="mb-4 flex gap-4">
			<Link to="/" className="font-bold">
				Home
			</Link>
			<Link to="/pdfs" className="font-bold">
				PDFs
			</Link>
		</nav>
		<Routes>
			<Route path="/" element={<PdfUpload />} />
			<Route path="/pdfs" element={<PdfList />} />
			<Route path="/chat/:pdfId" element={<ChatRoute />} />
		</Routes>
	</div>
)

export default App
