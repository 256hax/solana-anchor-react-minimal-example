import * as fs from 'fs';
import { arweaveCluster, initArweave, airdrop } from '../../helpers/arweave';

const arweave = initArweave(arweaveCluster.testnet_redstone);
const key = JSON.parse(fs.readFileSync('./src/keys/arweave.key.json', 'utf-8'));


jest.setTimeout(30000); // 1000 = 1sec

describe('arweaveHelpers', () => {
  it('airdrop', async() => {
    const address = await arweave.wallets.jwkToAddress(key);
    const balanceBefore = await arweave.wallets.getBalance(address);
    console.log('balanceBefore =>', balanceBefore);

    await airdrop(arweave, address);
    const balanceAfter = await arweave.wallets.getBalance(address);
    console.log('balanceAfter =>', balanceAfter);

    expect(Number(balanceAfter)).toBeGreaterThan(Number(balanceBefore));
  });
});
