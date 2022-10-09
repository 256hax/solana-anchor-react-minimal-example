// Ref: https://github.com/metaplex-foundation/js#printnewedition
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // --- Airdrop ---
  let airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
  });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);
  // --- End Airdrop ---


  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: 'https://api.devnet.solana.com',
          timeout: 60000,
      }));
      // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
          name: "My NFT Metadata",
          description: "My description",
          image: "https://placekitten.com/200/300",
      })
      .run();

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
      .nfts()
      .create({
          uri: uri,
          name: "My NFT",
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          maxSupply: toBigNumber(2),
      })
      .run();

  // Ref:
  //  printNewEdition: https://github.com/metaplex-foundation/js#printnewedition
  //  Account Structure: https://docs.metaplex.com/programs/token-metadata/#printing-editions
  const { nft: printedNft } = await metaplex
    .nfts()
    .printNewEdition(nft.mintAddress)
    .run();

  // Ref: useNft: https://github.com/metaplex-foundation/js#usenft
  // const { nft: usedNft } = await mx.nfts().use(nft).run(); // Use once.
  // const { nft: usedNft } = await mx.nfts().use(nft, { numberOfUses: 3 }).run(); // Use three times.

  console.log('\n--- Master Edition(Original NFT) ------------------------------------');
  console.log('uri =>', uri);
  console.log('nft =>', nft);
  console.log('masterNft Address =>', nft.mintAddress.toString());

  console.log('\n--- Edition(Printed NFT) ------------------------------------');
  console.log('printedNft =>', printedNft);
  console.log('printedNft Address =>', printedNft.mintAddress.toString());

  if (printedNft.edition.isOriginal) {
      const totalPrintedNfts = printedNft.edition.supply;
      const maxNftsThatCanBePrinted = printedNft.edition.maxSupply;
  } else {
      const mintAddressOfOriginalNft = printedNft.edition.parent;
      const editionNumber = printedNft.edition.number;
      console.log('mintAddressOfOriginalNft =>', mintAddressOfOriginalNft.toString());
      console.log('editionNumber =>', Number(editionNumber));
  }
};

main();

/*
% ts-node <THIS FILE>

--- Master Edition(Original NFT) ------------------------------------
uri => https://arweave.net/fpL-_UdBHJ-FeCCzi77jQ595PYzE9_5Uojp0eQbLBTY
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: fa9f03671c3336e5d465e831cdcb1e15c3839ce0b2e8978368788375ce078ad2>,
    bump: 255
  },
  mintAddress: PublicKey {
    _bn: <BN: 621e10c6e178b49c00306efab884c1cd17ad3772a6e7bf27a91d57fb45d2287a>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: d8ce5a1b7eeaaadb031ed47cca13101f775d75081a5550a2a185347225f8e955>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/fpL-_UdBHJ-FeCCzi77jQ595PYzE9_5Uojp0eQbLBTY',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: fa9f03671c3336e5d465e831cdcb1e15c3839ce0b2e8978368788375ce078ad2>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 621e10c6e178b49c00306efab884c1cd17ad3772a6e7bf27a91d57fb45d2287a>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 839ccd6172c5fb98bc3dc338aa4d797d20e3846778815ddb8a29e415a6350a40>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 839ccd6172c5fb98bc3dc338aa4d797d20e3846778815ddb8a29e415a6350a40>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 839ccd6172c5fb98bc3dc338aa4d797d20e3846778815ddb8a29e415a6350a40>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 2>
  }
}
masterNft Address => 7c1YafuFkghERSXDhBkHNHYvCMiAbjfcX86nWJ4icA3T

--- Edition(Printed NFT) ------------------------------------
printedNft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: f7fcd5675a81cfd9e1059097e6a600035c09e683131661ebe5c2bcd32941787>,
    bump: 250
  },
  mintAddress: PublicKey {
    _bn: <BN: 441b92b158f3ae19eb85706050147bfb23bb4fbca5bbc08b13b45e01b8d7e9b0>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: d8ce5a1b7eeaaadb031ed47cca13101f775d75081a5550a2a185347225f8e955>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/fpL-_UdBHJ-FeCCzi77jQ595PYzE9_5Uojp0eQbLBTY',
  isMutable: false,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 251,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 3,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: f7fcd5675a81cfd9e1059097e6a600035c09e683131661ebe5c2bcd32941787>,
    bump: 250
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 441b92b158f3ae19eb85706050147bfb23bb4fbca5bbc08b13b45e01b8d7e9b0>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 1f5b6d4aa4c1451f314db5fed3a57cb36acb1ba2fbeff9b10f79940583ff786>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 1f5b6d4aa4c1451f314db5fed3a57cb36acb1ba2fbeff9b10f79940583ff786>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: false,
    address: Pda {
      _bn: <BN: 1f5b6d4aa4c1451f314db5fed3a57cb36acb1ba2fbeff9b10f79940583ff786>,
      bump: 251
    },
    parent: PublicKey {
      _bn: <BN: 839ccd6172c5fb98bc3dc338aa4d797d20e3846778815ddb8a29e415a6350a40>
    },
    number: <BN: 1>
  }
}
printedNft Address => 5as7LESYZMvrXwnp1TXXSFHBKgEPGmdwkW43uEMSEQ5u
mintAddressOfOriginalNft => PublicKey {
  _bn: <BN: 839ccd6172c5fb98bc3dc338aa4d797d20e3846778815ddb8a29e415a6350a40>
}
editionNumber => <BN: 1>

[Done] exited with code=0 in 73.963 seconds

[Running] ts-node "/Users/sxuser/Documents/Programming/Blockchain/solana-anchor-react-minimal-example/scripts/metaplex/latest/src/printNewEdition.ts"

--- Master Edition(Original NFT) ------------------------------------
uri => https://arweave.net/8hElY8MOZR2MpwQWubg11PYdbVqUEl5aIgH5FPopE7g
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 656220de27a5c8f67d86e627216bdfe28e7a13ca35079b619aa90d6b45fcd5fd>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: e37e26fb9c5dc70163473c4a3b316aab01f8768bf828aeaf157857b86cdd62cb>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 65c0ba95e65861222671f0f221b15f6d36a51e0d05a47a7a83f96cdbed40caec>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/8hElY8MOZR2MpwQWubg11PYdbVqUEl5aIgH5FPopE7g',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: 656220de27a5c8f67d86e627216bdfe28e7a13ca35079b619aa90d6b45fcd5fd>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: e37e26fb9c5dc70163473c4a3b316aab01f8768bf828aeaf157857b86cdd62cb>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 790b6b541112f9617d974690806d6a518f80a2ef6a53cffa9f1b504cb51ec2e9>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 790b6b541112f9617d974690806d6a518f80a2ef6a53cffa9f1b504cb51ec2e9>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 790b6b541112f9617d974690806d6a518f80a2ef6a53cffa9f1b504cb51ec2e9>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 2>
  }
}
masterNft Address => GK37nwa7Q691D976ZKK4dFQXppMqf5LbwT2xp9RstMiS

--- Edition(Printed NFT) ------------------------------------
printedNft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 1a685b8a65fa6f37ec4e14a76a28f2fd20b7b7198ffc7b19eaf4b9e30c4487a0>,
    bump: 255
  },
  mintAddress: PublicKey {
    _bn: <BN: ec28b1d0a8b4a36304e3cb7559454abe522ed9cdb7ff5c20f822181cc05baca8>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 65c0ba95e65861222671f0f221b15f6d36a51e0d05a47a7a83f96cdbed40caec>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/8hElY8MOZR2MpwQWubg11PYdbVqUEl5aIgH5FPopE7g',
  isMutable: false,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 3,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: 1a685b8a65fa6f37ec4e14a76a28f2fd20b7b7198ffc7b19eaf4b9e30c4487a0>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: ec28b1d0a8b4a36304e3cb7559454abe522ed9cdb7ff5c20f822181cc05baca8>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 9b827d68d02a2d3b503b089aba149a6bd227156902d6923d684a2c6e6b429c98>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 9b827d68d02a2d3b503b089aba149a6bd227156902d6923d684a2c6e6b429c98>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: false,
    address: Pda {
      _bn: <BN: 9b827d68d02a2d3b503b089aba149a6bd227156902d6923d684a2c6e6b429c98>,
      bump: 255
    },
    parent: PublicKey {
      _bn: <BN: 790b6b541112f9617d974690806d6a518f80a2ef6a53cffa9f1b504cb51ec2e9>
    },
    number: <BN: 1>
  }
}
printedNft Address => GtsD1w2h3jBkr2241TZr3BHFXrZ8dRsJ2Yj3dywV1W1M
mintAddressOfOriginalNft => 99WRynUdz9XPd8as9t8BsgsP9WCXxi2jhwGaLmjUCLEc
/Users/sxuser/Documents/Programming/Blockchain/solana-anchor-react-minimal-example/scripts/metaplex/latest/src/printNewEdition.ts:5
const main = async() => {
                                                         ^
TypeError: editionNumber.toBigNumber is not a function
    at /Users/sxuser/Documents/Programming/Blockchain/solana-anchor-react-minimal-example/scripts/metaplex/latest/src/printNewEdition.ts:85:53
    at Generator.next (<anonymous>)
    at fulfilled (/Users/sxuser/Documents/Programming/Blockchain/solana-anchor-react-minimal-example/scripts/metaplex/latest/src/printNewEdition.ts:5:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)

[Done] exited with code=1 in 73.738 seconds

[Running] ts-node "/Users/sxuser/Documents/Programming/Blockchain/solana-anchor-react-minimal-example/scripts/metaplex/latest/src/printNewEdition.ts"

--- Master Edition(Original NFT) ------------------------------------
uri => https://arweave.net/2FOp1hD3PdpBMLjtTB8JAZ6M9LpW7-6CdlTkWbcU_AI
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 3a8152126d92e44a9eff73f91050eabcaa0f67a9bcb708c2885be4b5bf97d459>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: 62f70b880c18fcaf02d5d7bed32ca85e8a5018f11bd0ac4f5217e2aac90afbc0>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 63a73609cf1c78a208e34081a5922a5ff78badabc9e1b74779fa6086ad2cac20>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/2FOp1hD3PdpBMLjtTB8JAZ6M9LpW7-6CdlTkWbcU_AI',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: 3a8152126d92e44a9eff73f91050eabcaa0f67a9bcb708c2885be4b5bf97d459>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 62f70b880c18fcaf02d5d7bed32ca85e8a5018f11bd0ac4f5217e2aac90afbc0>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: dd071af581f90fb8ea2515781c32bc05eb0767a84d4df4ef361d33898877f47d>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: dd071af581f90fb8ea2515781c32bc05eb0767a84d4df4ef361d33898877f47d>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: dd071af581f90fb8ea2515781c32bc05eb0767a84d4df4ef361d33898877f47d>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 2>
  }
}
masterNft Address => 7fKSeoH1a6oTFetgrBNuxZKg5ow4Pf5VAioRosQTzTCs

--- Edition(Printed NFT) ------------------------------------
printedNft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 582cbf925a8ddfb139fee63500336dc3b123ee19abd930f033eedc1ddf15a5c0>,
    bump: 253
  },
  mintAddress: PublicKey {
    _bn: <BN: 387e1bf6aea2c3c05b610fa72e7896b14c506e895e9ee88c5dd2a2bdc268808b>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 63a73609cf1c78a208e34081a5922a5ff78badabc9e1b74779fa6086ad2cac20>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/2FOp1hD3PdpBMLjtTB8JAZ6M9LpW7-6CdlTkWbcU_AI',
  isMutable: false,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 251,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 3,
  collection: null,
  uses: null,
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  metadataAddress: Pda {
    _bn: <BN: 582cbf925a8ddfb139fee63500336dc3b123ee19abd930f033eedc1ddf15a5c0>,
    bump: 253
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 387e1bf6aea2c3c05b610fa72e7896b14c506e895e9ee88c5dd2a2bdc268808b>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: e562ed1216801bfc1418b2a35d08670065914f193e9eb360bb6c5d1bed4880b6>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: e562ed1216801bfc1418b2a35d08670065914f193e9eb360bb6c5d1bed4880b6>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: false,
    address: Pda {
      _bn: <BN: e562ed1216801bfc1418b2a35d08670065914f193e9eb360bb6c5d1bed4880b6>,
      bump: 251
    },
    parent: PublicKey {
      _bn: <BN: dd071af581f90fb8ea2515781c32bc05eb0767a84d4df4ef361d33898877f47d>
    },
    number: <BN: 1>
  }
}
printedNft Address => 4oXN3Bv1TzzA8iTE9T8WvmTGg3mnx8MwbtpRXgF53An6
mintAddressOfOriginalNft => FsoPLjWDcUnp9dLDzrErdVjUsFCduzJcvBHqp1WpJDGp
editionNumber => 1
*/