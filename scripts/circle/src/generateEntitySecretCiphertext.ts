import dotenv from 'dotenv';
import { generateEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';

dotenv.config();

const API_KEY = process.env.API_KEY as string;
if (!API_KEY) {
  throw new Error('API_KEY is not set');
}

const ENTITY_SECRET = process.env.ENTITY_SECRET as string;
if (!ENTITY_SECRET) {
  throw new Error('ENTITY_SECRET is not set');
}

async function main() {
  const entitySecretCiphertext = await generateEntitySecretCiphertext({
    apiKey: API_KEY,
    entitySecret: ENTITY_SECRET,
  });
  console.log(entitySecretCiphertext);
}

main();
