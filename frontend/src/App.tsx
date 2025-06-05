// Layout container

import Chat from './Chat'
import Header from './Header'
import InputBar from './InputBar'

export default function App() {
  return (
    <div className="w-full max-w-3xl flex flex-col min-h-screen">
      <Header />
      <Chat className="flex-1 overflow-y-auto" />
      <InputBar />
    </div>
  )
}
