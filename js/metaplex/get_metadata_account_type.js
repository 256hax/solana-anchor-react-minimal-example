// Ref: https://docs.metaplex.com/sdk/js/getting-started#how-to-retrieve-data-by-other-programs
import { Connection, programs } from '@metaplex/js';
const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: { Auction }, vault: { Vault } } = programs;

const connection = new Connection('devnet');
const tokenPublicKey = 'ECeH95TYYt6da389Y9ab6gFBHpjewUn7C2p6Af4iPtt3';

const run = async () => {
  try {
    const metadata        = await Metadata.load(connection, tokenPublicKey);
    // const auction         = await Auction.load(connection, tokenPublicKey);
    // const vault           = await Vault.load(connection, tokenPublicKey);
    // const auctionManager  = await AuctionManager.load(connection, tokenPublicKey);
    // const store           = await Store.load(connection, tokenPublicKey);

    console.log(metadata);
    // console.log(auction);
    // console.log(vault);
    // console.log(auctionManager);
    // console.log(store);
  } catch {
    console.log('Failed to fetch metadata');
  }
};

run();
