// Ref: https://github.com/metaplex-foundation/js#update
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
      maxSupply: 1,
      isMutable: true, // <- Don't forget this
  });

  const { nft: updatedNft } = await metaplex.nfts().update(nft, {
      name: "My Updated Name",
  });

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.toString());
};

main();

/*
% ts-node <THIS FILE>
nft => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: ff3e687cdfb9d1b3df0d360f03b9fb3a1288bf9fe4cc38fd6ac6715323946763>,
      bump: 252
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
    _bn: <BN: a97cf20ea7048c01f4deb2279698655f5e46cd1bee8dd4e1335a4347a72bd2a7>
  },
  mint: PublicKey {
    _bn: <BN: 49ad2bafbe389a1d042107097a8f4bd925cd7ba91890a7cbe9f0ea6e06606381>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/Ax688yOxIGMXOpULuxIWTxKPAgdW4e9Tok63syz_cQw',
  sellerFeeBasisPoints: 500,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  primarySaleHappened: false,
  isMutable: true,
  editionNonce: 255,
  tokenStandard: 0,
  collection: null,
  uses: null
}
Mint Address => 5xbv4rK3o9oGCKdEpWCt4NYFEV2G5wKv8NBf5ecwUaAU
*/