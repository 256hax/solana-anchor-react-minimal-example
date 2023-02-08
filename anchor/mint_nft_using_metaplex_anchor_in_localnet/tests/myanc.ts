import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Myanc } from "../target/types/myanc";

import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toBigNumber,
  mockStorage
} from "@metaplex-foundation/js";

describe("myanc", () => {
  const provider: any = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myanc as Program<Myanc>;


  it("Mint NFT", async () => {
    // const connection = new Connection(clusterApiUrl("devnet"));
    const connection = provider.connection;

    // ------------------------------------
    //  Make Metaplex
    // ------------------------------------
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(provider.wallet.payer))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }));

    // ------------------------------------
    //  Mint NFT
    // ------------------------------------
    const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
        name: "My NFT Metadata",
        description: "My description",
        image: "https://placekitten.com/100/100",
      });

    console.log('uri =>', uri);

    const { nft } = await metaplex
      .nfts()
      .create({
        uri: uri,
        name: "My NFT",
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        maxSupply: toBigNumber(1),
      });

    console.log('nft.address =>', nft.address.toString());
    console.log('nft =>', nft);

    // ------------------------------------
    //  Use Mock
    // ------------------------------------
    // const metaplex = Metaplex.make(connection)
    //   .use(keypairIdentity(wallet))
    //   .use(mockStorage());

    // const { uri } = await metaplex
    //   .nfts()
    //   .uploadMetadata({
    //     name: "My NFT Metadata",
    //     description: "My description",
    //     image: "https://placekitten.com/200/300",
    //   });

    // const fakeNft = await metaplex.storage().download(uri);
    // console.log('fakeNft =>', fakeNft.buffer.toString());
  });
});
