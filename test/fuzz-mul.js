'use strict';

const BN = require('bn.js');
const A64 = require('../');

function rnd32() {
  return (Math.random() * 0x100000000) | 0;
}

for (;;) {
  const a = new A64();
  const b = new A64();

  a.hi = rnd32();
  a.lo = rnd32();

  b.hi = rnd32();
  b.lo = rnd32();

  const an = new BN(a.toString(16), 16);
  const bn = new BN(b.toString(16), 16);

  if (a.mul(b).toString() === an.mul(bn).maskn(64).toString(16, 16))
    continue;

  console.log(a);
  console.log(b);
  console.log(a.mul(b), an.mul(bn).maskn(64));
}
