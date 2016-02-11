"use strict";

let fs = require("fs"),
    co = require("co"),
    Q = require("q"),
    _ = require('underscore'),
    map = {
      r: 0,
      c: 0
    },
    commands = []
    ;
const warehouse = {
  r: 0,
  c: 0,
  itemsWeights: [],
  itemsCounts: []
};
co(function * () {
  function move(from, to) {
    commands.push({
      length: Math.floor(Math.sqrt(Math.pow((from.r - to.r), 2) + Math.pow((from.c - to.c), 2))),
      from: from,
      to: to
    });
  }

  function load() {
    commands.push({
      length: 1,
      text: 'load'
    });
  }

  /**2x2
   *
   * @type {{buildMap: module.exports.buildMap}}
   */
  module.exports = {
    setMap: function (r, c) {
      map.r = r;
      map.c = c;
    },
    send: function (dron, client) {
      let dron = {
            r: 0,
            c: 0,
            load: 500,
            items: []
          },
          client = {
            r: 0,
            c: 0,
            itemsWeights: [10, 20],
            itemsCounts: [2, 3]
          }
      if (dron.c != client.c && dron.r != client.r) {
        if (dron.c != warehouse.c && dron.r != warehouse.r) {
          //to the warehouse
          move({
                c: dron.c,
                r: dron.r
              },
              {
                c: warehouse.c,
                r: warehouse.r
              }
          )
        } else {
          //load and move to the client
          load()
        }
      }
    }

  }


});