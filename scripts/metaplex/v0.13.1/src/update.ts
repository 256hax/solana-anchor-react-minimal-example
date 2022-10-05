// Ref: https://github.com/metaplex-foundation/js#update
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
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

  
  // --- Create NFT ---
  const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
          name: "My NFT Metadata",
          description: "My description",
          image: "https://placekitten.com/200/300",
          attributes: [
            {
              trait_type: "Genre",
              value: "Cat"
            }
          ]
      })
      .run();

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
      .nfts()
      .create({
          uri: uri,
          name: "My NFT",
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          maxSupply: 1,
      })
      .run();


  // --- Update NFT ---
  const { nft: updatedNft } = await metaplex
      .nfts()
      .update(nft, {
        name: "My Updated Name",
     })
      .run();


  // --- Update Metadata ---
  const { uri: newUri } = await metaplex
      .nfts()
      .uploadMetadata({
          ...updatedNft.json,
          name: "My Updated Metadata Name",
          description: "My Updated Metadata Description",
          attributes: [
            {
              trait_type: "Genre",
              value: "Super Cat"
            }
          ]
      })
      .run();
  
  const { nft: updatedMetadataNft } = await metaplex
      .nfts()
      .update(updatedNft, { 
          uri: newUri
      })
      .run();

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
  lazy: false,
  address: Pda {
    _bn: <BN: ac20408d8eec85d48f3788f074d9a81b5126ed1c540d6d465f0ca431695bfc8c>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: f67c365d20f7c556f0f4c9ccf2b3d5b0903b2ad2143c1eb07b5f48457aa3e2e0>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 36aaf4fd35c8e1ecd01e8effaca8883661884d737d60d8534880815195501f1e>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/xyV0We33wa8BAlSt6hcPPhT9ZhnJU7uKO0mq5Pe-w2U',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  metadataAddress: Pda {
    _bn: <BN: ac20408d8eec85d48f3788f074d9a81b5126ed1c540d6d465f0ca431695bfc8c>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: f67c365d20f7c556f0f4c9ccf2b3d5b0903b2ad2143c1eb07b5f48457aa3e2e0>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>
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
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
nft.json?.attributes => [ { trait_type: 'Genre', value: 'Cat' } ]
Mint Address => HbB9Zps5wr2h9CxU7abTZBVH4hT6qfMFbZArNS9pzkKh
updatedNft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: ac20408d8eec85d48f3788f074d9a81b5126ed1c540d6d465f0ca431695bfc8c>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: f67c365d20f7c556f0f4c9ccf2b3d5b0903b2ad2143c1eb07b5f48457aa3e2e0>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 36aaf4fd35c8e1ecd01e8effaca8883661884d737d60d8534880815195501f1e>
  },
  name: 'My Updated Name',
  symbol: '',
  uri: 'https://arweave.net/xyV0We33wa8BAlSt6hcPPhT9ZhnJU7uKO0mq5Pe-w2U',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  metadataAddress: Pda {
    _bn: <BN: ac20408d8eec85d48f3788f074d9a81b5126ed1c540d6d465f0ca431695bfc8c>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: f67c365d20f7c556f0f4c9ccf2b3d5b0903b2ad2143c1eb07b5f48457aa3e2e0>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>
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
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
updatedMetadataNft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: ac20408d8eec85d48f3788f074d9a81b5126ed1c540d6d465f0ca431695bfc8c>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: f67c365d20f7c556f0f4c9ccf2b3d5b0903b2ad2143c1eb07b5f48457aa3e2e0>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 36aaf4fd35c8e1ecd01e8effaca8883661884d737d60d8534880815195501f1e>
  },
  name: 'My Updated Name',
  symbol: '',
  uri: 'https://arweave.net/Ocd2WuJCZVsfDIiNjzirvScoD8_DvZk_Ea1U5jTLKgo',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My Updated Metadata Name',
    description: 'My Updated Metadata Description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  metadataAddress: Pda {
    _bn: <BN: ac20408d8eec85d48f3788f074d9a81b5126ed1c540d6d465f0ca431695bfc8c>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: f67c365d20f7c556f0f4c9ccf2b3d5b0903b2ad2143c1eb07b5f48457aa3e2e0>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>
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
      _bn: <BN: 2ad25db4618a9e67b7f229cd3cf293f08103db2fa6fa3a69c1ea28cf915c9b95>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
updatedMetadataNft.json?.attributes => [ { trait_type: 'Genre', value: 'Super Cat' } ]
*/