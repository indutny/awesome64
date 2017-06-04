'use strict';

const assert = require('assert');
const BN = require('bn.js');
const A64 = require('../');

function rnd32() {
  return (Math.random() * 0x100000000) | 0;
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

    it('should not fail on overflow regression', () => {
      const a = new A64();
      const b = new A64();
      a.lo = 0x80000000 | 0;
      b.lo = 0x80000000 | 0;

      assert.equal(a.add(b).toString(), '0000000100000000');
    });

    it('should not fail on overflow regression#2', () => {
      const a = new A64();
      const b = new A64();

      a.hi = -1401635801;
      a.lo = 1372527499;
      b.hi = 283000954;
      b.lo = -987133892;

      assert.equal(a.add(b).toString(), 'bd52fca216f8a3c7');
    });

    it('should not fail on overflow regression#3', () => {
      const a = new A64();
      const b = new A64();

      a.hi = 427011201;
      a.lo = -1128669244;
      b.hi = 2117984826;
      b.lo = 102420856;

      assert.equal(a.add(b).toString(), '97b18ebbc2d4b13c');
    });

    it('should not fail on overflow regression#4', () => {
      const a = new A64();
      const b = new A64();

      a.hi = -1653411800;
      a.lo = 816565052;
      b.hi = -566093177;
      b.lo = 1552065947;

      assert.equal(a.add(b).toString(), '7bb50aaf8d2e70d7');
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

        try {
          assert.equal(a.add(b).toString(),
                       an.add(bn).maskn(64).toString(16, 16));
        } catch (e) {
          console.error(a, b);
          throw e;
        }
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

    it('should cross-check against BN with zero low bits', () => {
      for (let i = 0; i < 1e5; i++) {
        const a = new A64();
        const b = new A64();

        a.hi = rnd32();
        a.lo = 0;

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
