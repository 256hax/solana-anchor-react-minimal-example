// Ref: https://github.com/metaplex-foundation/js#update
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toBigNumber,
  OperationOptions,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import fs from 'fs';

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);

  const operationOptions: OperationOptions = {
    commitment: 'finalized',
  };

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  // let airdropSignature = await connection.requestAirdrop(
  //   wallet.publicKey,
  //   LAMPORTS_PER_SOL,
  // );

  // const latestBlockHash = await connection.getLatestBlockhash();

  // await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature: airdropSignature,
  // });

  // sleep(5); // Wait for airdrop confirmation.

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  if (balance >= LAMPORTS_PER_SOL) {
    console.log('wallet balance =>', balance);
  } else {
    throw Error('Failed to airdrop. Adjust sleep time, use custom RPC or your wallet.');
  }

  // ------------------------------------
  //  Make Metaplex
  // ------------------------------------
  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(irysStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // ------------------------------------
  //  Mint NFT
  // ------------------------------------
  // --- Create NFT ---
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: 'My NFT Metadata',
      description: 'My description',
      image: 'https://placekitten.com/200/300',
      attributes: [
        {
          trait_type: 'Genre',
          value: 'Cat'
        }
      ]
    });

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create(
      {
        uri: uri,
        name: 'My NFT',
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        maxSupply: toBigNumber(1),
      },
      operationOptions
    );

  // Check Exist NFT
  if (!nft) {
    throw Error('Failed to create NFT. Try again or adjust sleep time.');
  }

  // --- Update NFT ---
  await metaplex
    .nfts()
    .update({
      nftOrSft: nft,
      name: "My Updated Name"
    });

  const updatedNft = await metaplex.nfts().refresh(nft);

  // --- Update Metadata ---
  const { uri: newUri } = await metaplex
    .nfts()
    .uploadMetadata({
      ...updatedNft.json,
      name: 'My Updated Metadata Name',
      description: 'My Updated Metadata Description',
      attributes: [
        {
          trait_type: 'Genre',
          value: 'Super Cat'
        }
      ]
    });

  await metaplex
    .nfts()
    .update({
      nftOrSft: nft,
      uri: newUri
    });

  const updatedMetadataNft = await metaplex.nfts().refresh(nft);

  console.log('nft =>', nft);
  console.log('nft.json?.attributes =>', nft.json?.attributes);
  console.log('Mint Address =>', nft.mint.address.toString());
  console.log('updatedNft =>', updatedNft);
  console.log('updatedMetadataNft =>', updatedMetadataNft);
  console.log('updatedMetadataNft.json?.attributes =>', updatedMetadataNft.json?.attributes);
};

main();

/*
% ts-node <THIS FILE>
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: c09b8e60f4337ffc9366e065317feec29fa1154cb6ffd340d63d49cd252399fc>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/H3R2UGROdrBK-kwXRZb98zM-78H8q_ypsGQFC248FNg',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
  },
  metadataAddress: Pda {
    _bn: <BN: b409b3566283db3839a8e9f94391d1013f09cfebdd73a928cf319c49289d6377>,
    bump: 253
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: c94227842bd16ffaafa41f5ce54c6422aa0ad8efc0d56d9a65d21a82c0a6307b>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
    },
    ownerAddress: PublicKey {
      _bn: <BN: c09b8e60f4337ffc9366e065317feec29fa1154cb6ffd340d63d49cd252399fc>
    },
    amount: { basisPoints: <BN: 1>, currency: [Object] },
    closeAuthorityAddress: null,
    delegateAddress: null,
    delegateAmount: { basisPoints: <BN: 0>, currency: [Object] },
    state: 1
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
nft.json?.attributes => [ { trait_type: 'Genre', value: 'Cat' } ]
Mint Address => BRaCeVHZ4TDT3U6ZQZii2pA4x1khsD98VqnDfgp5fRPP
updatedNft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: c09b8e60f4337ffc9366e065317feec29fa1154cb6ffd340d63d49cd252399fc>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  jsonLoaded: true,
  name: 'My Updated Name',
  symbol: '',
  uri: 'https://arweave.net/H3R2UGROdrBK-kwXRZb98zM-78H8q_ypsGQFC248FNg',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
  },
  metadataAddress: Pda {
    _bn: <BN: b409b3566283db3839a8e9f94391d1013f09cfebdd73a928cf319c49289d6377>,
    bump: 253
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: c94227842bd16ffaafa41f5ce54c6422aa0ad8efc0d56d9a65d21a82c0a6307b>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
    },
    ownerAddress: PublicKey {
      _bn: <BN: c09b8e60f4337ffc9366e065317feec29fa1154cb6ffd340d63d49cd252399fc>
    },
    amount: { basisPoints: <BN: 1>, currency: [Object] },
    closeAuthorityAddress: null,
    delegateAddress: null,
    delegateAmount: { basisPoints: <BN: 0>, currency: [Object] },
    state: 1
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
updatedMetadataNft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: c09b8e60f4337ffc9366e065317feec29fa1154cb6ffd340d63d49cd252399fc>
  },
  json: {
    name: 'My Updated Metadata Name',
    description: 'My Updated Metadata Description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/-haZ1mpuvQn-7f-bg8J_epmeivBxnUCK5SU3QRp2Vlw',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
  },
  metadataAddress: Pda {
    _bn: <BN: b409b3566283db3839a8e9f94391d1013f09cfebdd73a928cf319c49289d6377>,
    bump: 253
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: c94227842bd16ffaafa41f5ce54c6422aa0ad8efc0d56d9a65d21a82c0a6307b>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 9ae059546b434dd177d542adeca8899426ccd440d920db3bfd4d8dab64559fc2>
    },
    ownerAddress: PublicKey {
      _bn: <BN: c09b8e60f4337ffc9366e065317feec29fa1154cb6ffd340d63d49cd252399fc>
    },
    amount: { basisPoints: <BN: 1>, currency: [Object] },
    closeAuthorityAddress: null,
    delegateAddress: null,
    delegateAmount: { basisPoints: <BN: 0>, currency: [Object] },
    state: 1
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 4827e18f40adf70ef89406b90a011a997faaab0ef95997cb7b9486a99be4acbd>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
updatedMetadataNft.json?.attributes => [ { trait_type: 'Genre', value: 'Super Cat' } ]
*/