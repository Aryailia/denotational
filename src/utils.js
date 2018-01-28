var toExport = {
  INFINITY: 1 / 0,

  isArrayLike: function (toTest) {
    return typeof toTest === 'object' && toTest.hasOwnProperty('length');
  },

  inlineSlice: function (skip, until) {
    return function () {
      var length = arguments.length - until;
      var result = new Array(length - skip);
      var i = skip; while (i < length) {
        result[i - skip] = arguments[i];
        ++i;
      }
      return result;
    }
  },

  pushArray: function (result, input, targetLength) {
    var source = toExport.isArrayLike(input) ? input : [input];
    // var source = input;
    var sourceLength = source.length;
 
    var i = -1; while (++i < sourceLength && result.length < targetLength) {
      result[result.length] = source[i];
    }
  },

  baseFlattenMin1: function (result, depth) {
    return function () {
      var length = arguments.length;
      
      var temp;
      var i = -1; while (++i < length) {
        temp = arguments[i];
        toExport.isArrayLike(temp) && depth > 1
          ? toExport.baseFlattenMin1(result, depth - 1).apply(null, temp)
          : toExport.pushArray(result, temp, toExport.INFINITY);
      }
      return result;
    };
  },
};

module.exports = toExport;