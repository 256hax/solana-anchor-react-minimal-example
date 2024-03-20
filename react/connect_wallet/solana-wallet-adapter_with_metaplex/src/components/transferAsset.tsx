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
    const assetId = publicKey('GgJpXnVvKTzUo3ysc4Qy2gkseYf9zkEHMReGjEiRDbxR');

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
      <button onClick={transferringAsset}>transferringAsset(cNFT)</button>
    </div>
  );
};
