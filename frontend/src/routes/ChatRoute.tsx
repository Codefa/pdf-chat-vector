import React from 'react'
import { useParams } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

const ChatRoute: React.FC = () => {
	const { pdfId } = useParams()
	if (!pdfId)
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-gray-100">
				<div className="text-xl text-red-600">Error: no PDF id</div>
			</div>
		)
	return <ChatBox pdfId={pdfId} />
}

export default ChatRoute
