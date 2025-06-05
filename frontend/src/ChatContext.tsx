// Chat context holds messages and exposes send/clear functions
import { createContext, useContext, useEffect, useState } from 'react'
import useSWR from 'swr'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: Message[]
  model: string
  setModel: (m: string) => void
  apiKey: string
  setApiKey: (k: string) => void
  sendMessage: (content: string) => Promise<void>
  clear: () => void
}

const ChatContext = createContext<ChatState>(null as any)
const STORAGE_PREFIX = 'chat-history-'

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [model, setModel] = useState('o3 mini')
  const [apiKey, setApiKey] = useState(
    typeof window === 'undefined' ? '' : localStorage.getItem('openai-key') || ''
  )
  // Load history from localStorage
  const { data: messages = [], mutate } = useSWR<Message[]>(model, () => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(STORAGE_PREFIX + model)
    return raw ? JSON.parse(raw) : []
  })

  // Persist history when messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + model, JSON.stringify(messages))
  }, [messages, model])

  useEffect(() => {
    localStorage.setItem('openai-key', apiKey)
  }, [apiKey])

  // Send user message then stream assistant reply
  const sendMessage = async (content: string) => {
    const newList = [...messages, { role: 'user' as const, content }]
    mutate(newList, false)
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'openai-api-key': apiKey
      },
      body: JSON.stringify({ messages: newList, model })
    })
    const reader = res.body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder('utf-8')
    let assistant = { role: 'assistant' as const, content: '' }
    mutate([...newList, assistant], false)
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      assistant.content += decoder.decode(value)
      mutate([...newList, { ...assistant }], false)
    }
    mutate([...newList, assistant], true)
  }

  const clear = () => {
    mutate([], false)
    localStorage.removeItem(STORAGE_PREFIX + model)
  }

  return (
    <ChatContext.Provider value={{ messages, model, setModel, apiKey, setApiKey, sendMessage, clear }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
