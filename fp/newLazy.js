function library($, Utils) // Yay dependancy injection
{
  'use strict';

  function Lazy(input) {
    var value = input;
    var funcQueue = [];

    var prototype = Object.create(null);

    // var toNotAdd = { range: 0, curry: 0, curryCall: 0 };
    // var toAdd = Object.keys($).filter(function (name) {
    //   return toNotAdd.hasOwnProperty(name) === false;
    // });

    // toAdd.forEach(function (name) {
    //   prototype[name] = function () {
    //     funcQueue[funcQueue.length] = $[name].apply(null, arguments);
    //     return prototype;
    //   };
    // });

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

    function processPiecemeal(count, fn) {
      var limit = Math.min(value.length, count);
      var result = [];
      var valueIndex, j, temp, chunk;

      var asdf = 0;
      valueIndex = 0; while (valueIndex < limit && result.length < count
        && ++asdf < 5
      ) {
        temp = [];
        chunk = new Array(count);
        j = -1; while (++j < limit && temp.length < count) {
          // console.log(_asdf(value[valueIndex++]));
          Utils.pushArray(temp, $.flatten(1)(value[valueIndex++]), limit);
          // console.log('temp', temp, valueIndex, value[valueIndex-1]);
        }
        j = -1; 
        console.log('chunks', chunk);
        // console.log('testing', )
        // console.log('value', value, '\ninside', temp, '\nbbb', fn.apply(null, temp));
        // Utils.pushArray(result, fn.apply(null, temp), count); 
      }
      return value = result;
    }

    function memoizedRun(input, chunkSize) {
      var cache = [];
      var source = input;
      var index = 0;
      var sourceLength = source.length;
      var INFIN = 1/0;

      var obj = Object.create(null);

      obj.isNotDone = function () {
        return index < source.length;
      }

      if (chunkSize > 0) {
        obj.next = function (fn) {
          if (obj.isNotDone()) { 
            var temp = new Array(chunkSize);
            
            var i = -1; while (++i < sourceLength && cache.length - index  < chunkSize ) {
              console.log('inside', i, source[i], fn.apply(null, source[i]));
              Utils.pushArray(cache, fn.apply(null, source[i]), INFIN);
            }
            var cacheLength = cache.length;
            var j = -1; while (++j < chunkSize && index + j  < cacheLength) {
              // console.log('memoize', index + j, cache.length);
              temp[j] = cache[index + j];
            }
            index += chunkSize;
            
            return temp;
          } else {
            return void 0;
          }
        };
      } else {
        obj.next = function () {
          // index < 0;
          return;
        }
      }
      obj.getCache = function () {
        return cache;
      };
      return obj;
    }

    var INFIN = 1/0;
    [
      'chunk'
    ].forEach(function (name) {
      prototype[name] = function (num) {
        var fn = $._special.apply(null, funcQueue);
        // var test = [[1,2,3,4]];
        // console.log('test', $._special.apply(null, funcQueue).apply(null, value))
        funcQueue.length = 0;

        var memoize = memoizedRun(value, num);
        var curFn = $[name](num);
        funcQueue[0] = function () { // At this point, it's using value instead of arguments
          return memoize.next(curFn);
        //   // return processPiecemeal(fn, $[name](num));
        //   var length = value.length
        //   var result = [];
        //   var i = -1; while (++i < length) {
        //     Utils.pushArray(result, fn(value[i]), 1/0); 
        //   }
        //   console.log('stuff', $[name](num).apply(null, result));
        };
        return prototype;
      };
    });

    // ['chunk'].forEach(function (name) {
    //   prototype[name] = function (num) {
    //     funcQueue[funcQueue.length] = $[name](num);
        
    //     var fn = $._special.apply(null, funcQueue);
    //     funcQueue.length = 0;
    //     funcQueue[0] = function () { // At this point, it's using value instead of arguments
    //       return processPiecemeal(num, fn);
    //     };
    //     return prototype;
    //     // return prototype;
    //   };
    // });

    prototype.test = function (count) {
      var fn = $._special.apply(null, funcQueue);
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