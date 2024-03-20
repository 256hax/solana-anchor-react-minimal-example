// Metaplex
import { publicKey } from '@metaplex-foundation/umi';

// Modules
import { useUmi } from '../hooks/useUmi';

export const GetAssetsByOwner = () => {
  const umi = useUmi();

  const getAssets = async () => {
    const owner = publicKey(umi.payer.publicKey);
    const assets = await umi.rpc.getAssetsByOwner({ owner });

    assets.items
      .filter((a: any) => a.compression?.compressed === true)
      .map((a: any) => {
        console.log('compressed assets =>', a);
      });
  };

  return (
    <div>
      <button onClick={getAssets}>GetAssetsByOwner(filtering cNFT)</button>
    </div>
  );
};
