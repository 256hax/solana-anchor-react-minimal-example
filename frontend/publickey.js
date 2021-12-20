// Ref: https://docs.solana.com/developing/clients/javascript-reference#publickey
const {Buffer} = require('buffer');
const web3 = require('@solana/web3.js');
const crypto = require('crypto');

async function main() {
  // Create a PublicKey with a base58 encoded string
  let base58publicKey = new web3.PublicKey('5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj');
  console.log(base58publicKey.toBase58());

  // Create a Program Address
  let highEntropyBuffer = crypto.randomBytes(31);
  let programAddressFromKey = await web3.PublicKey.createProgramAddress([highEntropyBuffer.slice(0, 31)], base58publicKey);
  console.log(`Generated Program Address: ${programAddressFromKey.toBase58()}`);

  // Find Program address given a PublicKey
  let validProgramAddress = await web3.PublicKey.findProgramAddress([Buffer.from('', 'utf8')], programAddressFromKey);
  console.log(`Valid Program Address: ${validProgramAddress}`);
}

main();
/*
(first)
% node publickey.js
5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj
Generated Program Address: 2ZL1DSSHdpSuyQZmmRECfDH9CpBvnt1iD4ukfu2YnhcF
Valid Program Address: 6TLahm8dkEKv2twdA1dWDruJ5PJe6MeHG31EqDGbJHwR,252

(second)
% node publickey.js
5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj
Generated Program Address: Aes5vrPYcfVbQJGn3UwQFLVgtRxDWz6sw7wCyjN2uFbv
Valid Program Address: FswPzw7EQPYH3XdsAAMi6968pDsPxFdjiBYQwHoVuoZ9,254
*/
