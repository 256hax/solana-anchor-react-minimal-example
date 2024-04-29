import * as dotenv from 'dotenv';
import { Helius } from 'helius-sdk';

const getAssetProof = async () => {
  dotenv.config();

  const heliusApiKey = process.env.HELIUS_API_KEY;
  if (!heliusApiKey) throw new Error('heliusApiKey not found.');
  const helius = new Helius(heliusApiKey, 'devnet');

  const response = await helius.rpc.getAssetProof({
    id: 'CgQx8YiBKKtCBGxSbZrNQ6gZJoTbmaKqpaL5EbM2R66n',
  });
  console.log(response);
};

getAssetProof();

/*
ts-node src/sdk/getAssetProof.ts
{
  root: 'BkSHKg1vquRasFf3kZhkfNUF6MWUe6NmpLHHN4SiGRV5',
  proof: [
    'f3ahrUuVC5PWkBb92PA4zBxAiTXdTgE5StwfAnv4Qsr',
    '7iEwUeyPx8VgCLw5LGq1wNS7tktSJQu54DhFhUwDr4NU',
    'HzyvQiN4pikYXCKHEz7mtsMNLphm5puXSjQQ443MVHMu',
    '3HCYqQRcQSChEuAw1ybNYHibrTNNjzbYzm56cmEmivB6',
    'HZAcvEJtwL16EAgA7K7SPit8Bfe7MxxdgerMLCKwPDud',
    'zLUDhASAn7WA1Aqc724azRpZjKCjMQNATApe74JMg8C',
    '4381KFDtcGaXCKF4xYzyz46AJxv9nfG4GYE9BuC4iLip',
    '2kM9SuGcYCS18rtnDFYVhiETvVFne9AEimq7zxBpYUwE',
    'BFvmeiEuzAYcMR8YxcuCMGYPDpjcmP5hsNbcswgQ8pMc',
    'EvxphsdRErrDMs9nhFfF4nzq8i1C2KSogA7uB96TPpPR',
    'HpMJWAzQv9HFgHBqY1o8V1B27sCYPFHJdGivDA658jEL',
    'HjnrJn5vBUUzpCxzjjM9ZnCPuXei2cXKJjX468B9yWD7',
    '4YCF1CSyTXm1Yi9W9JeYevawupkomdgy2dLxEBHL9euq',
    'E3oMtCuPEauftdZLX8EZ8YX7BbFzpBCVRYEiLxwPJLY2'
  ],
  node_index: 16599,
  leaf: 'DF3LkGzV1ivsUqSg2zDSejNjb6PniauZt1SKFCRU5R6u',
  tree_id: '81WgE6NEKLT71YQpySphUE59oicJX3QRmRNZmijNvmzq'
}
*/