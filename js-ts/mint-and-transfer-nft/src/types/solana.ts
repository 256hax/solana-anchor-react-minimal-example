export type clusterType = string;

export type mintNftType = {
  (connection: any, keypair:any, arweave: any, uploadMetadataTx: string): Promise<string>
};

export type transferNftType = {
  (connection: any, keypair:any, mintNftAddress: string): void
};
