'use strict';

const _ = require('lodash');
const fs = require('fs');
const PEG = require('pegjs');

let lines;
let currentLine;
let input;
let printFunc = (str) => {
  process.stdout.write(str);
};

function print(str) {
  printFunc(str + '\n');
}

function put(str) {
  printFunc(str);
}

function read() {
  if (input.length) {
    let i = input[0];
    input = input.slice(1);
    return i.charCodeAt(0);
  }
  return 0;
}

function add(line, times) {
  let fn = lines[line];
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
  let fn = lines[line];
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
  _.keys(lines).forEach(e => lines[e].todo = 1);

  while (true) {
    let totalTodo = _.sumBy(_.keys(lines), e => lines[e].todo);

    if (totalTodo === 0) {
      return;
    }

    let chosen;
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
  let funcs = {};
  arr.forEach(el => {
    let l = el.split('::');
    let line = l[0];
    let body = l[1];
    let f;
    eval('f = () => {' + body + '}');
    f.todo = 1;
    funcs[line] = f;
  });
  return funcs;
}

function loadSource(path) {
  let file = fs.readFileSync(path);

  let grammar = fs.readFileSync(__dirname + '/grammar.peg').toString();
  let parser = PEG.buildParser(grammar);
  let bag;
  try {
    bag = parser.parse(file.toString());
  } catch (e) {
    console.log(`${path}: ${e.line}:${e.column}: ${e.message}`);
    return false;
  }

  lines = createLineFuncs(bag);
  return true;
}

function registerPrint(f) {
  printFunc = f;
};

exports.loadSource = loadSource;
exports.run = run;
exports.registerPrint = registerPrint;
