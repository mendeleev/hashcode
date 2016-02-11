"use strict";

let fs = require("fs"),
    co = require("co"),
    Q = require("q"),
    _ = require('underscore')


co(function * () {
  /**2x2
   * [
   * [[],[]],
   * [[],[]]
   * ]
   * @type {{buildMap: module.exports.buildMap}}
   */
  module.exports = {
    buildMap: function (x, y) {
      var results = [];
      for (let i = 0; i < x; i++) {
        let row = [];
        for (let j = 0; j < y; j++) {
          row.push([]);
        }
        results.push(row);
      }
    }
  }


});