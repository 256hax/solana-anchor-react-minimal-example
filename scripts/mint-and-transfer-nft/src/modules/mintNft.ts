// Ref: https://solanacookbook.com/references/nfts.html#mint-the-nft
import { actions, NodeWallet} from '@metaplex/js';
import { mintNftType } from '../types/solana';
// import { airdrop } from '../helpers/solana';
import { getArweaveTransactionUrl } from '../helpers/arweave';

export const mintNft: mintNftType = async(connection, keypair, arweave, uploadMetadataTx, maxSupply) => {
  // airdrop(connection, keypair.publicKey);

  // Note:
  //  Uploaded Arweave data need to comply Token Metadata Starndard.
  //  Details: https://docs.metaplex.com/token-metadata/specification
  //  Data Example: arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E
  //  Tutorial: https://solanacookbook.com/references/nfts.html#how-to-create-an-nft
  //
  // Important:
  //  You cannot mint an NFT with a different creator that your wallet. If you run into creator issues, make sure your metadata lists you as the creator.

  const uri = getArweaveTransactionUrl(arweave.api.config, uploadMetadataTx);

  const mintNFTResponse = await actions.mintNFT({
    connection,
    wallet: new NodeWallet(keypair),
    uri: uri,
    maxSupply: maxSupply
  });

  console.log('mint =>', mintNFTResponse.mint.toString());
  console.log('metadata =>', mintNFTResponse.metadata.toString());
  console.log('edition =>', mintNFTResponse.edition.toString());

  return mintNFTResponse.mint.toString();
};
