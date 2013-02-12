/*global me, jsApp*/

var PlayerEntity = me.ObjectEntity.extend({

  initialPosX: 0,
  defaultVelX: 1.6,
  defaultGrav: 0.98,
  maxVelX:     5.5,
  maxVelY:     8.6,
  inertia:     0.1,

  init: function (x, y, settings) {
    this.parent(x, y, settings);

    if (jsApp.debug) {
      me.debug.renderHitBox = true;
    }
    // set the default horizontal & vertical speed (accel vector)
    this.setVelocity(this.defaultVelX, 10);

    // adjust the bounding box
    this.updateColRect(5, 25, -1, 32);

    // set the display to follow our position on both axis
    //me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    this.initialPosX = Math.floor(this.pos.x);
  },

  // update the player pos
  update: function () {
    //player sprite animation speed
    this.animationspeed = 0.95;
    // player dead by falling or by exiting the viewport
    if (this.pos.y > jsApp.height || this.visible === false) {
      this.alive = false;
      me.state.change(me.state.MENU);
      return false;
    }

    // keyboard inputs
    if (me.input.isKeyPressed('left') || me.input.isKeyPressed('right')) {
      if (me.input.isKeyPressed('left')) {
        this.flipX(true);
        this.vel.x -= this.accel.x * me.timer.tick;

      } else if (me.input.isKeyPressed('right')) {
        if (this.maxVel.x < this.maxVelX) {
          this.maxVel.x += 0.1;
        }
        this.flipX(false);
        this.vel.x += this.accel.x * me.timer.tick;
      }
    } else {
      this.vel.x += this.accel.x * me.timer.tick;
      // stopping player by taking into account player's inertia
      this.maxVel.x = this.defaultVelX;

      if (this.vel.x > this.inertia) {
        this.vel.x -= 0.2;
      } else if (this.vel.x < -this.inertia) {
        this.vel.x += 0.2;
      } else {
        this.vel.x = 0;
      }
    }

    // update score
    var newScore = Math.floor(this.pos.x) - this.initialPosX;
    if (jsApp.score < newScore) {
      jsApp.score = newScore;
      me.game.HUD.setItemValue("score", jsApp.score);
    }

    // jump listener
    if (me.input.isKeyPressed('jump')) {
      if (!this.jumping && !this.falling && this.vel.y >= 0) {
        // set current vel to the maximum defined value
        // gravity will then do the rest
        this.vel.y = -this.maxVel.y * me.timer.tick;
        this.jumping = true;
      }
    }

    this.updateMovement();

    // check for collision
    var res = me.game.collide(this);

    if (res) {
      // if we collide with an enemy
      if (res.obj.type === me.game.ENEMY_OBJECT) {
        // check if it's a deadly oneshot enemy
        if (res.obj.name === 'stalagmite') {
          this.alive = false;
          me.state.change(me.state.MENU);
          return false;
        }
        // check if we jumped on it
        if ((res.y > 0) && !this.jumping) {
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
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      // update objet animation
      this.parent(this);
      return true;
    }
    // else inform the engine we did not perform
    // any update (e.g. position, animation)
    return false;
  }

});