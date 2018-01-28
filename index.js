var utils = require('./src/utils');
var base = require('./src/base')(utils);

var dotChain = require('./src/eager')(base);
var lazy = require('./src/lazy')(base, utils);

module.exports = {
  imperative: require('./src/imperative'),
  _: base,
  Lazy: lazy,
  Eager: dotChain,
};