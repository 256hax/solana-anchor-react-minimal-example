// Ref: https://metaplex-foundation.github.io/js/modules/actions.html#mintEditionFromMaster
import { PublicKey } from '@solana/web3.js';
import { actions, NodeWallet} from '@metaplex/js';
import { mintEditionType } from '../types/solana';

export const mintEdition: mintEditionType = async(connection, keypair, masterEdition) => {
  const mintNFTResponse = await actions.mintEditionFromMaster({
    connection,
    wallet: new NodeWallet(keypair),
    masterEditionMint: new PublicKey(masterEdition)
  });

  console.log('mint =>', mintNFTResponse.mint.toString());
  console.log('metadata =>', mintNFTResponse.metadata.toString());
  console.log('edition =>', mintNFTResponse.edition.toString());

  return mintNFTResponse.mint.toString();
};
