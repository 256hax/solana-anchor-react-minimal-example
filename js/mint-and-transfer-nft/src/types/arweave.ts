export type clusterType = {
  host: string;
  port: number;
  protocol: string;
};

/*
  args:
    arweave: Arweave.init<object>
*/
export type uploadImageType = {
  (arweave: any): Promise<string>
};

/*
  args:
    arweave: Arweave.init<object>
    uploadImageTx: Arweave transaction id (uploaded image)<string>
*/
export type uploadMetadataType = {
  (arweave: any, uploadImageTx: string, keypair: any): Promise<string>
};
