import React, { useState, useEffect, useRef } from 'react'

// Loading dots animation component
const LoadingDots: React.FC = () => (
	<div className="flex space-x-1 justify-start items-center p-3">
		<div className="flex space-x-1">
			<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
			<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
			<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
		</div>
	</div>
)

const ChatBox: React.FC<{ pdfId: string }> = ({ pdfId }) => {
	const [question, setQuestion] = useState('')
	const [messages, setMessages] = useState<any[]>([])
	const [chatId, setChatId] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (chatId) {
			fetch(`http://localhost:5000/api/chat/history/${chatId}`)
				.then((r) => r.json())
				.then(setMessages)
		} else {
			setMessages([])
		}
	}, [chatId])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, loading])

	const handleAsk = async () => {
		if (!question) return
		setQuestion('')
		setLoading(true)

		const newMessages = [...messages, { role: 'user', content: question }]
		setMessages(newMessages)

		const res = await fetch(`http://localhost:5000/api/chat/${pdfId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question, chatId }),
		})

		if (!res.body) {
			setLoading(false)
			// Optionally: setMessages([...newMessages, { role: 'assistant', content: 'No response from server.' }]);
			return
		}

		if (res.status === 200) {
			setLoading(false)
			setQuestion('')
		}

		const reader = res.body.getReader()
		const decoder = new TextDecoder()
		let partialAnswer = ''
		let assistantMsgIndex = newMessages.length

		setMessages((msgs) => [...msgs, { role: 'assistant', content: '' }])

		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			const chunk = decoder.decode(value)
			partialAnswer += chunk
			setMessages((msgs) =>
				msgs.map((msg, i) =>
					i === assistantMsgIndex ? { ...msg, content: partialAnswer } : msg
				)
			)
		}

		setQuestion('')
	}

	return (
		<div className="fixed inset-0 bg-white flex flex-col">
			{/* Header */}
			<div className="bg-blue-600 text-white p-4 shadow-md">
				<h1 className="text-xl font-bold">Chat About PDF</h1>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					{messages.map((msg, i) => (
						<div
							key={i}
							className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
									msg.role === 'user'
										? 'bg-blue-600 text-white'
										: 'bg-white text-gray-800 shadow-md'
								}`}>
								<div className="text-xs font-semibold mb-1 opacity-70">
									{msg.role === 'user' ? 'You' : 'Assistant'}
								</div>
								<div className="whitespace-pre-wrap">{msg.content}</div>
							</div>
						</div>
					))}

					{/* Loading animation */}
					{loading && (
						<div className="mb-4 flex justify-start">
							<div className="bg-white text-gray-800 shadow-md rounded-lg max-w-xs lg:max-w-md">
								<div className="text-xs font-semibold mb-1 opacity-70 px-4 pt-2">
									Assistant
								</div>
								<LoadingDots />
							</div>
						</div>
					)}

					{/* Auto-scroll target */}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className="bg-white border-t shadow-lg p-4">
				<div className="max-w-4xl mx-auto flex gap-2">
					<input
						className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						placeholder="Ask a question about this PDF..."
						disabled={loading}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !loading) {
								e.preventDefault()
								handleAsk()
							}
						}}
					/>
					<button
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
						onClick={handleAsk}
						disabled={loading}>
						{loading ? 'Thinking...' : 'Ask'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatBox
