// Ref: https://github.com/metaplex-foundation/js#create
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toBigNumber,
  mockStorage,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { sleep } from 'sleep';

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const wallet = Keypair.generate();

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  sleep(5); // Wait for airdrop confirmation.

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
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // ------------------------------------
  //  Mint NFT
  // ------------------------------------
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: 'My NFT Metadata',
      description: 'My description',
      image: 'https://placekitten.com/20/30',
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
    .create({
      uri: uri,
      name: 'My NFT',
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
    });

  console.log('nft.address =>', nft.address.toString());
  console.log('uri =>', uri);
  console.log('nft =>', nft);

  // ------------------------------------
  //  Use Mock
  // ------------------------------------
  // const metaplex = Metaplex.make(connection)
  //   .use(keypairIdentity(wallet))
  //   .use(mockStorage());
  // 
  // const { uri } = await metaplex
  //   .nfts()
  //   .uploadMetadata({
  //     name: "My NFT Metadata",
  //     description: "My description",
  //     image: "https://placekitten.com/200/300",
  //   });
  // 
  // const fakeNft = await metaplex.storage().download(uri);
  // console.log('fakeNft =>', fakeNft.buffer.toString());
};

main();

/*
% ts-node <THIS FILE>
wallet balance => 1000000000
nft.address => J3c1sPCjUM4xMJ3f3qD4EnerbmufNnKviyURRpCghpaz
uri => https://arweave.net/v6V4ZvJK3qAxM1TZO0hPjjlLpkEryLXz8mgvwBsSUTY
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey [PublicKey(6LxcZdvAGFhLjd2S636osw6ZsXqqHgsaWjkCMqFRMDNg)] {
    _bn: <BN: 4f675a1c3c15f144e4d7580fceaf54857aea1911451709c0db1bf7ee14e5bcf9>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/20/30',
    attributes: [ [Object] ]
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/v6V4ZvJK3qAxM1TZO0hPjjlLpkEryLXz8mgvwBsSUTY',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [
    {
      address: [PublicKey [PublicKey(6LxcZdvAGFhLjd2S636osw6ZsXqqHgsaWjkCMqFRMDNg)]],
      verified: true,
      share: 100
    }
  ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  programmableConfig: null,
  address: PublicKey [PublicKey(J3c1sPCjUM4xMJ3f3qD4EnerbmufNnKviyURRpCghpaz)] {
    _bn: <BN: fd416e5139dfa904c9bf12f5215f6c11d48387d5741e0db4c4e95caf384cc29f>
  },
  metadataAddress: Pda [PublicKey(8yU19K2MHJXQQ2gbWkLu38XtBabNi4hFcb3JP8o9QyXL)] {
    _bn: <BN: 7678dd96df94da1566315fcbfb21456e584c7407d508a15bdf1fd7ac15dc2357>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey [PublicKey(J3c1sPCjUM4xMJ3f3qD4EnerbmufNnKviyURRpCghpaz)] {
      _bn: <BN: fd416e5139dfa904c9bf12f5215f6c11d48387d5741e0db4c4e95caf384cc29f>
    },
    mintAuthorityAddress: PublicKey [PublicKey(HMFWFLnXyBdL3nJYoEkDyDpgEomvgvWh3FkZiUhkJgmy)] {
      _bn: <BN: f2eb01cc70286d0a258a14f3a2dd16be5f6831aaf8286b2284c421185354b744>
    },
    freezeAuthorityAddress: PublicKey [PublicKey(HMFWFLnXyBdL3nJYoEkDyDpgEomvgvWh3FkZiUhkJgmy)] {
      _bn: <BN: f2eb01cc70286d0a258a14f3a2dd16be5f6831aaf8286b2284c421185354b744>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda [PublicKey(GqceAUqmk2eRotz2LjQ2Bjp2AZm51DXqLGwSjrhcdvSf)] {
      _bn: <BN: eb537b5acf196d59a010b7f1542f284be2ce8e730591e4d3ccb4f01866bc0a54>,
      bump: 255
    },
    isAssociatedToken: true,
    mintAddress: PublicKey [PublicKey(J3c1sPCjUM4xMJ3f3qD4EnerbmufNnKviyURRpCghpaz)] {
      _bn: <BN: fd416e5139dfa904c9bf12f5215f6c11d48387d5741e0db4c4e95caf384cc29f>
    },
    ownerAddress: PublicKey [PublicKey(6LxcZdvAGFhLjd2S636osw6ZsXqqHgsaWjkCMqFRMDNg)] {
      _bn: <BN: 4f675a1c3c15f144e4d7580fceaf54857aea1911451709c0db1bf7ee14e5bcf9>
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
    address: Pda [PublicKey(HMFWFLnXyBdL3nJYoEkDyDpgEomvgvWh3FkZiUhkJgmy)] {
      _bn: <BN: f2eb01cc70286d0a258a14f3a2dd16be5f6831aaf8286b2284c421185354b744>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
*/