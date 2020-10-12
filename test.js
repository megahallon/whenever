'use strict';

const whenever = require('./whenever.js');

exports.testFibonacci = test => {
  whenever.loadSource('./fib.we');

  let testPrint;
  whenever.registerPrint(str => {
    testPrint.push(str);
  });

  for (let i = 0; i < 100; ++i) {
    testPrint = [];
    whenever.run();
    test.equal(testPrint.length, 52);
    test.equal(testPrint[0], 1);
    test.equal(testPrint[1], 1);
    test.equal(testPrint[2], 2);
    test.equal(testPrint[3], 3);
    test.equal(testPrint[4], 5);
    test.equal(testPrint[5], 8);
  }

  test.done();
}

exports.test99 = test => {
  whenever.loadSource('./99.we');

  let testPrint;
  whenever.registerPrint(str => {
    testPrint.push(str);
  });

  for (let i = 0; i < 100; ++i) {
    testPrint = [];
    whenever.run();
    test.equal(testPrint.length, 297);
    test.equal(testPrint[0], '99 bottles of beer on the wall, 99 bottles of beer,\n');
    test.equal(testPrint[1], 'Take one down and pass it around,\n');
    test.equal(testPrint[2], '98 bottles of beer on the wall.\n');
    test.equal(testPrint[3], '98 bottles of beer on the wall, 98 bottles of beer,\n');
    test.equal(testPrint[4], 'Take one down and pass it around,\n');
    test.equal(testPrint[5], '97 bottles of beer on the wall.\n');
  }

  test.done();
}

exports.rot13 = test => {
  whenever.loadSource('./rot13.we');

  let testPrint;
  whenever.registerPrint(str => {
    testPrint += str;
  });

  for (let i = 0; i < 100; ++i) {
    testPrint = "";
    whenever.run("foobar");
    test.equal(testPrint, "sbbone\n");
  }

  test.done();
}
