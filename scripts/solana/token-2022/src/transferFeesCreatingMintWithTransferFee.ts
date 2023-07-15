// Docs: https://spl.solana.com/token-2022/extensions#example-creating-a-mint-with-a-transfer-fee
import {
	clusterApiUrl,
	sendAndConfirmTransaction,
	Connection,
	Keypair,
	SystemProgram,
	Transaction,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import {
	ExtensionType,
	createInitializeMintInstruction,
	mintTo,
	createAccount,
	getMintLen,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

import {
	createInitializeTransferFeeConfigInstruction,
	harvestWithheldTokensToMint,
	transferCheckedWithFee,
	withdrawWithheldTokensFromAccounts,
	withdrawWithheldTokensFromMint,
} from '@solana/spl-token';

(async () => {
	const payer = Keypair.generate();

	const mintAuthority = Keypair.generate();
	const mintKeypair = Keypair.generate();
	const mint = mintKeypair.publicKey;
	const transferFeeConfigAuthority = Keypair.generate();
	const withdrawWithheldAuthority = Keypair.generate();

	const extensions = [ExtensionType.TransferFeeConfig];

	const mintLen = getMintLen(extensions);
	const decimals = 9;
	const feeBasisPoints = 50;
	const maxFee = BigInt(5_000);

	// const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
	const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

	const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
	await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

	const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);
	const mintTransaction = new Transaction().add(
		SystemProgram.createAccount({
			fromPubkey: payer.publicKey,
			newAccountPubkey: mint,
			space: mintLen,
			lamports: mintLamports,
			programId: TOKEN_2022_PROGRAM_ID,
		}),
		createInitializeTransferFeeConfigInstruction(
			mint,
			transferFeeConfigAuthority.publicKey,
			withdrawWithheldAuthority.publicKey,
			feeBasisPoints,
			maxFee,
			TOKEN_2022_PROGRAM_ID
		),
		createInitializeMintInstruction(mint, decimals, mintAuthority.publicKey, null, TOKEN_2022_PROGRAM_ID)
	);

	const signature = await sendAndConfirmTransaction(connection, mintTransaction, [payer, mintKeypair], undefined);
	console.log('signature =>', signature);
})();