// Ref: https://github.com/indutny/bn.js/
// Ref: https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html?highlight=bn#bn
const BN = require('bn.js');


console.log("\n--- num ------------------------------------------");
var num1 = new BN(123);
var num2 = new BN(1);
var add_num = num1.add(num2);

console.log("num1 -> ", num1);
console.log("add_num -> ", add_num);


console.log("\n--- str ------------------------------------------");
var str = new BN(1234).toString();
var add_str = new BN('1234').add(new BN('1')).toString();

console.log("str -> ", str);
console.log("add_str -> ", add_str);


console.log("\n--- hex ------------------------------------------");
var hex = new BN('dead', 16); // Base 16 = hex
var binary = new BN('101010', 2); // Base 2 = binary
var res = hex.add(binary);

console.log("hex -> ", hex);
console.log("binary -> ", hex);
console.log("hex + binary to Base 2 -> ", res.toString(2));
console.log("hex + binary to Base 10 -> ", res.toString(10));
console.log("hex + binary to Base 16 -> ", res.toString(16));


console.log("\n--- date ------------------------------------------");
var now = Date.now();
var nowStr = new Date(now);
var nowBn = new BN(now);
console.log("now -> ", now);
console.log("nowStr -> ", nowStr);
console.log("nowBn -> ", nowBn);

/*
% node bn.js

--- num ------------------------------------------
num1 ->  <BN: 7b>
add_num ->  <BN: 7c>

--- str ------------------------------------------
str ->  1234
add_str ->  1235

--- hex ------------------------------------------
hex ->  <BN: dead>
binary ->  <BN: dead>
hex + binary to Base 2 ->  1101111011010111
hex + binary to Base 10 ->  57047
hex + binary to Base 16 ->  ded7

--- date ------------------------------------------
now ->  1641202242045
nowStr ->  2022-01-03T09:30:42.045Z
nowBn ->  <BN: 17e1f46d1fd>
*/
