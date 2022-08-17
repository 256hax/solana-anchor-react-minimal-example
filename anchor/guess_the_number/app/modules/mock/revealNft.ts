export const revealNft = () => {
  const nftQMetadata = {
    name: 'Number 1',
    attributes: [
      {
          "trait_type": 'Prize(SOL)',
          "value": 0.01
      }
    ]
  };

  const signature = 'dummy';
  const nftQName = 'Number 1';
  const nftQPrize = 0.01;
  

  return [signature, nftQName, nftQPrize]
};