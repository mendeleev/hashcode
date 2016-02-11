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
    steps = 1000,
    limits = 500
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
  function move(from, to, dron) {
    if ((steps - 1) > 0 && ((dron.turns - 1) > 0)) {
      commands.push({
        length: Math.floor(Math.sqrt(Math.pow((from.r - to.r), 2) + Math.pow((from.c - to.c), 2))),
        from: from,
        to: to
      });
      dron.r = to.r;
      dron.c = to.c;
      steps -= Math.floor(Math.sqrt(Math.pow((from.r - to.r), 2) + Math.pow((from.c - to.c), 2)));
      dron.turns--;
    } else {
      throw new Error;
    }
  }

  function load(dron, order) {
    if (((steps - 1) > 0) && ((dron.turns - 1) > 0)) {
      while (dron.limit) {
        warehouse.items.shift();
        dron.items.push(order);
        dron.limit -= order;

      }
      dron.turns--;
      steps--;
    } else {
      throw new Error;
    }

  }

  function unload(client, dron) {
    if ((steps - 1) > 0&&((dron.turns - 1) > 0)) {
      while (dron.limit) {
        client.items = union(client.items, dron.items);
        dron.items = [];
        dron.limit = limits;
      }
      dron.r = client.r;
      dron.c = client.c;
      steps--;
      dron.turns--;
    } else {
      throw new Error;
    }
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
    send: function (dron, client, order) {
      dron = {
        r: 0,
        c: 0,
        limit: 500,
        items: []
      };
      client = {
        r: 0,
        c: 0,
        items: [10, 20],
      }
          order=[100,100,200]

      while (steps > 0) {
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
            load(dron, order);
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
        } else {
          unload(client, dron);
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

  }


}).catch((e)=> {
  console.log(e);
});