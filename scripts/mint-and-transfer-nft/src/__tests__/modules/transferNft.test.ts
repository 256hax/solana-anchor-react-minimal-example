import * as fs from 'fs';
import { sleep } from '../../helpers/utils';

import { arweaveCluster, initArweave } from '../../helpers/arweave';
import { solanaCluster, initSolana } from '../../helpers/solana';
import { Keypair, PublicKey } from '@solana/web3.js';
import { mintNft } from '../../modules/mintNft';
import { transferNft } from '../../modules/transferNft';

// --- Config Arweave ---
const arweave = initArweave(arweaveCluster.testnet_redstone);

// --- Config Solana ---
const connection = initSolana(solanaCluster.devnet);
const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./src/keys/solana.key.json', 'utf8')));
const keypair = Keypair.fromSecretKey(secretKey);


jest.setTimeout(30000); // 1000 = 1sec

describe('transferNft', () => {
  it('Transfer NFT to Someone', async() => {
    // https://testnet.redstone.tools/cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro
    const uploadMetadataTx = 'cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro';
    const maxSupply = 1;
    const nftAddressMint = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
    await sleep(2000); // 1000 == 1 sec. Wait for transaction.

    const nftAddressMintIsValid = PublicKey.isOnCurve(nftAddressMint);

    if(nftAddressMintIsValid) {
      const transferNftTx = await transferNft(connection, keypair, nftAddressMint); // Do not remove "await"
      await sleep(2000); // 1000 == 1 sec. Wait for transaction.

      const expectString = expect.any(String);
      expect(transferNftTx).toEqual(expectString);
    } else {
      console.log('Error: Solana NFT Address Not Found.');
      return;
    }
  });
});
