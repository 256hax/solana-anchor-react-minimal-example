// Ref: https://github.com/metaplex-foundation/js#create
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
      maxSupply: 1,
  });

  const nftMetadata = await nft.metadataTask.run();

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.toString());
};

main();

/*
% ts-node <THIS FILE>
nft => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: ab153c4f2b65b50faadb8adddf480049942848bf57206d02a899f24211536afe>,
      bump: 255
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
      data: [MasterEditionV2],
      executable: false,
      lamports: 2853600,
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
    _bn: <BN: 3f68e540edcf52983e54288ff38e1932cf65870441469979d37f031917839746>
  },
  mint: PublicKey {
    _bn: <BN: c4426447c25cdc99feb232bcbd148e8e6ff822cf7023bb031c025c0bfc6b6f93>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/ctS9cPTAlG_kjckWFisB2IXoQFHhjRtbeMvadoSz_5Q',
  sellerFeeBasisPoints: 500,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  primarySaleHappened: false,
  isMutable: false,
  editionNonce: 255,
  tokenStandard: 0,
  collection: null,
  uses: null
}
Mint Address => ED7dJeQoj8KvR3qVSaPHa8ssyRj4zjFMBv8pBnwwguu4
*/