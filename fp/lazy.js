function library($, Utils) // Yay dependancy injection
{
  'use strict';
  var _SKIP0TILL0 = Utils.inlineSlice(0, 0);
  var _INFINITY = Utils.INFINITY;

  function Lazy(input) {
    var value = input;
    var funcQueue = [];

    var prototype = Object.create(null);

    var lazies = ['map', 'sieve', 'flatten', 'each'];
    var forced = ['foldL', 'unique']; // Chunk goes here if memoizes not working
    // These can be run on individual elements as is done with .take()
    lazies.forEach(function (name) {
      prototype[name] = function () {
        funcQueue[funcQueue.length] = $[name].apply(null, arguments);
        return prototype;
      };
    });

    // These reference the entire array and need it to be evaluated first
    forced.forEach(function (name) {
      prototype[name] = function () {
        var result = prototype.take(_INFINITY);
        return Lazy($[name].apply(null, arguments).apply(null, result));
      };
    });

    // The ones that operate in piecemeal, have to memoize
    [
      'chunk'
    ].forEach(function (name) {
      prototype[name] = function (num) {
        var fn = $.curry.apply(null, funcQueue);
        funcQueue.length = 0;

        var memoize = memoizedRun.apply(null, value);
        var curFn = $[name](num);
        funcQueue[0] = function () { // At this point, it's using value instead of arguments
          var v = memoize.next(num, fn);
          console.log('I am running', v);
          return curFn.apply(null, v);
        };
        return prototype;
      };
    });

    prototype.take = function (count) {
      var fn = $.curry.apply(null, funcQueue);
      funcQueue.length = 0;

      var limit = Math.min(value.length, count);
      var result = [];
      var i = -1; while (++i < limit && result.length < count) {
        Utils.pushArray(result, fn(value[i]), count); 
      }
      return result;
    };

    return prototype;
  }


  // Creates an intermediate cache and pushes values into that so that slices
  // can be then extracted from that cache. (In other words memoizing)
  //
  // Need to test that intermediate {source} is not causing problems in
  // longer chained function queues
  //
  // Consider implementing a proper memoize function
  //
  // May want to consider reimplementing .take() with this, should not be hard
  //
  // Might be possible to get rid of all special cases and just have a functions
  // use the memoize run of .take()
  // Useful to also consider returning the cache as the final answer
  function memoizedRun() {
    var source = _SKIP0TILL0.apply(null, arguments);
    var sourceLength = source.length;

    // State, private variables
    var cache = [];
    var cacheIndex = 0;
    var index = 0;

    // Method definitions
    var obj = Object.create(null);

    obj.isNotDone = function () {
      return index < sourceLength;
    };

    obj.next = function (chunkSize, fn) {
      if (obj.isNotDone()) { 
        var temp = new Array(chunkSize);

        // Memoize as much as need until enough for a single chunk
        var cacheStart = cache.length;
        while (obj.isNotDone() && cache.length - cacheStart  < chunkSize) {
          cache.push.apply(cache, fn(source[index]));
          ++index;
        }

        var cacheLength = cache.length;
        var j = -1; while (++j < chunkSize && cacheIndex < cacheLength) {
          temp[j] = cache[cacheIndex++];
        }
        return temp;
      } else {
        return void 0;
      }
    };
    // obj.getCache = function () {
    //   return cache;
    // };
    return obj;
  }

  return Lazy;
}

// var _ = require('./functionalFp')(require('./utils'));
// var Strict = library(_);
// console.log(Strict(_.range(0,10))
//   .map(x => x + 1)
//   .sieve(x => x % 2 == 0)
//   .foldL(0, (acc,x) => acc+x)
//   .val()
// );

module.exports = library;