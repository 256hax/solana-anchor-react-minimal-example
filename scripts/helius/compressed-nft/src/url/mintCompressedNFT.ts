// Docs:
//  https://www.helius.dev/blog/all-you-need-to-know-about-compression-on-solana#minting-cnfts-with-helius
//  https://docs.helius.dev/compression-and-das-api/mint-api
//  https://www.npmjs.com/package/helius-sdk#mint-api
import * as dotenv from 'dotenv';

const mintCompressedNft = async () => {
  dotenv.config();

  const url = process.env.HELIUS_API_WITH_URL;
  if (!url) throw new Error('url not found.');

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "helius-test",
      method: "mintCompressedNft",
      params: {
        name: "202401 Exodia the Forbidden One",
        symbol: "ETFO",
        owner: "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
        description:
          "Exodia the Forbidden One is a powerful, legendary creature composed of five parts: " +
          "the Right Leg, Left Leg, Right Arm, Left Arm, and the Head. When all five parts are assembled, Exodia becomes an unstoppable force.",
        attributes: [
          {
            trait_type: "Type",
            value: "Legendary",
          },
          {
            trait_type: "Power",
            value: "Infinite",
          },
          {
            trait_type: "Element",
            value: "Dark",
          },
          {
            trait_type: "Rarity",
            value: "Mythical",
          },
        ],
        imageUrl:
          "https://cdna.artstation.com/p/assets/images/images/052/118/830/large/julie-almoneda-03.jpg?1658992401",
        externalUrl: "https://www.yugioh-card.com/en/",
        sellerFeeBasisPoints: 500, // Represents 5.00%.
      },
    }),
  });
  const { result } = await response.json();
  console.log("Minted asset: ", result.assetId);
};
mintCompressedNft();

/*
% ts-node src/<THIS_FILE>

Minted asset:  8xGY3z6evWkNbRPzsLsE7duRDxuQWtyAdmEmVdzAQvq3
*/