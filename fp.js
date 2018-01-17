var utils = require('./fp/utils');
var base = require('./fp/functionalFp')(utils);
var dotChain = require('./fp/lazy')(utils, base);

module.exports = {
  imperative: require('./fp/imperativeFp'),
  _: base,
  Lazy: dotChain,
};