// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers

function library(Utils) // Yay dependancy injection
{
  var _isArrayLike = Utils.isArrayLike;
  var _pushN = Utils.pushArray;
  var _baseFlatten = Utils.baseFlattenMin1;

  var _INFINITY = Utils.INFINITY;
  var _SKIP0TILL0 = Utils.inlineSlice(0, 0);
  var _SKIP1TILL0 = Utils.inlineSlice(1, 0);
  var _SKIP0TILL1 = Utils.inlineSlice(0, 1);
  
  var $ = {
    // Unfolds
    // -----------------------------------------
    range: function (start, end, step) {
      switch (arguments.length) {
        case 1: end = start; start = 0;
        case 2: step = 1;
        case 3: break;
        case 0: default: throw new SyntaxError('Expected 1-3 arguments.');
      }
      var index = -1;
      var len = Math.max(Math.ceil((end - start) / step), 0); // Excludes {end}
      var output = new Array(len);
      while (len--) {
        output[++index] = start;
        start += step;
      }
      return output;
    },

    // Control flow
    // -----------------------------------------
    chain: function () {
      var source = _SKIP0TILL0.apply(null, arguments);

      return function () {
        return $.curry.apply(null, arguments).apply(null, source);
      };
    },

    curry: _curryCustom(function (fn, source) {
      return _isArrayLike(source)
        ? fn.apply(null, source)
        : fn.call(null, source);
    }),

    curryApply: _curryCustom(function (fn, source) {
      return fn.apply(null, source);
    }),

    curryCall: _curryCustom(function (fn, source) {
      return fn.call(null, source);
    }),

    unmonad: function (fn) {
      var args = _SKIP1TILL0.apply(null, arguments);
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        return fn.apply(source, args);
      };
    },
    rebox: function (fn) {
      return function () {
        return [fn.apply(null, arguments)]
      };
    }, 

    // Core
    // -----------------------------------------
    map: function (fn) {
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        var length = source.length;

        var index = -1; while (++index < length) {
          source[index] = fn(source[index]);
        }
        return source;
      }
    },
    sieve: function (fn) {
      return function () {
        var length = arguments.length;

        var result = [];
        var resultIndex = -1;
        var sourceIndex = -1; while (++sourceIndex < length) {
          if (fn(arguments[sourceIndex])) {
            result[++resultIndex] = arguments[sourceIndex];
          }
        }
        return result;
      }
    },

    foldL: function (seed, fn) {
      return function () {
        var length = arguments.length;
        var accumulator = seed;
        
        var index = -1; while (++index < length) {
          // console.log(index);
          accumulator = fn(accumulator, arguments[index], index);
        }
        return [accumulator];
      };
    },

    take: function (count) {
      return function () {
        var length = arguments.length;
        var limit = Math.min(count, length);
        var result = new Array(limit);
        var i = -1; while (i < limit) {
          result[i] = argument[i];
          ++i;
        }
        return result;
      };
    },
    takeLast: function (count) {
      return function () {
        var length = arguments.length;
        var resultIndex = -1;
        var result = new Array(Math.min(count, length));
        var i = Math.max(length - count, -1); while (++i < length) {
          result[++resultIndex] = argument[i];
        }
        return result;
      };
    },
    skip: function (startAt, stopBefore) {
      return Utils.inlineSlice(first, till);
    },

    first: function () {
      return function (i) { return i; };
    },
    last: function () {
      return function () { return arguments[arguments.length - 1]; };
    },

    // strict currently useless, but bool for including empty arrays
    flatten: function (depth, strict) {
      return((typeof depth !== 'number' || depth < 1)
        ? function () { return _SKIP0TILL0.apply(null, arguments); }
        : function () { return _baseFlatten([], depth).apply(null, arguments); }
      );
    },

    // Extra
    // ES5 stuff is okay to have here
    // -----------------------------------------
    chunk: function (s) {
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        var sourceLength = source.length;
        var size = (typeof s !== 'number' || s <= 0) ? sourceLength : s;
        var result = new Array(Math.ceil(sourceLength / size));


        var resultIndex = -1;
        var chunkIndex, chunk; // var calls in the main function namespace 

        // Adds another row if don't start {sourceIndex} at 0 and post-increment
        var sourceIndex = 0; while (sourceIndex < sourceLength) {
          chunk = new Array(size);
          chunkIndex = -1; while (++chunkIndex < size) {
            chunk[chunkIndex] = source[sourceIndex++]; 
          }
          result[++resultIndex] = chunk;
        }
        return(result);
      };
    },

    unique: function () {
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);

        // Faster to use .has() than constructor of Set(), (ie. {Set(source)}) 
        var temp = new Set();
        var length = source.length;
        var index = -1; while (++index < length) {
          if (!temp.has(source[index])) {
            temp.add(source[index]);
          }
        }
        return Array.from(temp);
      }
    },

    zip: function () {
      var arrList = _SKIP0TILL0.apply(null, arguments);
      var chainLength = arrList.length; 

      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        var length = source.length;
        
        var temp, i, j;
        var innerLength = chainLength + 1;
        var result = new Array(length);
        i = -1; while (++i < length) {
          temp = new Array(chainLength);
          temp[0] = source[i];
          j = 0; while (++j < innerLength) {
            temp[j] = arrList[j - 1][i]; // {temp} offset by 1 cause of {source}
          }
          result[i] = temp;
        };
        return result;
      };
    },
  }

  function _curryCustom(custom) {
    return function () {
      var fList = _SKIP0TILL0.apply(null, arguments);
      return function (source) {
        var length = fList.length;
        var queue = fList;

        var result = source;
        var index = -1; while (++index < length) { // func + arg pairs
          result = custom(queue[index], result);
        }
        return result;
      };
    };
  }

  return $;
};

module.exports = library;