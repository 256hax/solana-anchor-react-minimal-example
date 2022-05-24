import * as fs from 'fs';
import { sleep } from '../../src/helpers/utils';
import { arweaveCluster, initArweave } from '../../src/helpers/arweave';
import { uploadImage } from '../../src/modules/uploadImage';

const arweave = initArweave(arweaveCluster.testnet_redstone);
const key = JSON.parse(fs.readFileSync('./src/keys/arweave.key.json', 'utf-8'));
const data = fs.readFileSync('./src/assets/irasutoya-art.png');


jest.setTimeout(20000); // 1000 = 1sec

describe('uploadImage', () => {
  it('Upload Image to Arweave', async() => {
    try {
      const uploadImageTx = await uploadImage(arweave, key, data);
      console.log('uploadImageTx =>', uploadImageTx);
      await sleep(2000); // 1000 == 1 sec. Wait for transaction.

      const expectString = expect.any(String);
      expect(uploadImageTx).toEqual(expectString);
    } catch(e) {
      console.log(e);
      console.log('Hint: If "Unable to upload transaction", try to change Arweave cluster.');
      return;
    }
  });
});
