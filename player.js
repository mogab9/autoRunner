/*global me, jsApp, forcefield*/

var forcefieldEntity = me.ObjectEntity.extend({
  player: null,
  speed:  3.22,

  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.collidable = true;
    this.player = me.game.getEntityByName('mainPlayer')[0];
    this.pos.x  = this.player.pos.x;
    this.pos.y  = this.player.pos.y - 25;
  },

  update: function () {
    this.pos.x = this.pos.x + this.speed;
    this.pos.y = this.player.pos.y - 25;
  },

  onCollision: function (res, obj) {
    // reset death counter for player
    if (this.alive && obj.name === 'mainplayer') {
      this.player.tickBeforeDeath = 10;
    }
  }
});

var PlayerEntity = me.ObjectEntity.extend({

  tickBeforeDeath: 10,
  initialPosX:     0,
  defaultVelX:     3.25,
  defaultGrav:     0.98,
  maxVelX:         5.5,
  maxVelY:         8.6,
  inertia:         0.1,
  animspeed:       0.8,

  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.collidable = true;
    this.current.animationspeed = this.animspeed;

    if (jsApp.debug) {
      me.debug.renderHitBox = true;
    }
    // set the default horizontal & vertical speed (accel vector)
    this.setVelocity(this.defaultVelX, 10);

    // adjust the bounding box
    this.updateColRect(0, 25, -1, -1);

    this.initialPosX = Math.floor(this.pos.x);
  },

  death: function () {
    this.alive = false;
    me.state.change(me.state.MENU);
    return false;
  },

  // update the player pos
  update: function () {
    var i = 0;
    var res = null;
    this.tickBeforeDeath--;

    // player dead by falling or by exiting the viewport
    if (this.pos.y > jsApp.height || this.visible === false || this.tickBeforeDeath <= 0) {
      this.death();
      return false;
    }

    // keyboard inputs
    if (me.input.isKeyPressed('left') || me.input.isKeyPressed('right')) {
      // left
      if (me.input.isKeyPressed('left')) {
        this.vel.x -= this.accel.x * me.timer.tick;
      // right
      } else if (me.input.isKeyPressed('right')) {
        this.setVelocity(10, 10);
        this.vel.x += this.accel.x * me.timer.tick;
      }
    } else {
      this.setVelocity(this.defaultVelX, 10);
      this.vel.x += this.accel.x * me.timer.tick;
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
        this.vel.y = -this.maxVel.y * me.timer.tick;
        this.jumping = true;
      }
    }

    this.updateMovement();

    // check for collision
    res = me.game.collide(this, true);
    for (i = 0; i < res.length; i++) {
      // if mainPlayer collides with an ennemy he dies
      if (res[i].obj.type === me.game.ENEMY_OBJECT) {
        this.death();
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