// Top bar with title, model picker and clear button

import { useChat } from './ChatContext'

const models = ['o3 mini', 'gpt-3.5-turbo']

export default function Header() {
  const { model, setModel, apiKey, setApiKey, clear } = useChat()
  return (
    <header className="bg-slate-800 text-white flex items-center justify-between px-4 py-2">
      <h1 className="font-bold text-lg">ChatBot</h1>
      <div className="flex items-center gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="OpenAI API key"
          className="bg-slate-700 text-sm px-2 py-1 rounded"
        />
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          className="bg-slate-700 text-sm px-2 py-1 rounded">
          {models.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button onClick={clear} className="text-sm hover:underline">Clear</button>
      </div>
    </header>
  )
}

