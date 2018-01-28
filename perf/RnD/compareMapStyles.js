// This is like super close to micro optimisation territory so best not to
// really trust the results

const {Suite} = require('benchmark');
const {_} = require('../../index');
const imp = require('../../src/imperative');
const {shuffle} = require('./RnDUtils');

const test = shuffle([0,1,2]);
const tween = shuffle([12, 15, 18]);
const start = [100, 120, 140];

const cheaty = _.map(i => start[i] + tween[i]); 
const stuff = i => start[i] + tween[i];

Suite().add('Native map and function creation', function() {
  _.map(i => start[i] + tween[i]).apply(test);
}).add('FFP style and function creation', function() {
  test.map(i => start[i] + tween[i]);
}).add('Imperative style and function creation', function() {
  imp.map(i => start[i] + tween[i], test);
}).add('\nNative Map - saved function', function() {
  test.map(stuff);
}).add('FFP style - saved function', function() {
  cheaty.apply(test);
}).add('Imperative style - saved function', function() {
  imp.map(stuff, test);
}).on('cycle', function(event) { // add listeners
  console.log(String(event.target));
}).on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ 'async': true }); // run async

//*/