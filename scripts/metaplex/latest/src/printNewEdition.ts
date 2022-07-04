// Ref: https://github.com/metaplex-foundation/js#printnewedition
import { Metaplex, keypairIdentity, bundlrStorage, useMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // airdrop
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
  // End airdrop


  // Ref:
  //  bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }));

  const { uri } = await metaplex.nfts().uploadMetadata({
      name: "My NFT",
      description: "My description",
      image: "https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s",
  });

  // Ref:
  //  The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex.nfts().create({
      uri: uri,
      maxSupply: 10,
      isMutable: true, // <- Don't forget this
  });

  const { nft: printedNft } = await metaplex.nfts().printNewEdition(nft.mint);

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.toString());

  // TODO: Get Edition Mint Address
  //
  // Edition Mint Address getting flow:
  //  Mint Address > Mint Authority > Latest TX > Mint Address
};

main();

/*
% ts-node <THIS FILE>
nft => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: 19e921fcd9f74634409c897f5f98270c09927d12601c12939b9083024776a27f>,
      bump: 254
    },
    exists: true,
    data: Metadata {
      key: 4,
      updateAuthority: [PublicKey],
      mint: [PublicKey],
      data: [Object],
      primarySaleHappened: false,
      isMutable: true,
      editionNonce: 255,
      tokenStandard: 0,
      collection: null,
      uses: null,
      collectionDetails: null
    },
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 336
  },
  metadataTask: Task {
    status: 'successful',
    result: {
      name: 'My NFT',
      description: 'My description',
      image: 'https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s'
    },
    error: undefined,
    callback: [Function (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  editionTask: Task {
    status: 'successful',
    result: {
      publicKey: [Pda],
      exists: true,
      data: [MasterEditionV2],
      executable: false,
      lamports: 2853600,
      owner: [PublicKey],
      rentEpoch: 336
    },
    error: undefined,
    callback: [AsyncFunction (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  updateAuthority: PublicKey {
    _bn: <BN: b243c245bf324976ed858734516a48f64ef882daaf6c4ba4931a9314d56ffab6>
  },
  mint: PublicKey {
    _bn: <BN: 8924614c843438363f907b00cb2216b66a7586e5c672704fe078f1afcb42ccd6>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/uo8acsAwJZrGOXiRCK7ncYvUf17AY7HuurEBcGrs7xg',
  sellerFeeBasisPoints: 500,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  primarySaleHappened: false,
  isMutable: true,
  editionNonce: 255,
  tokenStandard: 0,
  collection: null,
  uses: null
}
Mint Address => AEM2hcht3tGTe4WJteAP9BMVW5omUkr4CwwnWQRB8Lhb
*/