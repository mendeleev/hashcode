"use strict";

let fs = require("fs"),
    co = require("co"),
    Q = require("q"),
    _ = require('underscore'),
    map = {
      r: 0,
      c: 0
    }
    ;

co(function * () {
  function calculStep(from,to){
    var x=from.r-to.r;
    return ;
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
    send: function (dron, warehouse, customer, products) {
      let dron = {
            r: 0,
            c: 0,
            load: 500,
        items
          },
          warehouse = {
            r: 0,
            c: 0,
            items :[]
          }
    }

  }


});