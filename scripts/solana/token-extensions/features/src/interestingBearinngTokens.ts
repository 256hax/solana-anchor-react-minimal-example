// Docs: https://spl.solana.com/token-2022/extensions#interest-bearing-tokens
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createInterestBearingMint, updateRateInterestBearingMint, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const payer = Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  const rateAuthority = Keypair.generate();
  const mintKeypair = Keypair.generate();
  const rate = 10;
  const decimals = 9;
  
  const mint = await createInterestBearingMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    rateAuthority.publicKey,
    rate,
    decimals,
    mintKeypair,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log('mint =>', mint.toString());
})();