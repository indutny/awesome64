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

// Addition
{
  const add = new benchmark.Suite();

  const a1 = new A64(4296813);
  const a2 = new A64(8731395);

  add.add('A64.iadd', () => {
    a1.iadd(a2);
  });

  const b1 = new BN(4296813);
  const b2 = new BN(8731395);

  add.add('BN.iadd', () => {
    b1.iadd(b2).imaskn(64);
  });

  run(add);
}

// Multiplication
{
  const mul = new benchmark.Suite();

  const a1 = new A64(4296813);
  const a2 = new A64(8731395);

  mul.add('A64.imul', () => {
    a1.imul(a2);
  });

  const b1 = new BN(4296813);
  const b2 = new BN(8731395);

  mul.add('BN.imul', () => {
    b1.imul(b2).imaskn(64);
  });

  run(mul);
}
