/*global me*/

var ScrollingBackgroundLayer = me.ImageLayer.extend({
  init: function (image, speed) {
    var name = image;
    var width = 640;
    var height = 480;
    var z = 1;
    var ratio = 1;
    this.speed = speed;
    this.parent(name, width, height, image, z, ratio);
  },

  update: function () {
    // recalibrate image position
    if (this.offset.x >= this.imagewidth) {
      this.offset.x = 0;
    }
    // increment horizontal background position
    this.offset.x += this.speed;
    return true;
  }
});