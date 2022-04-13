import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Phantom } from './components/Phantom';
import { Arconnect } from './components/Arconnect';
import { UploadMetadata } from './components/UploadMetadata';
import ArTransactionIdProvider from './providers/ArTransactionId';
import { MintNft } from './components/MintNft';

import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Arconnect />
        -----------------------------------------------------------------------
        <ArTransactionIdProvider>
          <UploadMetadata />
        -----------------------------------------------------------------------
          <Phantom />
        -----------------------------------------------------------------------
          <MintNft />
        </ArTransactionIdProvider>
      </header>
    </div>
  );
}

export default App;
