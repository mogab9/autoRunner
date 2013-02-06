var PlayerEntity = me.ObjectEntity.extend({
    
    initialPosX: 0,

    init: function(x, y, settings) {
        this.parent(x, y, settings);

        if (jsApp.debug)
            me.debug.renderHitBox = true;
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(4.5, 15);

        // adjust the bounding box
        this.updateColRect(5, 25, -1, 32);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.initialPosX = Math.floor(this.pos.x);
    },
 

    // update the player pos
    update: function() {
        // player dead by falling below the game height
        if (this.pos.y > jsApp.height)
        {
            me.state.change(me.state.MENU);
            return false;
        }

        this.vel.x += this.accel.x * me.timer.tick;

        // update score
        jsApp.score = Math.floor(this.pos.x) - this.initialPosX;
        me.game.HUD.setItemValue("score", jsApp.score);

        // jump listener
        if (me.input.isKeyPressed('jump')) {  
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }
        }
     
        this.updateMovement();
     
        // check for collision
        var res = me.game.collide(this);
     
        if (res) {
            // if we collide with an enemy
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                // check if we jumped on it
                if ((res.y > 0) && ! this.jumping) {
                    // bounce (force jump)
                    this.falling = false;
                    this.vel.y = -this.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.jumping = true;
     
                } else {
                    // let's flicker in case we touched an enemy
                    this.flicker(45);
                }
            }
        }
     
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;      
     
    }
     
});