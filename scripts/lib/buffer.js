/*
Use case: Conver Instruction Data(Hex) on Solana Explorer to text.
*/
const textToHex = Buffer.from('hello!').toString('hex')
console.log(textToHex); // => 68656c6c6f21

const hex = '68656c6c6f21'; // 68656c6c6f21 == hello!
const hexToText = Buffer.from(hex, 'hex').toString('utf-8');
console.log(hexToText);

/*
% node buffer.js
68656c6c6f21
hello!
*/
