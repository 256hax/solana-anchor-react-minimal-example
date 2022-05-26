export type clusterType = {
  host: string;
  port: number;
  protocol: string;
};

/*
  Args:
    arweave: Arweave.init
    key: Arweave Wallet Key
    data: File Path
*/
export type uploadImageType = {
  (arweave: any, key: any, data: any): Promise<string>
};

/*
  Args:
    arweave: Arweave.init
    key: Arweave Wallet Key
    uploadImageTx: Arweave transaction id (uploaded image)
    solanaCreatorsAddress: Creators Address(Public Key) in Solana
*/
export type uploadMetadataType = {
  (arweave: any, key: any, uploadImageTx: string, solanaCreatorsAddress: string): Promise<string>
};
