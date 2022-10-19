import { useState } from 'react'
import './App.css'
import { Wallet } from './components/Wallet'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Wallet />
    </div>
  )
}

export default App
