// Source: https://gist.github.com/diafygi/90a3e80ca1c2793220e5/

var uint8_value = [
    new Uint8Array([0,1,2,3,4,5,6,7,8,9]) // <- Replace your Uint8 value
];

const base58_value = '1kA3B2yGe2z4'; // <- Replace your Base58 value



/*--- Define Base58 ---*/
var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

var to_b58 = function(B,A){var d=[],s="",i,j,c,n;for(i in B){j=0,c=B[i];s+=c||s.length^i?"":1;while(j in d||c){n=d[j];n=n?n*256+c:c;c=n/58|0;d[j]=n%58;j++}}while(j--)s+=A[d[j]];return s};
var from_b58 = function(S,A){var d=[],b=[],i,j,c,n;for(i in S){j=0,c=A.indexOf(S[i]);if(c<0)return undefined;c||b.length^i?i:b.push(0);while(j in d||c){n=d[j];n=n?n*58+c:c;c=n>>8;d[j]=n%256;j++}}while(j--)b.push(d[j]);return new Uint8Array(b)};
/*--- /Define Base58 ---*/

function encodeUint8ToBase58() {
    for(var e in uint8_value){
        var arr = [];
        for(var i = 0; i < uint8_value[e].length; i++)
            arr.push(uint8_value[e][i]);

        var encoded = to_b58(uint8_value[e], MAP);
        console.log('Encode Uint8 to Base58: ', encoded);
    }
}

function decodeBase58ToUint8() {
    var decoded = from_b58(base58_value, MAP);

    var decoded_arr = [];
    for(var i = 0; i < decoded.length; i++)
        decoded_arr.push(decoded[i]);

    var result = decoded_arr.toString();
    console.log('Decode Base58 to Uint8: ', result);
}

encodeUint8ToBase58();
decodeBase58ToUint8();

/*
% node uint8_base58_encode_decode.js
Encode Uint8 to Base58:  1kA3B2yGe2z4
Decode Base58 to Uint8:  0,1,2,3,4,5,6,7,8,9
*/
