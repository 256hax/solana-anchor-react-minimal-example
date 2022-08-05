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
      maxSupply: 1,
  })
  .run();

  const { nft: updatedNft } = await metaplex
      .nfts()
      .update(nft, { name: "My Updated Name" })
      .run();

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.address.toString());
};

main();

/*
% ts-node <THIS FILE>
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 814bced65dac77b81df6c45482761944888e7b2438f6303b4edd6c430995c217>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: f8ea08583eeef3216781f15bc67128f6529868fd7df51cc85f8be4317e77a0e8>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 3816638187a72a26f3d0bdcd5b829c387b5f3d4da6f2187300fb0a7268ada2f1>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/wzAFXTBVwCTY_quMunqlrF-qbyUDMJz6K0PFlVP7hWw',
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
    _bn: <BN: 814bced65dac77b81df6c45482761944888e7b2438f6303b4edd6c430995c217>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: f8ea08583eeef3216781f15bc67128f6529868fd7df51cc85f8be4317e77a0e8>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 399f02e9f5d72cc03365879f7f7aae597257c194f77aae22f6c136ccb107026b>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 399f02e9f5d72cc03365879f7f7aae597257c194f77aae22f6c136ccb107026b>
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
      _bn: <BN: 399f02e9f5d72cc03365879f7f7aae597257c194f77aae22f6c136ccb107026b>,
      bump: 253
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
Mint Address => Hkf69FYWe9LVeh6C3mXioXbGmjxEH5nmXGv4G6P5h4RD
*/