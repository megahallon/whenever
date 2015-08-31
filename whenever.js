'use strict';

var _ = require('lodash');
var fs = require('fs');
var PEG = require('pegjs');

function print(str) {
  printFunc(str);
}

function put(str) {
  process.stdout.write(str);
}

var input = "";

function read() {
  if (input.length) {
    var i = input[0];
    input = input.slice(1);
    return i.charCodeAt(0);
  }
  else {
    console.log("\nnothing to read");
    process.exit(1);
  }
}

function add(line, times) {
  var fn = lines[line];
  if (fn === undefined) {
    return;
  }
  fn.todo += times;
  if (fn.todo < 0) {
    fn.todo = 0;
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

function again(predicate, fn) {
  fn();

  if (predicate) {
    ++currentLine.todo;
  }
}

function N(line) {
  var fn = lines[line];
  if (fn === undefined) {
    return 0;
  }
  return fn.todo;
}

function U(unicode) {
  return String.fromCharCode(unicode);
}

function run(i) {
  input = i || "";
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

function createLineFuncs(arr) {
  var funcs = {};
  _.forEach(arr, function (el) {
    var l = el.split('::');
    var line = l[0];
    var body = l[1];
    var f;
    eval('f = function () {' + body + '}');
    f.todo = 1;
    funcs[line] = f;
  });
  return funcs;
}

function loadSource(path) {
  var file = fs.readFileSync(path);

  var grammar = fs.readFileSync(__dirname + '/grammar.peg').toString();
  var parser = PEG.buildParser(grammar);
  try {
    var bag = parser.parse(file.toString());
  } catch (e) {
    console.log(path + ':' + e.line + ':' + e.column + ': ' + e.message);
    return false;
  }

  lines = createLineFuncs(bag);
  return true;
}

exports.loadSource = loadSource;
exports.run = run;
exports.registerPrint = function (f) {
  printFunc = f;
};

var lines;
var currentLine;
var printFunc = function (str) {
  process.stdout.write(str + '\n');
}

