"use strict";

let fs = require("fs"),
    co = require("co"),
    Q = require("q"),
    parser = require("./parser");


co(function * () {
  let content = yield Q.nfcall(fs.readFile, process.argv.pop());
  parser(content.toString());
});

