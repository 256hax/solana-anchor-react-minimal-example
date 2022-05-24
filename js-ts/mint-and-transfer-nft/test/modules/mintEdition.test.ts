import * as fs from 'fs';
import { sleep } from '../../src/helpers/utils';

import { arweaveCluster, initArweave } from '../../src/helpers/arweave';
import { solanaCluster, initSolana } from '../../src/helpers/solana';
import { Keypair, PublicKey } from '@solana/web3.js';
import { mintNft } from '../../src/modules/mintNft';
import { mintEdition } from '../../src/modules/mintEdition';

// --- Config Arweave ---
const arweave = initArweave(arweaveCluster.testnet_redstone);

// --- Config Solana ---
const connection = initSolana(solanaCluster.devnet);
const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./src/keys/solana.key.json', 'utf8')));
const keypair = Keypair.fromSecretKey(secretKey);


jest.setTimeout(20000); // 1000 = 1sec

describe('mintEdition', () => {
  it('Mint Master Edition(Multiple Supply)', async() => {
    // https://testnet.redstone.tools/cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro
    const uploadMetadataTx = 'cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro';
    const maxSupply = 3;
    const nftAddressMintMultipleSupply = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
    console.log('Master Edition Address(Original NFT) =>', nftAddressMintMultipleSupply);
    await sleep(2000); // 1000 == 1 sec. Wait for transaction.

    console.log('\n Mint Edition(Copy NFT from Master Edition)')
    const nftAddressMintMultipleSupplyStatus = PublicKey.isOnCurve(nftAddressMintMultipleSupply);
    if(nftAddressMintMultipleSupplyStatus){
      const editionAddressMint = await mintEdition(connection, keypair, nftAddressMintMultipleSupply);
      console.log('Edition Address(Copy NFT) =>', editionAddressMint);

      await sleep(2000); // 1000 == 1 sec. Wait for transaction.
      const expectString = expect.any(String);
      expect(editionAddressMint).toEqual(expectString);
    } else {
      console.log('Error: Solana NFT Address Not Found.');
      return;
    }
  });
});
