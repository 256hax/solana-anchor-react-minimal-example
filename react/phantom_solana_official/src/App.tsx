import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Wallet } from './components/Wallet';
import { SendOneLamportToRandomAddress } from './components/SendOneLamportToRandomAddress';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Wallet />
          <SendOneLamportToRandomAddress />
        </div>
      </header>
    </div>
  );
}

export default App;
