(function() {
  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),

      DRONE = 1,
      WAREHOUSE = 2;

  var paint = {
    tile: 4,

    init: function(width, height) {
      canvas.width = width || 800;
      canvas.height = height || 600;
    },

    point: function(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x*this.tile, y*this.tile, this.tile, this.tile);
    },

    paintNumbers: function(x, y, num) {
      ctx.fillStyle = color;
      ctx.fillRect(x*this.tile, y*this.tile, this.tile, this.tile);
      ctx.fillText(num, x, y);
    }
  };

  var parser = {
    rows: 0,
    cols:0,
    drones:0,
    turns:0,
    payload:0,

    warehouses: [],
    goods: [],
    goodsCount: 0,

    orders: [],
    ordersCount: 0,

    getGoods: function(data) {
      this.goodsCount = Number(data[1]);
      this.goods = data[2].split(" ").map(Number).sort(function(a,b){return a-b;});

      return this.goods;
    },

    getWarehouses: function(data) {
      var count = Number(data[3]),
          index = 0,
          warehouses = data.slice(4, count*2+4);

      while(warehouses[index]) {
        this.warehouses.push({
          coords: warehouses[index++].split(" ").map(Number),
          items: warehouses[index++].split(" ").map(Number).sort(function(a,b){return a-b;})
        });

      }

      return this.warehouses;
    },

    getOrders: function(data) {
      var warehouses = this.warehouses.length,
          index = 0,
          startsFrom = (5+warehouses*2),
          orders = data.slice(startsFrom, data.length);

      this.ordersCount = Number(data[(4+warehouses*2)]);

      while(orders[index]) {
        this.orders.push({
          coords: orders[index++].split(" ").map(Number),
          count: Number(orders[index++]),
          items: orders[index++].split(" ").map(Number).sort(function(a,b){return a-b;})
        });

      }

      return this.orders;
    },

    getInitial: function(data) {
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


  $.ajax({
    "url": "app/files/redundancy.in"
  }).then(function(data) {
    data = data.split("\n");
    parser.getGoods(data);
    parser.getInitial(data[0].split(" "));
    parser.getWarehouses(data);

    parser.getOrders(data);

    paint.init(parser.cols * paint.tile, parser.rows * paint.tile);

    console.log(JSON.parse(JSON.stringify(parser)));
    console.log(JSON.stringify(parser));

  });





})();