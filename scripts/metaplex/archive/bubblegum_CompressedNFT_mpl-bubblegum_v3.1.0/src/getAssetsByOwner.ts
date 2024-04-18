// Docs:
//  https://developers.metaplex.com/bubblegum/fetch-cnfts#by-owner
//  https://digital-asset-standard-api-js-docs.vercel.app/types/DasApiAssetList.html

// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetsByOwner = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Register Library
  umi.use(dasApi());
  
  // -------------------------------------
  //  Get Assets by Owner
  // -------------------------------------
  const owner = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');
  const assets = await umi.rpc.getAssetsByOwner({ owner });

  // assets.items.map((a: any) => {
  //   console.log('assets =>', a);
  // });

  assets.items
  .filter((a: any) => a.compression?.compressed === true)
  .map((a: any) => {
    console.log('compressed assets =>', a);
  });
};

getAssetsByOwner();

/*
% ts-node src/<THIS_FILE>

~~~ snip ~~~
compressed assets => {
  interface: 'V1_NFT',
  id: 'HaCuZEAAQq1fFjczHDMUvDrsfmMopFjGgQRAQ3aP1mBP',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://arweave.net/gfO_TkYttQls70pTmhrdMDz9pfMUXX8hZkaoIivQjGs',
    files: [ [Object], [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Deep in the heart of Dingus Forest echoes the sleepless cries of a troop of 10,000 apes. These aren’t just regular apes, however. These are degenerate apes.',
      name: 'Degen Ape #1338',
      symbol: 'DAPE',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://arweave.net/hdtrCCqLXF2UWwf3h6YEFj8VF1ObDMGfGeQheVuXuG4',
      external_url: ''
    }
  },
  authorities: [
    {
      address: '78EBP8tmVCcHv4XvhzHvbdKjLqJK5nC5VAzmSQ69UAeE',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '5rZPZirjSjGNDoTYft6Lwh9a5BxVBF43yX3KeyqE79yv',
    creator_hash: 'EKDHSGbrGztomDfuiV4iqiZ6LschDJPsFiXjZ83f92Md',
    asset_hash: 'Dk6t9Wyo1q3gg5qq98pnCR9sC8ZB4417NDWmHtontguV',
    tree: 'HXZdmTUvpxYHtpWu9mP3XnZEA3e2a22coMPu7ZsVgSFK',
    seq: 1,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'G2wj1cxXVFrw4ffGLdMcw1jJWS88nhV8mEoeYq4izny9'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0,
    basis_points: 0,
    primary_sale_happened: false,
    locked: false
  },
  creators: [],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 253 },
  mutable: false,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'HUotfePKvFWoCo7tYYv5YUkJZfif8sTbFNB2pn47Pt2u',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://supersweetcollection.notarealurl/token.json',
    files: [],
    metadata: { name: 'NFT Name', symbol: 'SSNC', token_standard: 'NonFungible' },
    links: {}
  },
  authorities: [
    {
      address: '58TAsmfPD2cgYKV8BB9nsmDonkEHu1WbmStTdkazDMUz',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'BqYcCNZ2vVPk3YMQT91qTRMBukPfu6HsH8iApXxCuuu8',
    creator_hash: 'DpjcjaovBVdccnWMicifk59uPh3so9BgFrVpLh3vS744',
    asset_hash: 'Ffpf9hs1nNbge3jK859wqrvWSXYWYZT1UD1y8Hm4kfvy',
    tree: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL',
    seq: 1,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'CdM9j5YLYZoUKkrRQZiL8H46g67nJYkrWkaPVbm2eCdk'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0,
    basis_points: 0,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: false
    },
    {
      address: 'GabUrH7mihCBxPPyhiM9BK3sK7tnmVtfLaZSULQzzp7J',
      share: 0,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 0 },
  mutable: false,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'GgJpXnVvKTzUo3ysc4Qy2gkseYf9zkEHMReGjEiRDbxR',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://ipfs.io/ipfs/QmdscY4eUDpGuhWfTrs4y9JRcAChio6HY6zpeuwMN7oS8N',
    files: [ [Object] ],
    metadata: {
      description: 'my first soap',
      name: 'my soap',
      symbol: 's',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://ipfs.io/ipfs/QmTwhK5re7Cgs5R2EKbxQA1dPqhhjZfdm8A3uewbx6fi1r'
    }
  },
  authorities: [
    {
      address: '2xwzxtQ8GHDZXTcEMAwt5JXfYdFH9UxNTyVvnwBVwgfE',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '5iMJc4hNJWBJzR8yDvgL2KSSfcHYbHwpmXbjfkFhoEme',
    creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
    asset_hash: '8D8mG7F1ZxKwpQJyCEGoUi4BmGtb2GBwLGAoqxmBRxix',
    tree: 'F7rvMFy8jywEn1pRrSFEZZtcXekNdQ2J7qzcPfAFxsbJ',
    seq: 1,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'GmmigEwjYJqvKa3we3YuQ1jxvuazBjwpEr452KPC1myH'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0,
    basis_points: 0,
    primary_sale_happened: true,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'GeJfzQ3MGrbMFA13WZ6qRuhvnGqWa3yGQTQ7fBYaESgc',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://supersweetcollection.notarealurl/token.json',
    files: [],
    metadata: { name: 'NFT Name', symbol: 'SSNC', token_standard: 'NonFungible' },
    links: {}
  },
  authorities: [
    {
      address: 'AHTuXQEnuXDk5CXwUzvggwSoaHTyARWRqU7dY1TeNaj4',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'EzTpuqPDDVikKjyJ8RCdCc1PktZ9PVzr3E5w82XdRJNd',
    creator_hash: 'D9ApYCzsbn21xLU7Q4MZ72PzhrwZXBHLoVFc5UL3b6nf',
    asset_hash: 'Efh4ycv7sF2krtAwvhQWatgco9v2hUEuDZX1JPzTW3Hv',
    tree: '3Geg5iKgHQLAjJCfynamHqZk6mxFjpnBoFevbvKbhgim',
    seq: 1,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: '9LhBzoEjqWLxU98SfeNqhJZiKzVv3gRwSHmZZRNWJLVC'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0,
    basis_points: 0,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: false
    },
    {
      address: '97cqzvqSCnVWFuxjGjvA5Artdy2Q1W5hyKGYxZaNpseQ',
      share: 0,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 0 },
  mutable: false,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'G9Xcip7wy7fiqS68mqFfZXJwiJuRTMVjCvmz49buoPmr',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
    files: [ [Object], [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Claynosaurz is a collection of 10,000 3D animated NFTs. Helmed by a team of leading animation and game industry artists, Claynosaurz aims to rewrite the narrative on how successful IP can be built out of web3. With massive potential for scaling, the Genesis collection is an all access pass to our Universe.',
      name: 'Claynosaurz #7316',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://nftstorage.link/ipfs/bafybeibhhh2mnebvajzdai4d7ar42m6s6pkvy7n7smgc6lpj4bp45qvj3y/7315.gif',
      external_url: 'https://twitter.com/Claynosaurz'
    }
  },
  authorities: [
    {
      address: '7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'HXtj6WSWfU4M63ALGmr2kjNAyHR9vUuX3Ly8cfFnnxgg',
    creator_hash: '5MhKaq3eEzsomVp5qU1EST7H9q8R9ndDxWuXeF6wbdgx',
    asset_hash: 'EVAPowPgFr162xyUZtvBMBHrJRD2kSSszpBWeyWT6pio',
    tree: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
    seq: 9,
    leaf_id: 7
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.05,
    basis_points: 500,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: true
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'G1R91L9hr2CGpZmP4ZybZmGf2k15WicP7VDz71UUDuUJ',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://arweave.net/10cxxU_JUbiFutymcZ9qfEQJEJ1opBFbB6MiirLiMbk',
    files: [ [Object] ],
    metadata: {
      attributes: [Array],
      description: 'My description',
      name: 'cNFT w/o Collection #2',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://arweave.net/DMCq2JU25KlM-CQDOEVPa83eIYe9QRsb6jDv5_p5ACU',
      external_url: 'https://example.com/'
    }
  },
  authorities: [
    {
      address: '7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'DrRX7fbm2Lbxf2y2MgncYtN3imBvBmLaM1AgFA6GDw9q',
    creator_hash: '5MhKaq3eEzsomVp5qU1EST7H9q8R9ndDxWuXeF6wbdgx',
    asset_hash: '13irux86Qydd66hJgz9uS6gMQNgAfL7YAhamTAUx4yHT',
    tree: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
    seq: 3,
    leaf_id: 2
  },
  grouping: [],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.05,
    basis_points: 500,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: true
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'Foz4XaMormi8WhoZKpEiLqwCPMp2epguhkZBKFv5Swvi',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://gameshift.storage.googleapis.com/dev/07a10ea8-d74a-48d6-afe9-250103ed846c/419d7c02-6f43-4a7e-b8a6-942c503de245.json',
    files: [ [Object] ],
    metadata: {
      attributes: [Array],
      description: 'my description',
      name: 'My an NFT',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://fastly.picsum.photos/id/971/200/200.jpg?hmac=xcJY-VNIH_UD01lMlLi4mADmQrLTgoEE2_NYEhL3VQA'
    }
  },
  authorities: [
    {
      address: 'EwWeE3zT4JkxQYPtHeXpbKKMDBQt1w9TMotZzRA7izLr',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '5TSQ3wkbhwcwfghwua7oeHZaftjMG6uBryfmygVX6NX5',
    creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
    asset_hash: 'EEdP86BGySC4AbmdVKWzei64Dw2TYj2QwtJy2QjkFKWr',
    tree: 'DBeptKKnYKMmBgfNfwogdPbbePbcM4BdLVPMBwZ7N5zN',
    seq: 58116,
    leaf_id: 29493
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'DyXjecbztTkBuSc2jeHtMpUAQpjzU9GnNbjRFDiLtvYx'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.05,
    basis_points: 500,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
compressed assets => {
  interface: 'V1_NFT',
  id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
    files: [ [Object], [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Claynosaurz is a collection of 10,000 3D animated NFTs. Helmed by a team of leading animation and game industry artists, Claynosaurz aims to rewrite the narrative on how successful IP can be built out of web3. With massive potential for scaling, the Genesis collection is an all access pass to our Universe.',
      name: 'cNFT in a Collection',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      external_url: 'https://twitter.com/Claynosaurz',
      image: 'https://nftstorage.link/ipfs/bafybeibhhh2mnebvajzdai4d7ar42m6s6pkvy7n7smgc6lpj4bp45qvj3y/7315.gif'
    }
  },
  authorities: [
    {
      address: 'GNfst5RPtrdv4AhnyBH3Zzz3cezUUztjw38TujRSfaE1',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'Ad645MeFx94jeh8xAdp7u8bnRfHa9RGaZZrWK5j5qcCY',
    creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
    asset_hash: '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
    tree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
    seq: 8,
    leaf_id: 7
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.05,
    basis_points: 500,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
*/
