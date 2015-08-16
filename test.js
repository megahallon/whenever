var whenever = require('./whenever.js');

exports.testFibonacci = function (test) {
  whenever.loadSource('./fib.we');
  var testPrint = [];
  whenever.registerPrint(function (str) {
    testPrint.push(str);
  });

  for (var i = 0; i < 100; ++i) {
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

exports.test99 = function (test) {
  whenever.loadSource('./99.we');
  var testPrint = [];
  whenever.registerPrint(function (str) {
    testPrint.push(str);
  });

  for (var i = 0; i < 100; ++i) {
    whenever.run();
    test.equal(testPrint.length, 297);
    test.equal(testPrint[0], '99 bottles of beer on the wall, 99 bottles of beer,');
    test.equal(testPrint[1], 'Take one down and pass it around,');
    test.equal(testPrint[2], '98 bottles of beer on the wall.');
    test.equal(testPrint[3], '98 bottles of beer on the wall, 98 bottles of beer,');
    test.equal(testPrint[4], 'Take one down and pass it around,');
    test.equal(testPrint[5], '97 bottles of beer on the wall.');
  }

  test.done();
}
