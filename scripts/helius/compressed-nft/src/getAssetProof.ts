// Docs: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-asset-proof
import * as dotenv from 'dotenv';

const getAssetProof = async () => {
  dotenv.config();

  const url = process.env.HELIUS_API_WITH_URL;
  if (!url) throw new Error('url not found.');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetProof',
      params: {
        id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
      },
    }),
  });

  const { result } = await response.json();
  console.log('Assets Proof: ', result);
};

getAssetProof();

/*
% ts-node src/<THIS_FILE>

Assets Proof:  {
  root: 'GF27nRBdibiqnPLH1G98Agj13Q423SSRYUStc6F8BFTJ',
  proof: [
    'CMgchHbpYPYu5MpxGRFhtHRBeABicbhWVkP3958TPtjB',
    'DD3L4Z8SA73NGLqGBpM17w65X97cZn595vvdddE5k14L',
    'AXmXpUFx1SsEEYTJT1FvihogRxzHALVhQsdXAoHLherw'
  ],
  node_index: 15,
  leaf: '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
  tree_id: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT'
}
*/
