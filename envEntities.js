/*global me, alert, window, gameResources, TitleScreen, PlayScreen, ScoreObject, PlayerEntity, CoinEntity, EnemyEntity*/

/*----------------
 a Coin entity
------------------------ */
var CoinEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this.parent(x, y, settings);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision: function () {
    // do something when collected
  }

});

/* --------------------------
an enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    // define this here instead of tiled
    settings.image = "wheelie_right";
    settings.spritewidth = 64;

    // call the parent constructor
    this.parent(x, y, settings);

    this.startX = x;
    this.endX = x + settings.width - settings.spritewidth;

    // make him start from the right
    this.pos.x = x + settings.width - settings.spritewidth;
    this.walkLeft = true;

    // walking & jumping speed
    this.setVelocity(4, 6);

    // make it collidable
    this.collidable = true;
    // make it a enemy object
    this.type = me.game.ENEMY_OBJECT;
  },

  // call by the engine when colliding with another object
  // obj parameter corresponds to the other object (typically the player) touching this one
  onCollision: function (res, obj) {
    // res.y >0 means touched by something on the bottom
    // which mean at top position for this one
    if (this.alive && (res.y > 0) && obj.falling) {
      this.flicker(45);
    }
  },

  // manage the enemy movement
  update: function () {
    // do nothing if not visible
    if (!this.visible) {
      return false;
    }

    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
      } else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      }
      // make it walk
      this.flipX(this.walkLeft);
      this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

    } else {
      this.vel.x = 0;
    }

    // check and update movement
    this.updateMovement();

    // update animation if necessary
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      // update objet animation
      this.parent(this);
      return true;
    }
    return false;
  }
});

var StalagmiteEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    settings.image = "stalagmite";
    settings.spritewidth = 16;

    this.parent(x, y, settings);
    this.collidable = true;
    this.type = me.game.ENEMY_OBJECT;
  },

  onCollision: function (res, obj) {
    if (this.alive && (res.y > 0) && typeof obj.death() === 'function') {
      obj.death();
    }
  },

  update: function () {
    return false;
  }
});

var BirdEntity = me.ObjectEntity.extend({

  init: function (x, y, settings) {
    settings.image = "bird";
    settings.spritewidth = 32;
    this.type = me.game.ENEMY_OBJECT;

    if (settings.walk === 'left') {
      this.walkLeft = true;
    } else {
      this.walkLeft = false;
    }

    // call the parent constructor
    this.parent(x, y, settings);

    this.startX = x;
    this.endX   = x + settings.width - settings.spritewidth;
    this.pos.x  = x + settings.width - settings.spritewidth;

    this.setVelocity(2, 6);

    this.collidable = true;
    this.type = me.game.ENEMY_OBJECT;
  },

  // manage the enemy movement
  update: function () {
    // do nothing if not visible
    if (!this.visible) {
      return false;
    }

    if (this.alive) {
      // make it walk
      this.flipX(this.walkLeft);
      this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
    } else {
      this.vel.x = 0;
    }

    // check and update movement
    this.gravity = 0.001;
    this.updateMovement();

    // update animation if necessary
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      // update objet animation
      this.parent(this);
      return true;
    }
    return false;
  }
});

var SpringboardEntity = me.ObjectEntity.extend({
  player:      null,
  jumpTimer:   null,
  jumpGravity: 0.58,

  init: function (x, y, settings) {
    // call the parent constructor
    this.parent(x, y, settings);
    this.collidable = true;
    this.type = me.game.ACTION_OBJECT;
    this.player = me.game.getEntityByName('mainPlayer')[0];
  },

  onCollision: function (res, obj) {
    var self = this;

    if (this.alive && (res.y > 0)) {
      this.player.gravity = this.jumpGravity;
      this.player.forceJump();

      // Reset gravity when jump is over
      this.jumpTimer = setInterval(function () {
        if (self.player.jumping === false) {
          self.player.gravity = self.player.defaultGrav;
          clearInterval(self.jumpTimer);
        }
      }, 200);
    }
  }

});