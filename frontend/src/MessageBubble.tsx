// Chat message bubble with avatar

import { Message } from './ChatContext'
import { Bot, User } from 'lucide-react'

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      {isUser && <User className="w-6 h-6 text-white mr-2 shrink-0" />}
      <div className={`px-3 py-2 rounded-lg max-w-prose whitespace-pre-wrap ${isUser ? 'bg-blue-200' : 'bg-white'}`}>
        {message.content}
      </div>
      {!isUser && <Bot className="w-6 h-6 text-gray-700 ml-2 shrink-0" />}
    </div>
  )
}
