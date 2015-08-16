'use strict';

var _ = require('lodash');
var fs = require('fs');
var PEG = require('pegjs');

function getFuncFromString(str) {
  return _.find(lines, function (el) {
    return el.name === str;
  });
}

function print(str) {
  printFunc(str);
}

function add(fn, times) {
  var _fn = getFuncFromString(fn);
  if (_fn === undefined) {
    return;
  }
  _fn.todo += times;
  if (_fn.todo < 0) {
    _fn.todo = 0;
  }
}

function again_defer(a_predicate, d_predicate, fn) {
  if (a_predicate && d_predicate) {
    ++currentLine.todo;
  }
  else if (!a_predicate && d_predicate) {
    ++currentLine.todo;
  }
  else if (a_predicate && !d_predicate) {
    fn();
    ++currentLine.todo;
  }
  else if (!a_predicate && !d_predicate) {
    fn();
  }
}

function defer(predicate, fn) {
  if (predicate) {
    ++currentLine.todo;
  }
  else {
    fn();
  }
}

function again(predicate, fn){
  fn();

  if (predicate) {
    ++currentLine.todo;
  }
}

function N(fn) {
  var _fn = getFuncFromString(fn);
  if (_fn === undefined) {
    return 0;
  }
  return getFuncFromString(fn).todo;
}


function run() {
  while (true) {
    var totalTodo = _.sum(lines, function(e) {
      return e.todo;
    });

    if (totalTodo === 0) {
      return;
    }

    var chosen;
    do {
      chosen = _.sample(lines);
    } while (chosen.todo === 0);

    currentLine = chosen;
    chosen();
    if (chosen.todo > 0) {
      --chosen.todo;
    }
  }
}

function deStringify(arr) {
  return _.map(arr, function(el) {
    var moo;
    eval('moo = ' + el);
    moo.todo = 1;
    return moo;
  });
}

function loadSource(path) {
  var file = fs.readFileSync(path);

  var grammar = fs.readFileSync(__dirname + '/grammar.peg').toString();
  var parser = PEG.buildParser(grammar);
  var bag = parser.parse(file.toString());

  lines = deStringify(bag);
}

exports.loadSource = loadSource;
exports.run = run;
exports.registerPrint = function (f) {
  printFunc = f;
};

var lines;
var currentLine;
var printFunc = console.log;
