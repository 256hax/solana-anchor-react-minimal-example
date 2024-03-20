import { useState } from 'react'
import './App.css'

import {
  Metaplex,
  guestIdentity,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  PublicKey
} from '@solana/web3.js';

function App() {
  const [count, setCount] = useState(0)

  const getMyNfts = async () => {
    const connection = new Connection(clusterApiUrl('devnet'));

    const metaplex = Metaplex.make(connection)
      .use(guestIdentity())

    // const owenerPublicKey = new PublicKey("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd"); // Mainnet
    const owenerPublicKey = new PublicKey('55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK'); // Devnet
    const myNfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: owenerPublicKey });

    console.log('e.g. myNfts[1].address =>', myNfts[1].address.toString());
    console.log('e.g. myNfts[1].name =>', myNfts[1].name);
    console.log('myNfts =>', myNfts);
  }

  return (
    <div className="App">
      <button onClick={getMyNfts}>getMyNfts</button>
    </div>
  )
}

export default App
