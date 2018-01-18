const {Lazy} = require('../fp');
const INFIN = 1 / 0;
console.log(Lazy(
  [ ['hello   ', 'cqwerlmrqwer   '],
    ['hewrk   ', 'periwp[i   '],
    ['xicvnoer   ', 'eroiun   '],
    ['hdsfkl   ', 'kldsfjlne   ']])
.test(1));
console.log(Lazy(
  [ [[1,2,3],4],
    [[5,6],[7,8]],
    [9,10,11,12],
    [13,14,15,16]])
.takeAll());