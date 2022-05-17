export type clusterType = string;

export type mintNftType = {
  (connection: any, keypair:any, arweave: any, uploadMetadataTx: string): Promise<string>
};
