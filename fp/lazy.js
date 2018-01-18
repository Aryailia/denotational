function library(Utils, $) {
  var _isArrayLike = Utils.isArrayLike;
  var _pushN = Utils.pushArray;
  var _INFINITY = Utils.INFINITY;
  var _SKIP1TILL0 = Utils.inlineSlice(1, 0);

  function Lazy(input) {
    // Declaring state
    var funcQueue = [];
    var value = _listWrap(input);

    // Declaring methods
    // Inherit from exiting functional methods
    var prototype = _addMethods(Object.create(null), funcQueue);

    // Some stuff for lazy evaluation and dot chaining
    prototype.take = function (count) {
      var fn = $.curryCall.apply(null, funcQueue);
      funcQueue.length = 0; // Memory Safety: Kill it with fire

      var result = [];
      while (result.length < count && value.isNotDone()) {
        _pushN(result, fn(value.next()), count); 
      }
      value = prototype = null; // Memory Safety: Kill it with fire
      return result;
    };

    prototype.annex = function (fn) {
      funcQueue[funcQueue.length] = function () {
      };
    };

    prototype.test = function (count) {
      var fn = $.curry.apply(null, funcQueue);
      funcQueue.length = 0; // Memory Safety: Kill it with fire

      var v;
      var result = [];
      while (result.length < count && value.isNotDone()) {
        v = fn(value.next());
        console.log(v);
        _pushN(result, [v], count); 
      }
      value = prototype = null; // Memory Safety: Kill it with fire
      return result;
    };

    prototype.takeWrap = function (count) {
      return Lazy(prototype.take(count));
    };

    prototype.takeAll = function () {
      return prototype.take(_INFINITY);
    };

    prototype.takeAllWrap = prototype.seq = function () {
      return takeWrap.takeWrap(_INFINITY);
    };

    // prototype.test = function () {
    //   return value;
    // }

    return prototype;
  }

  function _listWrap(input) {
    var source = _isArrayLike(input) // always array
      ? input
      : ((input === void 0) ? [] : [input]); // [null] can still go through
    var index = 0;

    var obj = Object.create(null);
    obj.isNotDone = function () {
      return index < source.length;
    };
    obj.next = function () {
      return obj.isNotDone ? source[index++]: null;
    }
    return obj;
  }

  /**
   * @todo unit tests for _addMethods, Lazy name changes don't hurt anything 
   * @todo test for name conflicts after _addMethods perhaps?
   * @todo throughly test _pushN and _arrayWrap cases for when singleton
   * vs list are needed, perhaps opportunity for optimisation?
   * - immediately after foldL, need singleton check for _pushN
   */
  /**
   * To convert all the methods from composition to dot-chainable
   */
  var _addMethods = (function () {
    var lazys = ['map', 'sieve', 'unmonad'];
    var strictGraph = ['foldL', 'chunk'];
    var stricts = {
      'unmonad': 'seqUnmonad',
    };
    strictGraph.forEach(function (entry) { stricts[entry] = entry; });

    return function (prototype, funcQueue) {
      lazys.forEach(function (name) {
        prototype[name] = function () {
          funcQueue[funcQueue.length] = $[name].apply(null, arguments);
          return prototype;
        };
      });

      // For the functors that need the entire array evaluated before continuing
      Object.keys(stricts).forEach(function (name) {
        prototype[stricts[name]] = function () {
          var result = prototype.takeAll();
          return $[name].apply(null, arguments).apply(null, result);
        };

        // Include method if want to wrap for continued dot-chaining
        prototype[stricts[name] + 'Wrap'] = function () {
          return Lazy(prototype[stricts[name]].apply(null, arguments));
        };
      });

      return prototype;
    };

  })();

  return Lazy;
}

module.exports = library;