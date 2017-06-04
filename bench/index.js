'use strict';

const benchmark = require('benchmark');

const A64 = require('../');
const BN = require('bn.js');

function run(suite) {
  suite
    .on('cycle', function (event) {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('------------------------');
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run();
}

function warm() {
  for (var i = 0; i < 1e4; i++) {
    const A = (Math.random() * 0xffffffff) >>> 0;
    const B = (Math.random() * 0xffffffff) >>> 0;

    const a1 = new A64(A);
    const a2 = new A64(B);

    a1.iadd(a2);
    a1.imul(a2);
  }
}

warm();

// Just two primes
const A = 0x7fe5be05;
const B = 0xae302bbd;

// Addition
{
  const add = new benchmark.Suite();

  const a1 = new A64(A);
  const a2 = new A64(B);

  add.add('A64.iadd', () => {
    a1.iadd(a2);
  });

  const b1 = new BN(A);
  const b2 = new BN(B);

  add.add('BN.iadd', () => {
    b1.iadd(b2).imaskn(64);
  });

  run(add);
}

// Multiplication
{
  const mul = new benchmark.Suite();

  const a1 = new A64(A);
  const a2 = new A64(B);

  mul.add('A64.imul', () => {
    a1.imul(a2);
  });

  const b1 = new BN(A);
  const b2 = new BN(B);

  mul.add('BN.imul', () => {
    b1.imul(b2).imaskn(64);
  });

  run(mul);
}
