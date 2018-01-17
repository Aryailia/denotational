const tape = require('tape');
const Utils = require('../fp/utils');
const $ = require('../fp/functionalFp')(Utils);
const {baseFlattenMin1, isArrayLike, pushArray, inlineSlice} = Utils;
const Lazy = require('../fp/lazy')(Utils, $);

(function () {
  var test = [1,2,3,4,5,6,7,8,9,0];
  var args;
  args = [0,0]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
  args = [0,1]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
  args = [1,0]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
  args = [1,1]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
  args = [0,3]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
  args = [3,1]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
  args = [3,4]; console.log(`_inlineSlice(${args.join(',')})`, inlineSlice.apply(null, args).apply(null, test));
})();


// Base Flatten
(function () {
  var test = [[1,2,3, [4,5,[6],7,[8],9]], 10, [[11],13],14];
  var count;
  console.log('Base', test);
  console.log('Expected behaviour - min 1', baseFlattenMin1([], 0).apply(null, test));
  count = 1; console.log(`Base flatten - ${count}`, baseFlattenMin1([], count).apply(null, test));
  count = 2; console.log(`Base flatten - ${count}`, baseFlattenMin1([], count).apply(null, test));
  count = 3; console.log(`Base flatten - ${count}`, baseFlattenMin1([], count).apply(null, test));
  count = 4; console.log(`Base flatten - ${count}`, baseFlattenMin1([], count).apply(null, test));
  count = 5; console.log(`Base flatten - ${count}`, baseFlattenMin1([], count).apply(null, test));

  console.log(`Base flatten - Empty Array`, baseFlattenMin1([], 1).apply(null, []));
  console.log(`Base flatten - Empties`, baseFlattenMin1([], 1).apply(null, [1, [], 2, [3, []]]));

  console.log('flatten', $.flatten(5).apply(null, [1,2,3,[4,5,[],[6,[7,[8],[[9]]]]]]));
  $.chain(test)
  ( $.sieve(x => isArrayLike(x))
  , $.flatten(2)
  , console.log
  );
  
})();

(function () {
})();

// Zip test
(function () {
  var test = [1,2,3,[4,5,[],[6,[7,[8],[[9]]]]]];
  console.log($.chain(test)
  ( $.sieve(x => isArrayLike(x))
  , $.flatten(5)
  , $.chunk(3)
  , $.zip([1,2])
  , $.flatten(3)
  ));
})();



(function () {
  var test = [1,2,3,4,5,6,7,8,9,0];
  // map
  console.log($.map(x => x+ 1).apply(null, test));
  console.log(test);

  // curry
  console.log($.curry
    ( $.map(x => { console.log('map1', x); return x + 1; })
    , $.map(x => { console.log('map2', x); return x * 1; })
    )(test)
  );
  console.log(test);
  
  // chain
  console.log($.chain(test)
    ( $.map(x => { console.log('map1', x); return x + 1; })
    , $.map(x => { console.log('map2', x); return x * 1; })
    )
  );
  console.log(test);

  // sieve
  console.log('sieve - even', $.sieve(x => x % 2 === 0).apply(null, test));
  console.log('sieve - odd', $.sieve(x => x % 2 === 1).apply(null, test));
  console.log('sieve - none', $.sieve(x => false).apply(null, test));
  console.log('sieve - full', $.sieve(x => true).apply(null, test));
  console.log('sieve - one', $.sieve(x => x === 0).apply(null, test));
    

  // More complicated curry and chain with foldL conversion
  console.log('curry with foldL', $.chain(test)
    ( $.map(x => { console.log('map1', x); return x + 1; })
    , $.sieve(x => { console.log('sieve2', x); return x % 2 === 0; })
    , $.unmonad(Array.prototype.map, x => x + 3)
    , $.foldL(0, (acc, x) => { console.log('foldL'); return acc + x; })
    , $.map(x => x / 3)
    )
  );
  console.log(test);

  // Chunk
  $.chain($.range(0, 18))
  ( $.chunk(3)
  , console.log
  )
  $.chain($.range(0, 19))
  ( $.chunk(3)
  , console.log
  )
  $.chain($.range(0, 20))
  ( $.chunk(3)
  , console.log
  )


  // Fold |> rebox and curryApply interaction
  console.log('rebox and curryApply', $.curryApply
    ( $.map(x => x + 1)
    , $.sieve(x => x % 2 === 0)
    , $.unmonad(Array.prototype.map, x => x + 3)
    , $.rebox($.foldL(0, (acc, x) => acc + x))
    , $.map(x => x / 3)
    )(test)
  );
  console.log(test);

  // Constructor test
  console.log('Lazy basic', Lazy(test)
    .map(x => x + 1)
    .takeAll()
  );
  console.log(test);

  // foldL test
  console.log('foldL - regular version', Lazy(test)
    .map(x => x + 1)
    .sieve(x => x % 2 === 0)
    .foldL(0, (acc, x) => acc + x)
  );
  console.log(test);

  // foldLWrap test
  console.log('foldL - rewrap version', Lazy(test)
    .map(x => x + 1)
    .sieve(x => x % 2 === 0)
    .foldLWrap(0, (acc, x) => acc + x)
    .take(1) 
  );
  console.log(test);

  // See if lazy ordering is working
  console.log('Laziness testing', Lazy(test)
    .map(x => { console.log('map1', x); return x + 1; })
    .sieve(x => { console.log('sieve2', x); return x % 2 === 0; })
    .map(x => { console.log('map3', x); return x * 2; })
  );
  console.log(test);

  // seqUnmonad
  console.log('seqUnmonad', Lazy(test)
    .map(x => { console.log('map1', x); return x + 1; })
    .sieve(x => { console.log('sieve2', x); return x % 2 === 0; })
    .map(x => { console.log('map3', x); return x * 2; })
    .seqUnmonad(Array.prototype.map, x => { console.log('map3', x); return x * 2; })
  );
  console.log(test);

  // seqUnmonadWrap
  console.log('seqUnmonadWrap', Lazy(test)
    .map(x => { console.log('map1', x); return x + 1; })
    .sieve(x => { console.log('sieve2', x); return x % 2 === 0; })
    .map(x => { console.log('map3', x); return x * 2; })
    .seqUnmonadWrap(Array.prototype.map, x => { console.log('map3', x); return x * 2; })
    .foldLWrap(0, (acc, x) => acc + x)
    .take(6) 
  );
  console.log(test);
})();
