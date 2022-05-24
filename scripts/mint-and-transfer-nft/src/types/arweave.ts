export type clusterType = {
  host: string;
  port: number;
  protocol: string;
};

/*
  args:
    arweave: Arweave.init<object>
    key: Arweave Key
    data: File Path
*/
export type uploadImageType = {
  (arweave: any, key: any, data: any): Promise<string>
};

/*
  args:
    arweave: Arweave.init<object>
    uploadImageTx: Arweave transaction id (uploaded image)<string>
    solanaCreatorsAddress: Creators Address(Public Key) in Solana
*/
export type uploadMetadataType = {
  (arweave: any, key: any, uploadImageTx: string, solanaCreatorsAddress: string): Promise<string>
};
