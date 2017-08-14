'use strict';

const BN = require('bn.js');
const A64 = require('../');

function rnd32() {
  return (Math.random() * 0x100000000) | 0;
}

const start = Date.now();

function toBN(num) {
  const hi = num.hi >>> 0;
  const lo = num.lo >>> 0;

  return new BN([
    lo & 0xff,
    (lo >>> 8) & 0xff,
    (lo >>> 16) & 0xff,
    (lo >>> 24) & 0xff,
    hi & 0xff,
    (hi >>> 8) & 0xff,
    (hi >>> 16) & 0xff,
    (hi >>> 24) & 0xff,
  ], 'le');
}

for (let i = 1; ; i++) {
  const a = new A64();
  const b = new A64();

  a.hi = rnd32();
  a.lo = rnd32();

  b.hi = rnd32();
  b.lo = rnd32();

  const an = toBN(a);
  const bn = toBN(b);

  if (i % 0x100000 === 0) {
    const now = Date.now();
    const speed = i * 1000 / (now - start);
    console.log('===== ITERATION num=0x%s speed=%d =====', i.toString(16),
                speed.toFixed(0));
  }

  if (a.mul(b).toString() === an.mul(bn).maskn(64).toString(16, 16))
    continue;

  console.log('===== FAILURE =====');
  console.log(a);
  console.log(b);
  console.log(a.mul(b), an.mul(bn).maskn(64));
}
