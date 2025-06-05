// Scrollable list of messages

import { useRef, useEffect } from 'react'
import { useChat } from './ChatContext'
import MessageBubble from './MessageBubble'

export default function Chat({ className = '' }: { className?: string }) {
  const { messages } = useChat()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`p-4 space-y-4 ${className}`}>
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  )
}
