// Lib
import * as bs58 from 'bs58';

// Metaplex
import { publicKey } from '@metaplex-foundation/umi';
import {
  getAssetWithProof,
  transfer,
} from '@metaplex-foundation/mpl-bubblegum';

// Modules
import { useUmi } from '../hooks/useUmi';

export const TransferAsset = () => {
  const umi = useUmi();

  const transferringAsset = async () => {
    // cNFT(Asset ID)
    const assetId = publicKey('8fEjg7H3Q4wJHGPEL5jeGXH39ETegd3U9BKxzZ1EyZVa');

    // From
    const currentLeafOwner = publicKey(
      'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    );

    // To
    const newLeafOwner = publicKey(
      '55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK'
    );

    // Transfer cNFT
    const assetWithProof = await getAssetWithProof(umi, assetId);
    const result = await transfer(umi, {
      ...assetWithProof,
      leafOwner: currentLeafOwner,
      newLeafOwner: newLeafOwner,
    }).sendAndConfirm(umi);

    console.log('Signature =>', bs58.encode(result.signature));
  };

  return (
    <div>
      <div>Note: Replace to your Asset ID and Leaf Owner in transferAsset.tsx</div>
      <button onClick={transferringAsset}>transferringAsset(cNFT)</button>
    </div>
  );
};
