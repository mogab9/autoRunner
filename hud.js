// distance traveled HUD Item
var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
        this.font = new me.BitmapFont("32x32_font", 32);
    },
 
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});

var DeathDisplay = me.HUD_Item.extend({
    init: function( x, y ) {
        this.parent( x, y );
    }
});