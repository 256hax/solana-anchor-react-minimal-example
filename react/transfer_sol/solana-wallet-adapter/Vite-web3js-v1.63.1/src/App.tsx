import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Wallet } from './components/Wallet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Wallet />
      </header>
    </div>
  );
}

export default App;