function library($) // Yay dependancy injection
{
  'use strict';

  function Strict(input) {
    var funcQueue = [];

    var prototype = Object.create(null);

    var toNotAdd = { 'range': 1, };
    var toAdd = Object.keys($).filter(function (name) {
      return toNotAdd.hasOwnProperty(name) === false;
    });

    toAdd.forEach(function (name) {
      prototype[name] = function () {
        funcQueue[funcQueue.length] = $[name].apply(null, arguments);
        return prototype;
      };
    });

    prototype.seq = function () {
      var fn = $.curry.apply(null, funcQueue);
      funcQueue.length = 0;
      return fn(input);
    };

    return prototype;
  }

  return Strict;
}

// var _ = require('./functionalFp')(require('./utils'));
// var Strict = library(_);
// console.log(Strict(_.range(0,10))
//   .map(x => x + 1)
//   .sieve(x => x % 2 == 0)
//   .foldL(0, (acc,x) => acc+x)
//   .seq()
// );

module.exports = library;