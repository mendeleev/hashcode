"use strict";

let fs = require("fs"),
    co = require("co"),
    Q = require("q"),
    parser = require("./parser"),
    clients = [
      {
        x: 2,
        y: 2
      }
    ],
    orders = [
      {
        id: 100500,
        x: 2,
        y: 2,
        goods: [1, 2, 3],
        counts: [1, 1, 1]
      }
    ],
    warehouses = [
      {
        id: 1,
        goods: [
          1, 2, 3, 4, 5
        ]
      }
    ],
    drones = [
      {
        id: 0
      }
    ],
    commands = [];


co(function * () {
  let content = yield Q.nfcall(fs.readFile, process.argv.pop());

  while (clients.length) {
    while (drones.length) {
      let drone = drones.pop(),
          client = clients.pop(),
          warehouse = warehouses.pop(),
          order = orders.filter((order) => {
            return client.x === order.x && client.y === order.y;
          }).pop();
      while (order.goods.length) {
        let item = order.goods.pop(),
            count = order.counts.pop();
        commands.push(`${drone.id} L ${warehouse.id} ${item} ${count}`); // загружаем
        commands.push(`${drone.id} D ${order.id} ${item} ${count}`); // загружаем
      }
    }


  }
  console.log("commands --> ", commands);

  parser(content.toString());
});

