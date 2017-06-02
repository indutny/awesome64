'use strict';

function A64(num) {
  this.hi = 0;
  this.lo = 0;

  if (num)
    this.from(num);
}
module.exports = A64;

A64.prototype.from = function from(num) {
  this.hi = (num / 0x100000000) >>> 0;
  this.lo = num >>> 0;
};

A64.prototype.clone = function clone() {
  const res = new A64();
  res.hi = this.hi >>> 0;
  res.lo = this.lo >>> 0;
  return res;
};

function pad8(s) {
  var res = s;
  while (res.length < 8)
    res = '0' + res;
  return res;
}

A64.prototype.toString = function toString() {
  return pad8(this.hi.toString(16)) + pad8(this.lo.toString(16));
};

A64.prototype.iadd = function iadd(other) {
  const lo = (this.lo + other.lo) >>> 0;
  const carry = (lo < this.lo) | (lo < other.lo);

  this.hi = ((this.hi + other.hi) | 0 + carry) >>> 0;
  this.lo = lo;

  return this;
};

A64.prototype.imul = function imul(other) {
  const hi = (Math.imul(this.hi, other.lo) + Math.imul(other.hi, this.lo)) | 0;
  const carry = Math.floor((this.lo * other.lo) / 0x100000000) | 0;

  this.hi = (hi + carry) >>> 0;
  this.lo = Math.imul(this.lo, other.lo) >>> 0;

  return this;
};

// Convenience

A64.prototype.add = function add(other) {
  return this.clone().iadd(other);
};

A64.prototype.mul = function mul(other) {
  return this.clone().imul(other);
};
