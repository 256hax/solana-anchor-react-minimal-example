// Ref: https://github.com/metaplex-foundation/js#create
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // --- Airdrop ---
  let airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
  });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);
  // --- End Airdrop ---


  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: 'https://api.devnet.solana.com',
          timeout: 60000,
      }));
      // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
          name: "My NFT Metadata",
          description: "My description",
          image: "https://placekitten.com/200/300",
      })
      .run();

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
      .nfts()
      .create({
          uri: uri,
          name: "My NFT",
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          maxSupply: toBigNumber(1),
      })
      .run();

  console.log('uri =>', uri);
  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mintAddress.toString());
};

main();

/*
% ts-node <THIS FILE>
uri => https://arweave.net/bnKB2a0Xix2ilJYbbok8l1O6xf0EVjkk_hdGGYyAe5s
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 522c861d165388178021fc4b96abcab45407ed42100807403658a1e339a0ad97>,
    bump: 255
  },
  mintAddress: PublicKey {
    _bn: <BN: 610893d740710147d66b9864e8caae009106097c6f4a3052e93d325fac4bb01b>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 299bc9eb6c1857b02c7963e184022d06164480392545f8a8fdf5d33b2c5aa708>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/bnKB2a0Xix2ilJYbbok8l1O6xf0EVjkk_hdGGYyAe5s',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 253,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: 522c861d165388178021fc4b96abcab45407ed42100807403658a1e339a0ad97>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 610893d740710147d66b9864e8caae009106097c6f4a3052e93d325fac4bb01b>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: bd910a9f0d8dc41a04702b7fcddc52474e15a971534bbaefdc0313f4938a8faa>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: bd910a9f0d8dc41a04702b7fcddc52474e15a971534bbaefdc0313f4938a8faa>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: bd910a9f0d8dc41a04702b7fcddc52474e15a971534bbaefdc0313f4938a8faa>,
      bump: 253
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
Mint Address => 7Xn8hJYa9Cd64FJ5BzBZmAsxYtfPhutMvKf2YwwZ7W2W
*/