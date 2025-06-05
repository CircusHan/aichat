// Expanding text input with send button

import { useState, useRef } from 'react'
import { useChat } from './ChatContext'
import { SendHorizonal } from 'lucide-react'

export default function InputBar() {
  const { sendMessage } = useChat()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 24 * 6) + 'px'
  }

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text.trim())
    setText('')
    resize()
  }
  // Enter submits, Shift+Enter adds newline

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t border-slate-300 flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => { setText(e.target.value); resize() }}
        onInput={resize}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Type a message..."
        className="flex-1 resize-none rounded border border-slate-300 p-2 text-sm focus:outline-none focus:ring"
      />
      <button
        onClick={handleSend}
        className="p-2 bg-slate-800 text-white rounded hover:bg-slate-700">
        <SendHorizonal className="w-5 h-5" />
      </button>
    </div>
  )
}
