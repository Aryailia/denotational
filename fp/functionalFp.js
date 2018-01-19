// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers

function library(Utils) // Yay dependancy injection
{
  var _baseFlatten = Utils.baseFlattenMin1;

  var _SKIP0TILL0 = Utils.inlineSlice(0, 0);
  var _SKIP1TILL0 = Utils.inlineSlice(1, 0);
  
  var $ = {
    // Unfolds and utilities
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
    chain: function (source) {
      return function () {
        return $.curry.apply(null, arguments).apply(null, source);
      };
    },

    curry: function () {
      var fList = _SKIP0TILL0.apply(null, arguments);
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        var length = fList.length;
        var queue = fList;

        var index = -1; while (++index < length) { // func + arg pairs
          source = queue[index].apply(null, source);
        }
        return source;
      };
    },

    unmonad: function (fn) {
      var args = _SKIP1TILL0.apply(null, arguments);
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        return fn.apply(source, args);
      };
    },

    // Core
    // -----------------------------------------
    map: function (fn) {
      return function () {
        // Because inlineSplice makes a new array, can resuse it
        var source = _SKIP0TILL0.apply(null, arguments);
        var length = source.length;

        var index = -1; while (++index < length) {
          source[index] = fn(source[index]);
        }
        return source;
      };
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
      };
    },

    foldL: function (seed, fn) {
      return function () {
        var length = arguments.length;
        var accumulator = seed;
        
        var index = -1; while (++index < length) {
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
        var i = -1; while (++i < limit) {
          result[i] = arguments[i];
        }
        return result;
      };
    },
    takeLast: function (count) {
      return function () {
        var length = arguments.length;
        var resultIndex = -1;
        var result = new Array(Math.min(count, length));
        var i = Math.max(length - count, -1); while (i < length) {
          result[++resultIndex] = arguments[i++];
        }
        return result;
      };
    },
    skip: function (startAt, stopBefore) {
      return Utils.inlineSlice(startAt, stopBefore);
    },

    // strict currently useless, but bool for including empty arrays
    flatten: function (depth, strict) {
      return((typeof depth !== 'number' || depth < 1)
        ? function () { return _SKIP0TILL0.apply(null, arguments); }
        : function () { return _baseFlatten([], depth).apply(null, arguments); }
      );
    },

    // Extra
    // -----------------------------------------
    each: function (fn) {
      return function () {
        var source = _SKIP0TILL0.apply(null, arguments);
        var length = source.length;

        var index = -1; while (++index < length) {
          fn(source[index]);
        }
        return source;
      };
    },

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
      };
    },

    /** @todo review how I want to do zip */
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
        }
        return result;
      };
    },
  };

  return $;
}

module.exports = library;