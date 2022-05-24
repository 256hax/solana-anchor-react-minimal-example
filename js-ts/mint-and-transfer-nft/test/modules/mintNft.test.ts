import * as fs from 'fs';
import { sleep } from '../../src/helpers/utils';

import { arweaveCluster, initArweave } from '../../src/helpers/arweave';
import { solanaCluster, initSolana } from '../../src/helpers/solana';
import { Keypair } from '@solana/web3.js';
import { mintNft } from '../../src/modules/mintNft';

// --- Config Arweave ---
const arweave = initArweave(arweaveCluster.testnet_redstone);

// --- Config Solana ---
const connection = initSolana(solanaCluster.devnet);
const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./src/keys/solana.key.json', 'utf8')));
const keypair = Keypair.fromSecretKey(secretKey);

describe('mintNft', () => {
  it('Mint NFT on Solana', async() => {
    // https://testnet.redstone.tools/cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro
    const uploadMetadataTx = 'cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro';
    const uploadMetadataTxStatus = await arweave.transactions.getStatus(uploadMetadataTx);

    if(uploadMetadataTxStatus.status == 200) {
      const maxSupply = 1;
      const nftAddressMint = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
      console.log('NFT Address =>', nftAddressMint);
      await sleep(2000); // 1000 == 1 sec. Wait for transaction.

      const expectString = expect.any(String);
      expect(nftAddressMint).toEqual(expectString);
    } else {
      console.log('Error: Arweave Transaction ID not found. Try to change Arweave cluster or make sure exist Metadata data in Arweave.')
      console.log('uploadMetadataTxStatus =>', uploadMetadataTxStatus);
      return;
    }
  });
});
