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
      this.goodsCount = data[1];
      this.goods = data[2];

      return this.goods;
    },

    getWarehouses: function(data) {
      var count = data[3],
          index = 4,
          coords;

      for(var i = 0; i < count; i++) {
        coords = data[index++];

        this.warehouses.push({
          x: coords[0],
          y: coords[1],
          items: data[index++]
        });
      }

      return this.warehouses;
    },

    getOrders: function(data) {
      var warehouses = this.warehouses.length,
          coords,
          index = 0,
          startsFrom = (5+warehouses*2),
          orders = data.slice(startsFrom, data.length);

      this.ordersCount = data[(4+warehouses*2)];

      while(orders[index]) {
        this.orders.push({
          coords: orders[index++].split(" ").map(Number),
          count: Number(orders[index++]),
          items: orders[index++].split(" ").map(Number)
        });

      }

      return this.orders;
    },

    getInitial: function(data) {
      this.rows = data[0];
      this.cols = data[1];
      this.drones = data[2];
      this.turns = data[3];
      this.payload = data[4];

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
    "url": "app/files/mother_of_all_warehouses.in"
  }).then(function(data) {
    data = data.split("\n");
    parser.getGoods(data);
    parser.getInitial(data[0].split(" "));
    parser.getWarehouses(data);

    parser.getOrders(data);

    paint.init(parser.cols * paint.tile, parser.rows * paint.tile);

    console.log(JSON.stringify(parser));

  });





})();