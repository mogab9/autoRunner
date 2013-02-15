/*
 * app.js
 *
 * Main file for autoRunner game.
 *
 * @author mogab9
*/

/*global me, alert, window, gameResources, TitleScreen, PlayScreen, ScoreObject, PlayerEntity, CoinEntity, EnemyEntity, SpringboardEntity, StalagmiteEntity, BirdEntity, forcefieldEntity, ScrollingBackgroundLayer*/

var jsApp = {
    width:       640,
    height:      480,
    score:       0,
    debug:       false,
    scrollspeed: 2,

    onload: function () {
      if (!me.video.init('jsapp', this.width, this.height, false, 1.0)) {
        alert("Sorry but your browser does not support html 5 canvas.");
        return;
      }

      me.audio.init("mp3,ogg");
      me.loader.onload = this.loaded.bind(this);
      me.loader.preload(gameResources);

      me.state.change(me.state.LOADING);
    },

    loaded: function () {
      me.state.set(me.state.MENU, new TitleScreen());
      me.state.set(me.state.PLAY, new PlayScreen());

      // set a global fading transition for the screen
      me.state.transition("fade", "#FFFFFF", 250);

      // add our entities in the entity pool
      me.entityPool.add("mainPlayer",  PlayerEntity);
      me.entityPool.add("forceField",  forcefieldEntity);
      me.entityPool.add("CoinEntity",  CoinEntity);
      me.entityPool.add("EnemyEntity", EnemyEntity);
      me.entityPool.add("springBoard", SpringboardEntity);
      me.entityPool.add("stalagmite",  StalagmiteEntity);
      me.entityPool.add("bird",        BirdEntity);

      // enable the keyboard
      me.input.bindKey(me.input.KEY.X,     "jump", true);
      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");

      // start the game
      me.state.change(me.state.MENU);
    }
  };

/* in game stuff */
var PlayScreen = me.ScreenObject.extend({

  autoScrollTimer : null,

  beginAutoscroll: function () {
    var cpt = 0;
    this.autoScrollTimer = setInterval(function () {
      me.game.viewport.move(cpt + jsApp.scrollspeed, me.game.viewport.pos.y);
    }, 10);
  },

  onResetEvent: function () {
    jsApp.score = 0;
    me.levelDirector.loadLevel("area00");
    me.game.add(new ScrollingBackgroundLayer("area00_bkg0", 0), -2);
    me.game.add(new ScrollingBackgroundLayer("area00_bkg1", 1), -1);

    me.game.addHUD(0, 430, 640, 60);
    me.game.HUD.addItem("score", new ScoreObject(620, 10));
    this.beginAutoscroll();
    me.game.sort();
  },

  onDestroyEvent: function () {
    me.game.disableHUD();
    clearInterval(this.autoScrollTimer);
  }
});

var TitleScreen = me.ScreenObject.extend({
    init: function () {
      this.parent(true);
    },

    onResetEvent: function () {
      if (this.title === undefined) {
        // init stuff if not yet done
        this.title = me.loader.getImage("title_screen");
        // font to display the menu items
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("left");
      }

      // enable the keyboard
      me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    },

    update: function () {
      // enter pressed ?
      if (me.input.isKeyPressed('enter')) {
        me.state.change(me.state.PLAY);
      }
      return true;
    },

    draw: function (context) {
      context.drawImage(this.title, 0, 0);

      this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);

      if (jsApp.score > 0) {
        this.font.draw(context, "LAST SCORE:", 155, 300);
        this.font.draw(context, jsApp.score, 260, 345);
      }
    },

    onDestroyEvent: function () {
      me.input.unbindKey(me.input.KEY.ENTER);
    }
  });

window.onReady(function () {
  jsApp.onload();
});