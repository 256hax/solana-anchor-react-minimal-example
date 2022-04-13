import React, { FC, createContext, useState } from "react";

const initialValue = { valArTransactionId: '', setNewArTransactionId: (id: string) => {} };
export const arTransactionIdContext = createContext(initialValue);

const ArTransactionIdProvider: FC = ({ children }) => {
  const [valArTransactionId, setArTransactionId] = useState('');

  const setNewArTransactionId = (id: string) => {
    setArTransactionId(id);
  };

  // return a context provider wrapping children
  return (
    <arTransactionIdContext.Provider value={{ valArTransactionId, setNewArTransactionId }}>
      {children}
    </arTransactionIdContext.Provider>
  );
};

export default ArTransactionIdProvider;
