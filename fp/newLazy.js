function library($, Utils) // Yay dependancy injection
{
  'use strict';
  var _SKIP0TILL0 = Utils.inlineSlice(0, 0);

  function Lazy(input) {
    var value = input;
    var funcQueue = [];

    var prototype = Object.create(null);

    var lazies = ['map', 'sieve', 'flatten'];
    var forced = ['foldL', 'chunk'];
    lazies.forEach(function (name) {
      prototype[name] = function () {
        funcQueue[funcQueue.length] = $[name].apply(null, arguments);
        return prototype;
      };
    });
    forced.forEach(function (name) {
      prototype[name] = function () {
        var result = prototype.test(1/0);
        return Lazy($[name].apply(null, arguments).apply(null, result));
      };
    });

    function memoizedRun() {
      var cache = [];
      var cacheIndex = 0;
      var source = _SKIP0TILL0.apply(null, arguments);
      var index = 0;
      var sourceLength = source.length;

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
          console.log('cache', cacheIndex, cacheLength);
          
          return temp;
        } else {
          return void 0;
        }
      };
      obj.getCache = function () {
        return cache;
      };
      return obj;
    }

    [
      'chunk'
    ].forEach(function (name) {
      prototype[name] = function (num) {
        var fn = $.curry.apply(null, funcQueue);
        funcQueue.length = 0;

        var memoize = memoizedRun.apply(null, value);
        var curFn = $[name](num);
        funcQueue[0] = function () { // At this point, it's using value instead of arguments
          console.log('hey it is me Mario');
          return curFn.apply(null, memoize.next(num, fn));
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