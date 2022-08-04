// Ref: https://github.com/metaplex-foundation/js#findbymint
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const mintAddress = new PublicKey("BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1");

  const nft = await metaplex.nfts().findByMint(mintAddress).run();

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.address.toString());
  console.log('NFT metadataAddress =>', nft.metadataAddress.toString());
  console.log('NFT Image =>', nft.uri);
};

main();

/*
% ts-node <THIS FILE>
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 7630157cc5f2f80c0fafaf6cab335297a4ad486b27220e53900ccf4e046ab060>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: 9cd2962810fe4d5032860bf58bb681dd3d409498b15dedb3e5b89e9c2fbe5752>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 843b97104c1984ecff17a9fb451b5b60911ed41f5c56351f4d92eceddb5c23e2>
  },
  name: 'SMB #2756',
  symbol: 'SMB',
  uri: 'https://arweave.net/Z57LxpnPAgYfWEABs1gfKhyFUtR3x9Pln_9h959sFog',
  isMutable: true,
  primarySaleHappened: true,
  sellerFeeBasisPoints: 600,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: 67e55ab262f537c60026656df7011acd610d91f5ecb5e3c07a97131c1f2b0ce>
    }
  },
  uses: null,
  json: {
    name: 'SMB #2756',
    symbol: 'SMB',
    description: 'SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.',
    seller_fee_basis_points: 600,
    image: 'https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s',
    external_url: 'https://solanamonkey.business/',
    collection: { name: 'SMB Gen2', family: 'SMB' },
    attributes: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ],
    properties: { files: [Array], category: 'image', creators: [Array] }
  },
  metadataAddress: Pda {
    _bn: <BN: 7630157cc5f2f80c0fafaf6cab335297a4ad486b27220e53900ccf4e046ab060>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 9cd2962810fe4d5032860bf58bb681dd3d409498b15dedb3e5b89e9c2fbe5752>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 5bdf5fb610bb51d3230de65f63cf6ad7efa0126150077afa2dd68bd84c30e8d4>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 5bdf5fb610bb51d3230de65f63cf6ad7efa0126150077afa2dd68bd84c30e8d4>
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
      _bn: <BN: 5bdf5fb610bb51d3230de65f63cf6ad7efa0126150077afa2dd68bd84c30e8d4>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
Mint Address => BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1
NFT metadataAddress => 8xMdmpKDkLNJDS6XJmZE7Fu8ca8cz28di9bU37L5dAuM
NFT Image => https://arweave.net/Z57LxpnPAgYfWEABs1gfKhyFUtR3x9Pln_9h959sFog
*/