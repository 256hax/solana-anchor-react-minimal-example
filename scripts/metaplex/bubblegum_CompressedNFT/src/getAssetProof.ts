// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetProof = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // Public RPC unavailbale DAS on Devnet. Use following RPC:
  //  https://developers.metaplex.com/bubblegum/rpcs
  const endpoint = 'https://api.mainnet-beta.solana.com';
  const umi = createUmi(endpoint).use(dasApi());

  // -------------------------------------
  //  Get an Asset Proof
  // -------------------------------------
  const assetId = publicKey('Bvnw4J2ijQ2ht9uhnEDzGaGndg9rAdwUPfan62L4touT');
  const proof = await umi.rpc.getAssetProof(assetId);

  console.log('assetId =>', assetId);
  console.log('proof =>', proof);
};

getAssetProof();

/*
% ts-node src/<THIS_FILE>

assetId => Bvnw4J2ijQ2ht9uhnEDzGaGndg9rAdwUPfan62L4touT
proof => {
  root: 'A3m4aETnA2nZsHx7urjpQBNbaiwuxF2XKGAL76rBvuLn',
  proof: [
    'CQdXsZz5oKGxEMv31uTepotRA8q41C6qvb8Y8A3fMkAe',
    '8n7Nc7NaRfDrjg5744vWj9WT7a7KZqzCa5Z2X5YD4CQM',
    'NAaawfPwqaegQEcwCqaqBv1MSuBKe84y57gsFpJxkZN',
    'FKqcnPbUQ8UJZKrEXZ5Ry1sQe34gDLtf85vvTeY4pTby',
    '5oFg8spYLZGTdtgjjAFrG1Axvvd5EA455jAqshxgpsBY',
    'FWGK6NKjuT4b5EWGPd8z9zEjUC1X3ZtP7tLUAbuJsZ2b',
    '8KxqxukK77KTigjxrsGjx7DU3Z7tMwDBib5eFaNZRwAy',
    'A7F47gwfEd4jVxxEMaVKMiLcmVyyT9s7xiBhstQ3ByHN',
    'GqFjBCuyxaTaebbeQtcQtjT6DNDBkyvomBnymeiGNN8F',
    '3ViQykBynELgWU2zpppxF8e5TbvfrENKE4MJtMvrQY9o',
    'Dsy3zfShRDAK6vaXYJfkzh4xs2rP7QBHrAQczP1WHHJF',
    'trSX1yGzdUASCzGEVt9jSP6fdBNjuPAqrHkrz7dBj8r',
    '2Q8CuqmZ3msfJCLh9XJqRa9eXhfimTFGhLuBDd3Aq9JE',
    'ADdCQM4FuKgAzdbNYdrUjxQzEFteF4MskE6a9nzAq6EU',
    '7DHwevnvjonPK9L7XgFYMysyyJuf4cugnNjCQ89DyUbz',
    'FhsNgK6GGU1cRPFbmPhrEZ95Zj8vorjK6GmhFuwmZsUm',
    '32UGNQxhsJp6RDWMKiYC46oGRhLyb9HcqdKgv8RgMB9K',
    'GCXyEHiFMtRFTNFT5LNHwxiXZfooBpUMGSkjyz7pfcS5',
    '752CmMF5k7acEFEmJA7oE3aobbWj7CAZVm3KpDR6HiRV',
    'D9GGr1ycBmgRbHJyJzmxMk5aoKZmjdezB4NpxopAcgpP'
  ],
  node_index: 1121399,
  leaf: '76V78ZqLJMjnpkj5ZEiV8StmJZxNF2SEnnPcLEEV7JQK',
  tree_id: '31iJeZ7Sg452LMvVTjsNhwhYCUdneHJHFFawqAbGb1W7'
}
*/
