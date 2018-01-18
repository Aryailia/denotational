var utils = require('./fp/utils');
var base = require('./fp/functionalFp')(utils);
var dotChain = require('./fp/strict')(base);
var lazy = require('./fp/lazy')(utils, base);

module.exports = {
  imperative: require('./fp/imperativeFp'),
  _: base,
  Lazy: lazy,
  Strict: dotChain,
};