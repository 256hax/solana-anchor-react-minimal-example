export type clusterType = string;

export type mintNftType = {
  (connection: any, keypair:any, arweave: any, uploadMetadataTx: string, maxSupply: number): Promise<string>
};

export type transferNftType = {
  (connection: any, keypair:any, mintNftAddress: string): void
};

export type mintEditionType = {
  (connection: any, keypair:any, masterEdition: string): Promise<string>
}
