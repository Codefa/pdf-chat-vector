import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPdfs } from '../features/pdfSlice'
import { Link } from 'react-router-dom'

const PdfList: React.FC = () => {
	const dispatch = useDispatch()
	const { pdfs, loading } = useSelector((state: any) => state.pdf)

	useEffect(() => {
		dispatch(fetchPdfs() as any)
	}, [])

	const handleDelete = async (pdfId: string) => {
		await fetch(`http://localhost:5000/api/pdf/${pdfId}`, { method: 'DELETE' })
		dispatch(fetchPdfs() as any) // Refresh list
	}

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
			<h1 className="text-xl font-bold mb-4">PDFs</h1>
			{loading && <div>Loading...</div>}
			{pdfs.map((pdf: any) => (
				<div key={pdf.id} className="flex justify-between items-center mb-2">
					<span>{pdf.title}</span>
					<div className="flex gap-2">
						<Link to={`/chat/${pdf.id}`}>
							<button className="bg-green-600 text-white px-2 rounded">
								Chat
							</button>
						</Link>
						<button
							className="bg-red-600 text-white px-2 rounded"
							onClick={() => handleDelete(pdf.id)}>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default PdfList
