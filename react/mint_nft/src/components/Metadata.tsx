import React from 'react';
import { Arconnect } from './Arconnect';
import { UploadMetadata } from './UploadMetadata';
import ArTransactionIdProvider from '../providers/ArTransactionId';
import { Nft } from './Nft';

export const Metadata = () => {
  return (
    <div>
      <Arconnect />
      -----------------------------------------------------------------------
      <ArTransactionIdProvider>
        <UploadMetadata />
        <Nft />
      </ArTransactionIdProvider>
    </div>
  );
};
