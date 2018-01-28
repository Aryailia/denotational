// Testing passing the input through function pipeline via function parameter
// or via .apply() and in the arguments array
//
// Using just .map might have closer results
//
// Answer: .apply(null, arguments) seems to universally be faster
// Less of a difference with smaller arrays, but still usually x3 times faster
// Ranges from x1.5 to x40 times faster with .apply(null, arguments)
//
// The reason I can think of that .apply(null, arguments) methods might be
// faster is because there is less array copying since functions already
// generate an array for arguments, but honestly I have no idea why there's
// such a large difference. The difference feels too big for that to be the only
// reason

'use strict';

const {Suite} = require('benchmark');
const {_} = require('../../index');
const {shuffle} = require('./RnDUtils');

var large = shuffle(_.range(0,1000).map((x, i) => i));
var small = shuffle(_.range(0,30).map((x, i) => i));

// Almost idetical format to how it's implemented currently
var $ = {
  map: function (fn) {
    return function (source) {
      var length = source.length;
      var result = new Array(length);

      var index = -1; while (++index < length) {
        result[index] = fn(source[index]);
      }
      return result;
    };
  },
  sieve: function (fn) {
    return function (source) {
      var length = source.length;

      var result = [];
      var resultIndex = -1;
      var sourceIndex = -1; while (++sourceIndex < length) {
        if (fn(source[sourceIndex])) {
          result[++resultIndex] = source[sourceIndex];
        }
      }
      return result;
    }
  },

  flow: function () {
    var length = arguments.length;
    var fnList = new Array(length);
    var i = -1; while (++i < length) {
      fnList[i] = arguments[i];
    }
    return function (source) {
      var len = length;
      var queue = fnList;

      var result = source;
      var i = -1; while (++i < len) {
        result = queue[i](result);
      }
      return result;
    };
  },
}

var a = $.flow
  ( $.map(x => x + 1)
  , $.sieve(x => x % 2 === 0)
  , $.map(x => x * x)
  , $.sieve(x => x % 2 === 0)
  , $.map(x => x / 4)
  , $.sieve(x => x % 2 === 1)
);
var b = _.curry
  ( $.map(x => x + 1)
  , _.sieve(x => x % 2 === 0)
  , _.map(x => x * x)
  , _.sieve(x => x % 2 === 0)
  , _.map(x => x / 4)
  , _.sieve(x => x % 2 === 1)
);

Suite()
.add('parameter: Regular LARGE - function creation', function() {
  $.flow
    ( $.map(x => x + 1)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x * x)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x / 4)
    , $.sieve(x => x % 2 === 1)
  )(large);
})
.add('@rguments: Regular LARGE - function creation', function() {
  _.curry
    ( $.map(x => x + 1)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x * x)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x / 4)
    , _.sieve(x => x % 2 === 1)
  )(large);
})
.add('parameter: Regular small - function creation', function() {
  $.flow
    ( $.map(x => x + 1)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x * x)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x / 4)
    , $.sieve(x => x % 2 === 1)
  )(small);
})
.add('@rguments: Regular small - function creation', function() {
  _.curry
    ( $.map(x => x + 1)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x * x)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x / 4)
    , _.sieve(x => x % 2 === 1)
  )(small);
})

.add('parameter: fshlfeu LARGE - function creation', function() {
  $.flow
    ( $.map(x => x + 1)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x * x)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x / 4)
    , $.sieve(x => x % 2 === 1)
  )(shuffle(large));
})
.add('@rguments: fshlfeu LARGE - function creation', function() {
  _.curry
    ( $.map(x => x + 1)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x * x)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x / 4)
    , _.sieve(x => x % 2 === 1)
  )(shuffle(large));
})
.add('parameter: fshlfeu small - function creation', function() {
  $.flow
    ( $.map(x => x + 1)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x * x)
    , $.sieve(x => x % 2 === 0)
    , $.map(x => x / 4)
    , $.sieve(x => x % 2 === 1)
  )(shuffle(small));
})
.add('@rguments: fshlfeu small - function creation', function() {
  _.curry
    ( $.map(x => x + 1)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x * x)
    , _.sieve(x => x % 2 === 0)
    , _.map(x => x / 4)
    , _.sieve(x => x % 2 === 1)
  )(shuffle(small));
})


// Should more closely test the effect of .apply(null, arguments) inside
// each functions implementation
.add('parameter: Regular LARGE - running', function() {
  a(large);
})
.add('@rguments: Regular LARGE - running', function() {
  b(large);
})
.add('parameter: Regular small - running', function() {
  a(small);
})
.add('@rguments: Regular small - running', function() {
  b(small);
})

.add('parameter: fshlfeu LARGE - running', function() {
  a(shuffle(large));
})
.add('@rguments: fshlfeu LARGE - running', function() {
  b(shuffle(large));
})
.add('parameter: fshlfeu small - running', function() {
  a(shuffle(small));
})
.add('@rguments: fshlfeu small - running', function() {
  b(shuffle(small));
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });

//*/