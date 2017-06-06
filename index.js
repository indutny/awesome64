'use strict';

function A64(num) {
  this.hi = 0;
  this.lo = 0;

  if (num)
    this.from(num);
}
module.exports = A64;

A64.prototype.from = function from(num) {
  this.hi = (num * (1 / 0x100000000)) | 0;
  this.lo = num | 0;
};

A64.prototype.clone = function clone() {
  const res = new A64();
  res.hi = this.hi | 0;
  res.lo = this.lo | 0;
  return res;
};

function pad8(s) {
  var res = s;
  while (res.length < 8)
    res = '0' + res;
  return res;
}

A64.prototype.toString = function toString() {
  const hi = this.hi >>> 0;
  const lo = this.lo >>> 0;
  return pad8(hi.toString(16)) + pad8(lo.toString(16));
};

A64.prototype.iadd = function iadd(other) {
  const selfLo = this.lo | 0;
  const otherLo = other.lo | 0;
  const selfHi = this.hi | 0;
  const otherHi = other.hi | 0;

  const sum = (selfLo + otherLo) | 0;

  const sumSign = sum >> 31;
  const selfSign = selfLo >> 31;
  const otherSign = otherLo >> 31;

  const carry = ((selfSign & otherSign) |
                 (~sumSign & (selfSign ^ otherSign))) & 1;

  this.hi = (((selfHi + otherHi) | 0) + carry) | 0;
  this.lo = sum | 0;

  return this;
};

A64.prototype.imul = function imul(other) {
  const selfLo = this.lo | 0;
  const otherLo = other.lo | 0;
  const selfHi = this.hi | 0;
  const otherHi = other.hi | 0;

  const hi = (Math.imul(selfHi, otherLo) + Math.imul(otherHi, selfLo)) | 0;
  let carry = (((selfLo >>> 0) * (otherLo >>> 0)) * (1 / 0x100000000)) | 0;

  this.hi = (hi + carry) | 0;
  this.lo = Math.imul(selfLo, otherLo) | 0;

  return this;
};

// Convenience

A64.prototype.add = function add(other) {
  return this.clone().iadd(other);
};

A64.prototype.mul = function mul(other) {
  return this.clone().imul(other);
};
