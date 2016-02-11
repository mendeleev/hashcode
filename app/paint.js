(function() {
  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d");

  var paint = {
    tile: 10,

    init: function(width, height) {
      canvas.width = width || 800;
      canvas.height = height || 600;
    },

    point: function(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x*this.tile, y*this.tile, this.tile, this.tile);
    }
  };

  paint.init();


})();