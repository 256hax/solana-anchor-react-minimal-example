// Ref: https://github.com/metaplex-foundation/js#findallbycandymachine
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const candyMachinePublicKey = new PublicKey("ELvb8zc75Ko2ay62EDax6ydUBQBLUJtMusVZ56fKsv5y");
  const nfts = await metaplex.candyMachines().findMintedNfts(candyMachinePublicKey).run();

  console.log(nfts);
};

main();

/*
% ts-node <THIS FILE>
[
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: c8eefda417b9333ac40dc745af25e989dabf4e6cea0e7a537f9b46010da8fc20>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 507f902a620ab9417d76125742fafbd510af6eb13a44494e9769ffe041bed24b>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0006',
    symbol: 'NB',
    uri: 'https://arweave.net/dN20ja2LUezvHajaOocKDby4Bue7k6E6yYMyX6hikbo',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: c8eefda417b9333ac40dc745af25e989dabf4e6cea0e7a537f9b46010da8fc20>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: b0741e701dd65be490fc66c6bbfff463e13212e31eb6655470c836975dc13b85>,
      bump: 253
    },
    mintAddress: PublicKey {
      _bn: <BN: e5a0e256a6f7a62f1bbc205d092a5efdd8c2beb411dedc809591c29109394c85>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0008',
    symbol: 'NB',
    uri: 'https://arweave.net/m5KBL1oKu2RH6Dp72t3LmHpPRQY33-jC9NBlpMoIoLM',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: b0741e701dd65be490fc66c6bbfff463e13212e31eb6655470c836975dc13b85>,
      bump: 253
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: fbd9df362f96f6021da579524bd793475497e13af70cc9b91ecc4b6bd34056d4>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 78e72433512714e3f1fcc69b65aadb570ec8aaf4f57c8ebc4a30445cc5cd02c2>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0002',
    symbol: 'NB',
    uri: 'https://arweave.net/FWzqeE7MBJsKzHhJ20NIhjZX1wxyodC0c_lkSm_gcMI',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 253,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: fbd9df362f96f6021da579524bd793475497e13af70cc9b91ecc4b6bd34056d4>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 3e24edba6e78cd77b153dc139df6b20dca72a0774e0c890edf7344e9c23b433>,
      bump: 252
    },
    mintAddress: PublicKey {
      _bn: <BN: 5a208c837744652ea75f485f8f3da88ff27524ee7ca67fc0eec201332dae91ac>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0003',
    symbol: 'NB',
    uri: 'https://arweave.net/S8BhBFjZG5d9osnCqAUrYhukp4rO3x3ER6f5ZRPT8zU',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 3e24edba6e78cd77b153dc139df6b20dca72a0774e0c890edf7344e9c23b433>,
      bump: 252
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 9293df3fe2e81a1fd5710414b16821ede730d06dc532ef4b4a113f373bc70a4>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: a983eccf28c4d0af0ff8c0d336661a8d8d392c5249185cd53f68c3525df09e68>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0005',
    symbol: 'NB',
    uri: 'https://arweave.net/8_L_fXa4kQX_VmFVB5xr9GTp_TtHyKeNY1hnkn3U2-I',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 9293df3fe2e81a1fd5710414b16821ede730d06dc532ef4b4a113f373bc70a4>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 4e91b1e2df9e110f4a6423b547977b2a28e4d62851179313f0b6771138b96a90>,
      bump: 252
    },
    mintAddress: PublicKey {
      _bn: <BN: d2bfd88e0f2e2813d8270c0b64de14bc1124e7c91c2cb5a7ee3550f9be101de9>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0010',
    symbol: 'NB',
    uri: 'https://arweave.net/aKNmtpJE3ovs7To4SLaNEvqYXzXkd3D4TGW8VX9mut0',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 4e91b1e2df9e110f4a6423b547977b2a28e4d62851179313f0b6771138b96a90>,
      bump: 252
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 6f5b9a41490cb6f77a9366c05ce56a38acf85b5ffd403c83636b563f05132957>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 50e6864ce5baff904e915a3fed0ab558474eac72a2e607c08f2b934d4ccb73ea>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0004',
    symbol: 'NB',
    uri: 'https://arweave.net/4S1y2ULQwRDKO8uxy_29L5DfZLbDVFlkCRhEIhOD-tI',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 6f5b9a41490cb6f77a9366c05ce56a38acf85b5ffd403c83636b563f05132957>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: b6fb5f504d215856ae72be4a8d250b656e3c397ac33c743450a460297b55dae7>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: 41de4aaa05c4fb7e235d08fd33be44c6cc1566e418f4c31ee91294cfab0be32d>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0007',
    symbol: 'NB',
    uri: 'https://arweave.net/AVpXIoeJ-1djfGK4DZ-Jsl8MdTlEyI-ke_CelT6Mubg',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: b6fb5f504d215856ae72be4a8d250b656e3c397ac33c743450a460297b55dae7>,
      bump: 254
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 50877af5117b34aeb5811418452305d862119dcbfd169e478c269cc12a2b5e31>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 2d2683ed18394b428b533254442264b9104ab9e3c14af2791b9eebef72623c0c>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0001',
    symbol: 'NB',
    uri: 'https://arweave.net/2dhq3l8ATJvu4-xRkpCbUMOLTLV64OO6zwwCnPxzzM8',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 50877af5117b34aeb5811418452305d862119dcbfd169e478c269cc12a2b5e31>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 10a8b3eee464bbedfa4b860f6d9b27fe1c22533e5c6af9d8bcbf6a08d2f9c41f>,
      bump: 253
    },
    mintAddress: PublicKey {
      _bn: <BN: 4e20bc12711fe397611e7778922804068790ce6f728b2e5a4997c9a22b6c8821>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    name: 'Number #0009',
    symbol: 'NB',
    uri: 'https://arweave.net/7E1aFHvW55HzzegT6qnw9mH8DDlJev3ODJmlIq-KCP8',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 10a8b3eee464bbedfa4b860f6d9b27fe1c22533e5c6af9d8bcbf6a08d2f9c41f>,
      bump: 253
    }
  }
]
*/