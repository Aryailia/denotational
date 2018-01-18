// Just really liked the idea of forcing .apply into reduce (and it kills the
// need to have dev remember to rewrap output into an array in a way that makes
// sense for the API), but cannot sneak in index as easily
// failed experiment

const {Suite} = require('benchmark');
const {_} = require('../../fp');
const {shuffle} = require('./RnDUtils');

var large = shuffle(_.range(0,1000).map((x, i) => i));
var small = shuffle(_.range(0,30).map((x, i) => i));

var $ = {
  normalFoldL: function (seed, fn) {
    return function () {
      var length = arguments.length;
      var accumulator = seed;
      
      var index = -1; while (++index < length) {
        accumulator = fn(accumulator, arguments[index], index);
      }
      return [accumulator];
    };
  },
  forcedFoldL: function (seed, fn) {
    return function () {
      var length = arguments.length;
      var accumulator = seed;
      
      var index = -1; while (++index < length) {
        accumulator = fn.apply(null, [arguments[index], index].concat(accumulator));
      }
      return accumulator;
    };
  },
}

// _.curryApply
// ( $.forcedFoldL(0, (acc,i,x) => [acc + x])
// , console.log
// )(small)

// $.flow($.map(x => x + 1)
// , $.sieve(x => x % 2 === 0)
// , $.map(x => x * x)
// , $.sieve(x => x % 2 === 0)
// , $.map(x => x / 4)
// , $.sieve(x => x % 2 === 1)
// , console.log
// )(test);

// _.curry($.map(x => x + 1)
// , _.sieve(x => x % 2 === 0)
// , _.map(x => x * x)
// , _.sieve(x => x % 2 === 0)
// , _.map(x => x / 4)
// , _.sieve(x => x % 2 === 1)
// )(test);


Suite()
.add('normal: Regular LARGE - running', function() {
  $.normalFoldL(0, (acc, x) => acc + x).apply(null, large);
})
.add('FoRcEd: Regular LARGE - running', function() {
  $.forcedFoldL(0, (acc,i,x) => [acc + x]).apply(null, large);
})
.add('normal: Regular small - running', function() {
  $.normalFoldL(0, (acc, x) => acc + x).apply(null, small);
})
.add('FoRcEd: Regular small - running', function() {
  $.forcedFoldL(0, (acc,i,x) => [acc + x]).apply(null, small);
})

.add('normal: fshlfeu LARGE - running', function() {
  $.normalFoldL(0, (acc, x) => acc + x).apply(null, shuffle(large));
})
.add('FoRcEd: fshlfeu LARGE - running', function() {
  $.forcedFoldL(0, (acc,i,x) => [acc + x]).apply(null, shuffle(large));
})
.add('normal: fshlfeu small - running', function() {
  $.normalFoldL(0, (acc, x) => acc + x).apply(null, shuffle(small));
})
.add('FoRcEd: fshlfeu small - running', function() {
  $.forcedFoldL(0, (acc,i,x) => [acc + x]).apply(null, shuffle(small));
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