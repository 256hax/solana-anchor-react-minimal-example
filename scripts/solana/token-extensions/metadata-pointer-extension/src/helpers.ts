import {clusterApiUrl, Connection, Keypair} from '@solana/web3.js'
import Irys from '@irys/sdk'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export interface CreateNFTInputs {
	payer: Keypair
	connection: Connection
	tokenName: string
	tokenSymbol: string
	tokenUri: string
	tokenAdditionalMetadata?: Record<string, string>
}

export interface UploadOffChainMetadataInputs {
	tokenName: string
	tokenSymbol: string
	tokenDescription: string
	tokenExternalUrl: string
	tokenAdditionalMetadata?: Record<string, string>
	imagePath: string
	metadataPath: string
}

function formatIrysUrl(id: string) {
	return `https://gateway.irys.xyz/${id}`
}

const getIrysArweave = async (secretKey: Uint8Array) => {
	const irys = new Irys({
		network: 'devnet',
		token: 'solana',
		key: secretKey,
		config: {
			providerUrl: clusterApiUrl('devnet'),
		},
	})
	return irys
}

export async function uploadOffChainMetadata(
	inputs: UploadOffChainMetadataInputs,
	payer: Keypair
) {
	const {
		tokenName,
		tokenSymbol,
		tokenDescription,
		tokenExternalUrl,
		imagePath,
		tokenAdditionalMetadata,
		metadataPath,
	} = inputs

	const irys = await getIrysArweave(payer.secretKey)

	const imageUploadReceipt = await irys.uploadFile(imagePath)

	const metadata = {
		name: tokenName,
		symbol: tokenSymbol,
		description: tokenDescription,
		external_url: tokenExternalUrl,
		image: formatIrysUrl(imageUploadReceipt.id),
		attributes: Object.entries(tokenAdditionalMetadata || []).map(
			([trait_type, value]) => ({trait_type, value})
		),
	}

	fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 4), {
		flag: 'w',
	})

	const metadataUploadReceipt = await irys.uploadFile(metadataPath)

	return formatIrysUrl(metadataUploadReceipt.id)
}
