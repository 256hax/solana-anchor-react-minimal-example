import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { uploadOffChainMetadata } from "./helpers";
import createNFTWithEmbeddedMetadata from "./nft-with-embedded-metadata";
import dotenv from "dotenv";
dotenv.config();

const connection = new Connection(clusterApiUrl("devnet"), "finalized");

const payerSecretKey = process.env.PAYER_SECRET_KEY;
if (!payerSecretKey) throw new Error('payerSecretKey not found.');
const secretKey = Uint8Array.from(JSON.parse(payerSecretKey));
const payer = Keypair.fromSecretKey(secretKey);

const imagePath = "src/cat.png";
const metadataPath = "src/temp.json";
const tokenName = "Cat NFT";
const tokenDescription = "This is a cat";
const tokenSymbol = "EMB";
const tokenExternalUrl = "https://solana.com/";
const tokenAdditionalMetadata = {
  species: "Cat",
  breed: "Cool",
};

const tokenUri = await uploadOffChainMetadata(
  {
    tokenName,
    tokenDescription,
    tokenSymbol,
    imagePath,
    metadataPath,
    tokenExternalUrl,
    tokenAdditionalMetadata,
  },
  payer,
);

// You can log the URI here and run the code to test it
console.log("Token URI:", tokenUri);

await createNFTWithEmbeddedMetadata({
  payer,
  connection,
  tokenName,
  tokenSymbol,
  tokenUri,
});