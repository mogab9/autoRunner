/*
 * app.js
 *
 * Main file for the game.
 *
 * @author mogab9
 */

var jsApp =
{
    onload: function()
    {
        if (!me.video.init('jsapp', 640, 480, false, 1.0))
        {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }

        me.audio.init( "mp3,ogg" );

        me.loader.onload = this.loaded.bind( this );
        me.loader.preload( gameResources );

        me.state.change( me.state.LOADING );
    },

    loaded: function()
    {
       me.state.set(me.state.MENU, new TitleScreen());
       me.state.set(me.state.PLAY, new PlayScreen());

       // set a global fading transition for the screen
       me.state.transition("fade", "#FFFFFF", 250);
         
       // add our entities in the entity pool
       me.entityPool.add("mainPlayer", PlayerEntity);
       me.entityPool.add("CoinEntity", CoinEntity);
       me.entityPool.add("EnemyEntity", EnemyEntity);
       
       // enable the keyboard
       me.input.bindKey(me.input.KEY.X, "jump", true);
          
       // start the game
       me.state.change(me.state.MENU);
    }
};

/* in game stuff */
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
    {   
      // stuff to reset on state change
      // load a level
      me.levelDirector.loadLevel("area01");

      me.game.addHUD(0, 430, 640, 60);

      me.game.HUD.addItem("score", new ScoreObject(620, 10));

      me.game.sort();
    },
    
    /* ---
    
         action to perform when game is finished (state change)
        
        --- */
    onDestroyEvent: function()
    {
      me.game.disableHUD();
    }

});

 
var TitleScreen = me.ScreenObject.extend(
{
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
 
        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;
 
        this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
        this.scrollerpos = 600;

    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");
 
            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");
 
        }
 
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
 
        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});

window.onReady( function()
{
    jsApp.onload();
});