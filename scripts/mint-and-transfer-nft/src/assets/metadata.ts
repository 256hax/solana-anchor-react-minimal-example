/*
  Ref:
    Token Metadata Standard: https://docs.metaplex.com/token-metadata/Versions/v1.0.0/nft-standard
*/
export const initMetadata = {
  name: 'SMB #1355',
  symbol: 'SMB',
  description: "SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.",
  seller_fee_basis_points: 500, // 500 = 5%
  image: '',
  external_url: 'https://solanamonkey.business/',
  collection: {
    name: 'SMB Gen2',
    family: 'SMB',
  },
  attributes: [
    {
      trait_type: "Attributes Count",
      value: 2
    },
    {
      trait_type: "Type",
      value: "Skeleton"
    },
    {
      trait_type: "Clothes",
      value: "Orange Jacket"
    },
    {
      trait_type: "Ears",
      value: "None"
    },
    {
      trait_type: "Mouth",
      value: "None"
    },
    {
      trait_type: "Eyes",
      value: "None"
    },
    {
      trait_type: "Hat",
      value: "Crown"
    }
  ],
  properties: {
    creators: [
      {
        address: '',
        share: 100,
      }
    ]
  }
};
