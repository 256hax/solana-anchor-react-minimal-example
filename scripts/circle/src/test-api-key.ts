import dotenv from 'dotenv';
import { CircleDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

dotenv.config();

const API_KEY = process.env.API_KEY as string;
if (!API_KEY) {
  throw new Error('API_KEY is not set');
}

const ENTITY_SECRET = process.env.ENTITY_SECRET as string;
if (!ENTITY_SECRET) {
  throw new Error('ENTITY_SECRET is not set');
}

async function testApiKey() {
  try {
    console.log('Testing Circle SDK connection...');

    const circle = new CircleDeveloperControlledWalletsClient({
      apiKey: API_KEY,
      entitySecret: ENTITY_SECRET,
    });

    // Try to list wallets to test the connection
    const wallets = await circle.listWallets();
    console.log('✅ API key is valid! Found wallets:', wallets.data);
  } catch (error: any) {
    console.error('❌ API key test failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testApiKey();
