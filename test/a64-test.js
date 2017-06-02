'use strict';

const assert = require('assert');
const BN = require('bn.js');
const A64 = require('../');

function rnd32() {
  return (Math.random() * 0x10000000) >>> 0;
}

describe('Awesome64', () => {
  describe('add', () => {
    it('should add without carry', () => {
      const a = new A64(123);
      const b = new A64(592);

      assert.equal(a.add(b).toString(), '00000000000002cb');
    });

    it('should add with carry', () => {
      const a = new A64(0x1fffffff);
      const b = new A64(0xeffffeda);

      assert.equal(a.add(b).toString(), '000000010ffffed9');
    });

    it('should add with overflow', () => {
      const a = new A64(2 ** 63 + 2 ** 62);
      const b = new A64(2 ** 63 + 2 ** 62);

      assert.equal(a.add(b).toString(), '8000000000000000');
    });

    it('should cross-check against BN', () => {
      for (let i = 0; i < 1e5; i++) {
        const a = new A64();
        const b = new A64();

        a.hi = rnd32();
        a.lo = rnd32();

        b.hi = rnd32();
        b.lo = rnd32();

        const an = new BN(a.toString(16), 16);
        const bn = new BN(b.toString(16), 16);

        assert.equal(a.add(b).toString(),
                     an.add(bn).maskn(64).toString(16, 16));
      }
    });
  });

  describe('mul', () => {
    it('should mul without carry', () => {
      const a = new A64(123);
      const b = new A64(592);

      assert.equal(a.mul(b).toString(), '0000000000011c70');
    });

    it('should mul with overflow', () => {
      const a = new A64(0x1fffffff);
      const b = new A64(0xeffffeda);

      assert.equal(a.mul(b).toString(), '1dffffda50000126');
    });

    it('should mul with negative self.lo', () => {
      const a = new A64(0xeffffeda);
      const b = new A64(0x1fffffff);

      assert.equal(a.mul(b).toString(), '1dffffda50000126');
    });

    it('should mul with negative self.lo and other.lo', () => {
      const a = new A64(0xeffffeda);
      const b = new A64(0xeffffeda);

      assert.equal(a.mul(b).toString(), 'e0fffdd8c00151a4');
    });

    it('should cross-check against BN', () => {
      for (let i = 0; i < 1e5; i++) {
        const a = new A64();
        const b = new A64();

        a.hi = rnd32();
        a.lo = rnd32();

        b.hi = rnd32();
        b.lo = rnd32();

        const an = new BN(a.toString(16), 16);
        const bn = new BN(b.toString(16), 16);

        assert.equal(a.mul(b).toString(),
                     an.mul(bn).maskn(64).toString(16, 16));
      }
    });
  });
});
