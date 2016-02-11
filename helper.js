"use strict";

let fs = require("fs"),
    co = require("co"),
    Q = require("q"),
    _ = require('underscore'),
    map = {
      r: 0,
      c: 0
    },
    commands = [],
    steps=1000
    ;
const warehouse = {
  r: 0,
  c: 0,
  itemsWeights: [],
  itemsCounts: []
};
co(function * () {
  var all = yield  Q.nfcall(fs.readFile, '/var/www/hashcode/app/files/parsed/mother_of_all_warehouses.in', 'utf-8');
  console.log("=================");
  console.log(JSON.parse(all));
  function move(from, to) {
    commands.push({
      length: Math.floor(Math.sqrt(Math.pow((from.r - to.r), 2) + Math.pow((from.c - to.c), 2))),
      from: from,
      to: to
    });
    steps-=Math.floor(Math.sqrt(Math.pow((from.r - to.r), 2) + Math.pow((from.c - to.c), 2)));
  }

  function load(dron,order) {
    while(dron.limit){
      let oneOrder=order.shift();
      dron.items.push(oneOrder);
      warehouse.items.shift();
      dron.limit-=oneOrder;
    }
    steps--;
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
    send: function (dron, client,order) {
      dron = {
        r: 0,
        c: 0,
        limit: 500,
        items: []
      };
      client = {
        r: 0,
        c: 0,
        itemsWeights: [10, 20],
        itemsCounts: [2, 3]
      };

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
          load(dron,order)
          move({
                c: dron.c,
                r: dron.r
              },
              {
                c: client.c,
                r: client.r
              }
          )
        }
      }else{
        move({
              c: dron.c,
              r: dron.r
            },
            {
              c: warehouse.c,
              r: warehouse.r
            }
        )
      }
    }

  }


}).catch((e)=> {
  console.log(e);
});