(function () {
  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      drones = [],

      DRONE = 1,
      WAREHOUSE = 2;

  var paint = {
    tile: 2,

    init: function (width, height) {
      canvas.width = width || 800;
      canvas.height = height || 600;
    },

    render: function (data, color, scale) {
      for (var i = 0; i < data.length; i++) {
        this.point(data[i].coords[0], data[i].coords[1], scale, color);
      }
    },

    point: function (x, y, scale, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x * this.tile * scale, y * this.tile * scale, this.tile * scale, this.tile * scale);
    },

    paintNumbers: function (x, y, num) {
      ctx.fillStyle = color;
      ctx.fillRect(x * this.tile, y * this.tile, this.tile, this.tile);
      ctx.fillText(num, x, y);
    }
  };

  var parser = {
    rows: 0,
    cols: 0,
    drones: 0,
    turns: 0,
    payload: 0,

    warehouses: [],
    goods: [],
    goodsCount: 0,

    orders: [],
    ordersCount: 0,

    getGoods: function (data) {
      this.goodsCount = Number(data[1]);
      this.goods = data[2].split(" ").map(Number);
      return this.goods;
    },

    getWarehouses: function (data) {
      var count = Number(data[3]),
          index = 0,
          warehouses = data.slice(4, count * 2 + 4);

      while (warehouses[index]) {
        this.warehouses.push({
          coords: warehouses[index++].split(" ").map(Number),
          items: warehouses[index++].split(" ").map(Number)
        });

      }

      return this.warehouses;
    },

    getOrders: function (data) {
      var warehouses = this.warehouses.length,
          index = 0,
          startsFrom = (5 + warehouses * 2),
          orders = data.slice(startsFrom, data.length);

      this.ordersCount = Number(data[(4 + warehouses * 2)]);

      while (orders[index]) {
        this.orders.push({
          coords: orders[index++].split(" ").map(Number),
          count: Number(orders[index++]),
          items: orders[index++].split(" ").map(Number)
        });

      }

      for (var i = 0; i < this.orders.length; i++) {
        this.orders[i].weight = this.orders[i].items.map(function (item, index) {
          return item * this.goods[index];
        }.bind(this));

        this.orders[i].distances = this.warehouses.map(function (i) {
          return function (warehouse) {
            return Math.sqrt((Math.pow(this.orders[i].coords[0] - warehouse.coords[0]), 2) + (Math.pow(this.orders[i].coords[1] - warehouse.coords[1], 2)))
          }.bind(this)
        }.bind(this)(i));

        this.orders[i].rangeFactor = this.orders[i].distances.map(function (distance) {
          return this.orders[i].weight.reduce(function (prev, curr) {
                return prev + curr;
              }, 0) * distance
        }.bind(this));

        var minRangeFactor = Math.min.apply(Math, this.orders[i].rangeFactor),
            optimalWareHouse = this.warehouses[this.orders[i].rangeFactor.indexOf(minRangeFactor)];

        this.orders[i].optimalWareHouse = optimalWareHouse;

      }

      for(var j = 0; j < this.orders.length; j++) {

      }


      return this.orders.sort(function (a, b) {
        return a.rangeFactor > b.rangeFactor;
      });
    },

    getInitial: function (data) {
      this.rows = Number(data[0]);
      this.cols = Number(data[1]);
      this.drones = Number(data[2]);
      this.turns = Number(data[3]);
      this.payload = Number(data[4]);

      return {
        rows: this.rows,
        cols: this.cols,
        drones: this.drones,
        turns: this.turns,
        payload: this.payload
      }
    }
  };



  for(var i = 0; i < parser.drones; i++) {
    drones.push({
      id: i,
      load: function(werehouse, type, count) {
        return [this.id, "L", werehouse, type, count].join(" ");
      },

      deliver: function(order, type, count) {
        return [this.id, "D", order, type, count].join(" ")
      },

      wait: function(turns) {
        return [this.id, "W", turns].join(" ")
      }
    });
  }

  console.log(drones);


  $.ajax({
    "url": "app/files/redundancy.in"
  }).then(function (data) {
    data = data.split("\n");
    parser.getGoods(data);
    parser.getInitial(data[0].split(" "));
    var warehouses = parser.getWarehouses(data);

    var orders = parser.getOrders(data);

    paint.init(parser.cols * paint.tile, parser.rows * paint.tile);

    console.log(JSON.parse(JSON.stringify(parser)));
    //console.log(JSON.stringify(parser));

    paint.render(warehouses, "red", 1);
    paint.render(orders, "grey", 1);

  });


})();