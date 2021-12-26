// Ref: https://www.npmjs.com/package/buffer-layout
const assert = require('assert');
const util = require('util');
const lo = require('buffer-layout');

const ds = lo.seq(lo.s16(), 4);
const b = Buffer.alloc(8);

assert.equal(ds.encode([1, -1, 3, -3], b), 4 * 2);
assert.equal(Buffer.from('0100ffff0300fdff', 'hex').compare(b), 0);
assert.deepEqual(ds.decode(b), [1, -1, 3, -3]);

console.log("\n", "lo.s16() -> ", lo.s16());
console.log("\n", "ds -> ", ds);
console.log("\n", "b -> ", b);
console.log("\n", "ds.decode(b) -> ", ds.decode(b));

/*
% node buffer-layout.js

 lo.s16() ->  Int { span: 2, property: undefined }

 ds ->  Sequence {
  span: 8,
  property: undefined,
  elementLayout: Int { span: 2, property: undefined },
  count: 4
}

 b ->  <Buffer 01 00 ff ff 03 00 fd ff>

 ds.decode(b) ->  [ 1, -1, 3, -3 ]
*/
