// Source: https://gist.github.com/dvcrn/a1b0ff0a0b4b3ab02aff44bc84ac4522

import { Connection } from "@metaplex/js";
import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

const connection = new Connection("devnet");
const token_address = "EBaPxzh21wF3e56pt8XLR578KyFHYHFPdfwh939AmPiJ";

async function main() {
  const metadata_pda = await Metadata.getPDA(token_address);
  const mint_account_info = await connection.getAccountInfo(metadata_pda);
  const metadata = Metadata.from(new Account(token_address, mint_account_info));

  console.log('metadata_pda =>', metadata_pda.toString());
  console.log('mint_account_info =>', mint_account_info);
  console.log('metadata =>', metadata.data['data']);
}

main();


/*
% node <this JS file>
metadata_pda => 4xHtfjprxBK423wfinNjdxiPJUWmNGnvct7ataYkkRvw
mint_account_info => {
  data: <Buffer 04 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 c3 dd 7f c2 71 74 01 f6 c0 c4 a0 41 34 d7 95 de 4a ... 629 more bytes>,
  executable: false,
  lamports: 5616720,
  owner: PublicKey {
    _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
  },
  rentEpoch: 265
}
metadata => MetadataDataData {
  name: 'Number #0007',
  symbol: 'NB',
  uri: 'https://arweave.net/tjl4CRQ-OmqAcSr_tsAwsi84Q7YoY3XSiEU3riJuki4',
  sellerFeeBasisPoints: 500,
  creators: [
    Creator {
      address: '2ojkSMS66nDvUyhHU3y5Y3VuvD4Kkx3EPXHtg941wptg',
      verified: 1,
      share: 0
    },
    Creator {
      address: '2SN6o2mb4DFBEgSNcDqcdN5HWqa38xyF6F6xtTQ3HRwn',
      verified: 0,
      share: 100
    }
  ]
}
*/
