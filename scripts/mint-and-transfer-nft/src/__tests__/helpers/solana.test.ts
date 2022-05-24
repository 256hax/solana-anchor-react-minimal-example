import * as fs from 'fs';

import { solanaCluster, initSolana, airdrop} from '../../helpers/solana';
import { Keypair } from '@solana/web3.js';

const connection = initSolana(solanaCluster.devnet);
const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./src/keys/solana.key.json', 'utf8')));
const keypair = Keypair.fromSecretKey(secretKey);


jest.setTimeout(30000); // 1000 = 1sec

describe('solanaHelpers', () => {
  it('airdrop', async() => {
    const address = keypair.publicKey;
    const balanceBefore = await connection.getBalance(address);
    console.log('balanceBefore =>', balanceBefore);

    await airdrop(connection, address);
    const balanceAfter = await connection.getBalance(address);
    console.log('balanceAfter =>', balanceAfter);

    expect(Number(balanceAfter)).toBeGreaterThan(Number(balanceBefore));
  });
});
