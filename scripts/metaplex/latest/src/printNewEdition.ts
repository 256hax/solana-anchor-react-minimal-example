// Ref: https://github.com/metaplex-foundation/js#printnewedition
import { Metaplex, keypairIdentity, bundlrStorage, useMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

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

  const nftEdition = await nft.editionTask.run();
  
  console.log('printedNft =>', printedNft);
  console.log('Edition Mint Address =>', printedNft.mint.toString());
  console.log('nftEdition =>', nftEdition);

  if (printedNft.isOriginal()) { // false
    const currentSupply = nft.originalEdition?.supply;
    const maxSupply = nft.originalEdition?.maxSupply;
    console.log('currentSupply =>', currentSupply.toString());
    console.log('maxSupply =>', maxSupply.toString());
  }

  if (printedNft.isPrint()) { // true
    const parentEdition = printedNft.printEdition?.parent;
    const editionNumber = printedNft.printEdition?.edition;
    console.log('parentEdition =>', parentEdition?.toString());
    console.log('editionNumber =>', editionNumber?.toString());
  }
};

main();

/*
% ts-node <THIS FILE>
printedNft => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: b1ec4bee06002ab5afe1fd58380128e8d93aeb91b3c80fffbf3f338ce98ac482>,
      bump: 252
    },
    exists: true,
    data: Metadata {
      key: 4,
      updateAuthority: [PublicKey],
      mint: [PublicKey],
      data: [Object],
      primarySaleHappened: false,
      isMutable: false,
      editionNonce: 255,
      tokenStandard: 3,
      collection: null,
      uses: null,
      collectionDetails: null
    },
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 337
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
      data: [Edition],
      executable: false,
      lamports: 2568240,
      owner: [PublicKey],
      rentEpoch: 337
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
    _bn: <BN: 548ba4485b7c331dd1b2c5182d17c7164259b18892da65ec220b78a5363779d9>
  },
  mint: PublicKey {
    _bn: <BN: 6d99e4ae546395ed46f9b85c52259e47f4a8a568508d508897a0efc3a133a51d>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/kqsADrSE-8k3B6toRtCHLYYHbACB9xLlpNDO39Ixgjk',
  sellerFeeBasisPoints: 500,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  primarySaleHappened: false,
  isMutable: false,
  editionNonce: 255,
  tokenStandard: 3,
  collection: null,
  uses: null
}
Edition Mint Address => 8NqYVr2ByBaPtVHx94YNqtumRGU1Qxq6CwNfdVN4eiKn
nftEdition => {
  publicKey: Pda {
    _bn: <BN: ee9af5ebcc6902d316403828b3591631a0c0d35d2b99a070ae2c3484c4233c84>,
    bump: 254
  },
  exists: true,
  data: MasterEditionV2 { key: 6, supply: <BN: 0>, maxSupply: <BN: a> },
  executable: false,
  lamports: 2853600,
  owner: PublicKey {
    _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
  },
  rentEpoch: 337
}
parentEdition => H4R5eESqLhBdhuhzku5KgUe6bYvy5eTuaESNS2kbH9rB
editionNumber => 1
*/