const {test} = require('tape');
const Utils = require('../src/utils');
const {_} = require('../index');
const {baseFlattenMin1, isArrayLike, pushArray, inlineSlice} = Utils;

test('Does the library even work? Map test', t => {
  var static = [1,2,3,4,5,6,7,8,9,0];
  var test   = [1,2,3,4,5,6,7,8,9,0];
  t.deepEqual(_.map(x => x * 2).apply(null, test), [2,4,6,8,10,12,14,16,18,0]);
  t.deepEqual(test, static, 'immutability test');
  t.comment(''); t.comment(''); t.comment('');
  t.end();
});

test('Unfolds (Import from Compose)', t => {
  t.deepEqual(_.range(1,10), [1,2,3,4,5,6,7,8,9], 'Range');
  t.comment('\n\n\n');
  t.end();
});

test('Utilities - .inlineSlice(skip from start, skip from the end)', t => {
  var test = [1,2,3,4,5,6,7,8,9,0];
  var args;
  args = [0,0]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [1,2,3,4,5,6,7,8,9,0], `inlineSlice(${args.join(',')})`);
  args = [0,1]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [1,2,3,4,5,6,7,8,9], `inlineSlice(${args.join(',')})`);
  args = [1,0]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [2,3,4,5,6,7,8,9,0], `inlineSlice(${args.join(',')})`);
  args = [1,1]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [2,3,4,5,6,7,8,9], `inlineSlice(${args.join(',')})`);
  args = [0,3]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [1,2,3,4,5,6,7], `inlineSlice(${args.join(',')})`);
  args = [3,1]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [4,5,6,7,8,9], `inlineSlice(${args.join(',')})`);
  args = [3,4]; t.deepEqual(inlineSlice.apply(null, args).apply(null, test), [4,5,6], `inlineSlice(${args.join(',')})`);

  t.deepEqual(test, [1,2,3,4,5,6,7,8,9,0], 'immutability check');
  t.comment(''); t.comment(''); t.comment('');
  t.end();
});

test('FFP.curry and FFP.chain', t => {
  var static = [1,2,3,4,5,6,7,8,9,0];
  var test   = [1,2,3,4,5,6,7,8,9,0];

  var oneArgs = source => _.curry(_.map(x => x + 1)).apply(null, source);
  var twoArgs = source => _.curry(_.map(x => x + 1), _.map(x => x * 2)).apply(null, source);
  var threeArgs = source => _.curry(_.map(x => x + 1), _.map(x => x * 2), _.map(x => x - 1)).apply(null, source);
  t.deepEqual(_.curry().apply(null, test), static, 'curry zero arguments');
  t.deepEqual(oneArgs(test), [2,3,4,5,6,7,8,9,10,1], 'curry(one) - of array');
  t.deepEqual(twoArgs(test), [4,6,8,10,12,14,16,18,20,2], 'curry(first, second) - of array');
  t.deepEqual(threeArgs(test), [3,5,7,9,11,13,15,17,19,1], 'curry(first, second, third) - of array');

  t.comment('curried function should not mutate so should give same values if run again');
  t.deepEqual(oneArgs(test), [2,3,4,5,6,7,8,9,10,1], 'again: curry(one) - of array');
  t.deepEqual(twoArgs(test), [4,6,8,10,12,14,16,18,20,2], 'again: curry(first, second) - of array');
  t.deepEqual(threeArgs(test), [3,5,7,9,11,13,15,17,19,1], 'again: curry(first, second, third) - of array');

  t.comment('FFP.chain');
  t.deepEqual(
    _.chain(test)(
      _.map(x => x + 1)
      ,_.sieve(x => x % 2 === 1)
      ,_.map(x => x * x)
    ),
    [9,25,49,81 ,1], 'on an array'
  );

  t.deepEqual(test, static, 'immutability test');
  t.comment(''); t.comment(''); t.comment('');
  t.end();
});



test('FFP.chain', t => {
  var static = [1,2,3,4,5,6,7,8,9,0];
  var test   = [1,2,3,4,5,6,7,8,9,0];
  // chain

  t.deepEqual(test, static, 'immutability test');
  t.comment(''); t.comment(''); t.comment('');
  t.end();
});


// Flatten
test('Basic usage - baseFlatten(depth) - flattens {depth} times', t => {
  var static = [[1,2,3, [4,5,[6],7,[8],9], []],   [],10, [[11],12,[],13] ,14];
  var test   = [[1,2,3, [4,5,[6],7,[8],9], []],   [],10, [[11],12,[],13] ,14];
  var count;
  
  // Flattening once at 0 with the base flatten is expected
  var baseFlatten = (count) => baseFlattenMin1([], count).apply(null, test);
  count = 1; t.deepEqual(baseFlatten(count), [1,2,3, [4,5,[6],7,[8],9],[],10,[11],12,[],13,14], `Base flatten - ${count}`);
  count = 2; t.deepEqual(baseFlatten(count), [1,2,3,4,5,[6],7,[8],9,10,11,12,13,14], `Base flatten - ${count}`);
  count = 3; t.deepEqual(baseFlatten(count), [1,2,3,4,5,6,7,8,9,10,11,12,13,14], `Base flatten - ${count}`);
  count = 4; t.deepEqual(baseFlatten(count), [1,2,3,4,5,6,7,8,9,10,11,12,13,14], `Base flatten - ${count}`);
  t.deepEqual(test, static, 'immutability test');
  t.comment(''); t.comment(''); t.comment('');
  t.end();
});

test('Edge cases for baseFlatten', t => {
  var test = [[1,2,3, [4,5,[6],7,[8],9], []],   [],10, [[11],12,[],13] ,14];
  t.deepEqual(baseFlattenMin1([], 0).apply(null, test), [1,2,3, [4,5,[6],7,[8],9],[],10,[11],12,[],13,14], '0 expected flattening to be the same 1');
  t.deepEqual(baseFlattenMin1([], 1).apply(null, []), [], 'Empty Array');
  t.deepEqual(baseFlattenMin1([], 1).apply(null, [1, [], 2, [3, []]]), [1,2,3, []], 'Should display blank array');
  t.end();
});

test('Chainability of FFP.flatten', t => {
  // t.deepEqual()
  var static = [1,2,3,[4,5,[],[6,[7,[8],[[9]]]]]];
  var test   = [1,2,3,[4,5,[],[6,[7,[8],[[9]]]]]];
  t.deepEqual(
    _.flatten(5).apply(null, test),
    [1,2,3,4,5,6,7,8,9],
    'just testing if flatten works'
  );

  t.deepEqual(
    _.chain(test)(
      _.sieve(x => isArrayLike(x))
      ,_.flatten(2)
    ),
    [4,5,6,[7,[8],[[9]]]],
    'before'
  );

  t.deepEqual(
    _.chain(test)(
      _.sieve(x => isArrayLike(x))
      ,_.flatten(5)
      ,_.chunk(3)
    ),
    [[4,5,6], [7,8,9]],
    'inbetween'
  );
  t.deepEqual(
    _.chain(test)(
      _.flatten(1)
      ,_.map(x => [x])
    ),
    [[1],[2],[3],[4],[5],[[]],[[6,[7,[8],[[9]]]]]],
    'after'
  );

  t.deepEqual(
    _.chain(test)(
      _.sieve(x => isArrayLike(x))
      ,_.flatten(2)
      ,_.flatten(3)
      ,_.chunk(3)
    ),
    [[4,5,6], [7,8,9]],
    'double'
  );
  t.deepEqual(test, static, 'immutability test');

  t.comment(''); t.comment(''); t.comment('');
  t.end();
});

test('FFP.flatten edge cases', t => {
  var static = [1,2,3,[4,5,[],[6,[7,[8],[[9]]]]]];
  var test   = [1,2,3,[4,5,[],[6,[7,[8],[[9]]]]]];
  t.deepEqual(_.flatten(0).apply(null, test), static, 'zero');
  t.deepEqual(_.chain(test)(_.flatten(0), _.sieve(x => isArrayLike(x))),
    [[4,5,[],[6,[7,[8],[[9]]]]]], 'zero - chain before'
  );
  t.deepEqual(_.chain(test)(_.map(x => [x]), _.flatten(0), _.map(x => x.length)),
    [1,1,1,1], 'zero - chain inbetween'
  );
  t.deepEqual(_.chain(test)(_.map(x => [x]), _.flatten(0), _.sieve(x => isArrayLike(x))),
    [[1],[2],[3],[[4,5,[],[6,[7,[8],[[9]]]]]]], 'zero - chain after'
  );

  var static2 = [1,2,3,4,5,6,7,[8],[[9]]];
  var threeFlatten = [1,2,3,4,5,6,7,[8],[[9]]];
  t.deepEqual(_.chain(test)(_.flatten(0), _.flatten(0)), static, '.flatten(0).flatten(0)');
  t.deepEqual(_.chain(test)(_.flatten(3), _.flatten(0)), threeFlatten, '.flatten(three).flatten(0)');
  t.deepEqual(_.chain(test)(_.flatten(0), _.flatten(3)), threeFlatten, '.flatten(0).flatten(three)');
  t.deepEqual(_.chain(test)(_.flatten(1), _.flatten(0), _.flatten(0), _.flatten(2)),
    threeFlatten, '.flatten(two).flatten(0).flatten(0).flatten(three)');
  t.deepEqual(test, static, 'immutability test 1');
  t.deepEqual(threeFlatten, static2, 'immutability test 2');
  t.end();
});

/*
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
//*/