/**
 * 
 * 
 * Optimisation Decisions
 * ======================
 * Because this is low level to faciliate basic functionality, allowing for
 * a bunch of micro operations. According to J.S. Dalton, author of Lodash, the
 * default behavior of .map is fairly slow.
 * 
 * Taking advantage of ES6 since this is for bot development which is done in
 * Node so can rely on ES6 features being present. Using var instead of let
 * because it slows down in Javascript. 
 * Not using arrow operator because it is slower than a function declaration,
 * and not many opportunities to use it anyway.
 * 
 * .forEach() is inherently slower than a imperative loop. Post-incrementation
 * is slower than pre-incrementation. A for loop has one more comparison than a
 * while loop.
 * 
 * Choosing to do implict type checking. Probably have to go through to make
 * sure this is done in all the functions.
 * 
 * Keep in mind that I do not have a dedicated testing suite for performance
 * so these decisions are based more on theory rather than actual testing.
 */

const _ = {
  mixin: function (obj, privateVars, ...mixinList) {
    mixinList.forEach(function (mixin) {
      Object.keys(mixin).forEach(function (key) {
        obj[key] = function (...args) {
          return mixin[key].apply(null, privateVars.concat(args));
        };
      });
    })
    return obj;
  },
  
  /**
   * To reverse the order of #flow so you can specify {source} at the start
   * @param {Array} source
   * @param {...Array<function():Array, ...>} fnList
   * @returns {Array}
   */
  chain(source, ...fnList) {
    return(_.curry.apply(null, fnList)(source));
  },

  /**
   * @todo replace slice
   * @param {...Array<function():Array, ...>} fnList
   * @returns {function(Array)}
   */
  curry(...fnAndArgList) {
    console.log('\n\n', fnAndArgList)
    return(function (source) {
      const len = fnAndArgList == null ? 0 : fnAndArgList.length;
      var fn, args;
      var index = -2; while ((index += 2) < len) { // func + arg pairs
        fn = fnAndArgList[index]
        args = fnAndArgList[index + 1];
        console.log(index, fn, args);
        source = fn.apply(null, args.concat([source]));
      }
      return(source);
    });
  },

  /**
   * Monad non-mathematically to refer to anything that needs to dot chain
   * Used for interfacing with things like [].reduce in chain() or curry()
   * 
   * eg.
   * _.chain([1,2,3,4,5]
   * , _.map, [x=>x+1]
   * , _.unmonad(Array.prototype.map), [x=>x*2]
   * );
   * => [4, 6, 8, 10, 12]
   * 
   * May wish to call remonad() afterwards
   * @param {function} fn Whatever dot chain function that needs to be wrapped
   * @returns {function}
   */
  unmonad(fn) {
    return(function (...args) {
      const source = args[args.length - 1];
      args.length -= 1; // Pop
      return(fn.apply(source, args));
    });
  },

  /**
   * Just puts this in an array, the converse to unmonad()
   * @param {*} source
   * @returns {Array}
   */
  remonad(source) {
    return([source]);
  },

  /**
   * Same as map but with the guarentee that an array isn't being made
   * @param {Array} source
   * @returns {Array} Exact same array as source
   */
  each: function (fn, source) {
    const len = (source == null) ? 0 : source.length;
    var index = -1; while (++index < len) {
      fn(source[index], index);
    }
    return(source);
  },

  flatten: function () {
  },

  /**
   * Reduce
   * @param {*} accumulator
   * @param {function(*,*, number)} fn
   * @param {Array} source
   * @returns {Array} Exact same array as source
   */
  foldLeft: function (accumulator, fn, source) {
    const len = (source == null) ? 0 : source.length;
    var index = -1; while (++index < len) {
      accumulator = fn(accumulator, source[index], index);
    }
    return(accumulator);
  },


  /**
   * @param {function(*,number)} fn
   * @param {Array} source
   * @returns {Array}
   */
  map: function (fn, source) {
    const len = (source == null) ? 0 : source.length;
    const result = new Array(len);
    var index = -1; while (++index < len) {
      result[index] = fn(source[index], index);
    }
    return(result);
  },

  /**
   * @todo Look into if pre-allocating array entire array {new Array(length)}
   * and reducing length after would be faster than growing array
   * @param {function(*,number)} fn
   * @param {Array} source
   * @returns {Array}
   */
  sieve: function (fn, source) {
    const len = (source == null) ? 0 : source.length;
    const result = [];
    var resultIndex = -1;
    var sourceIndex = -1; while (++sourceIndex < len) {
      if (fn(source[sourceIndex], sourceIndex)) {
        result[++resultIndex] = source[sourceIndex];
      }
    }
    return(result);
  },

  /**
   * @param {number} size The size of individual chunks
   * @param {Array} source
   * @returns {Array}
   */
  chunk: function (size, source) {
    const sourceLength = (source == null) ? 0 : source.length;
    const chunkSize = (size <= 0) ? sourceLength : size;
    // Non-numbers test false, so have {size} as false to fail early
    const result = new Array(Math.ceil(sourceLength / chunkSize));
    var resultIndex = -1;
    var chunkIndex, chunkPiece; // var calls in the main function namespace 

    // Adds another row if don't start {sourceIndex} at 0 and post-increment
    var sourceIndex = 0; while (sourceIndex < sourceLength) {
      chunkPiece = new Array(chunkSize);
      chunkIndex = -1; while (++chunkIndex < chunkSize) {
        chunkPiece[chunkIndex] = source[sourceIndex++]; 
      }
      result[++resultIndex] = chunkPiece;
    }
    return(result);
  },
  
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

  

  /**
   * @param {Array} source
   * @returns {Array}
   */
  unique: function (source) {
    // Faster to use .has() than constructor of Set(), (ie. {Set(source)}) 
    const temp = new Set();
    const len = (source == null) ? 0 : source.length;
    var index = -1; while (++index < len) {
      if (!temp.has(source[index])) {
        temp.add(source[index]);
      }
    }
    return([...temp]);
  },

  /**
   * @todo cleanup, probably want to find the max length of the {arrList}
   * @param {...Array} arrList The last element is actually source
   * @param {Array} source 
   * @returns {Array<Array>}
   */
  zip: function (...arrList) {
    const source = arrList.pop();
    return(_.map(function (entry, sourceIndex) { return(
      [entry].concat(_.map(function (arr) { return(
        arr[sourceIndex]);
      }, arrList)));
    }, source));
  },
};

module.exports = _;