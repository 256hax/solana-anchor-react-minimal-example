import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button'; //テストで追記
import { Phantom } from './components/Phantom';
import { Arconnect } from './components/Arconnect';
import { UploadMetadata } from './components/UploadMetadata';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Arconnect />
        -----------------------------------------------------------------------
        <UploadMetadata />
        -----------------------------------------------------------------------
        <Phantom />
        -----------------------------------------------------------------------
      </header>
    </div>
  );
}

export default App;
