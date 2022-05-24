import * as fs from 'fs';
import { sleep } from '../../src/helpers/utils';
import { Keypair } from '@solana/web3.js';
import { arweaveCluster, initArweave } from '../../src/helpers/arweave';
import { uploadMetadata } from '../../src/modules/uploadMetadata';

// --- Config Arweave ---
const arweave = initArweave(arweaveCluster.testnet_redstone);
const key = JSON.parse(fs.readFileSync('./src/keys/arweave.key.json', 'utf-8'));

// --- Config Solana ---
const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./src/keys/solana.key.json', 'utf8')));
const keypair = Keypair.fromSecretKey(secretKey);
const solanaCreatorsAddress = keypair.publicKey.toString()

jest.setTimeout(20000); // 1000 = 1sec

describe('uploadMetadata', () => {
  it('Upload Metadata to Arweave', async() => {
    // https://testnet.redstone.tools/cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro
    const uploadImageTx = 'cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro';
    const uploadImageTxStatus = await arweave.transactions.getStatus(uploadImageTx);

    if(uploadImageTxStatus.status == 200) { // 200: Exist data in Arweave
      const uploadMetadataTx = await uploadMetadata(arweave, key, uploadImageTx, solanaCreatorsAddress);
      console.log('uploadMetadataTx =>', uploadMetadataTx);
      await sleep(2000); // 1000 == 1 sec. Wait for transaction.

      const expectString = expect.any(String);
      expect(uploadMetadataTx).toEqual(expectString);
    } else {
      console.log('Error: Arweave Transaction ID not found. Try to change Arweave cluster or make sure exist image data in Arweave.')
      console.log('uploadImageTxStatus =>', uploadImageTxStatus);
      return;
    }
  });
});
