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
       // set the "Play/Ingame" Screen Object
       me.state.set(me.state.PLAY, new PlayScreen());
         
       // add our entities in the entity pool
       me.entityPool.add("mainPlayer", PlayerEntity);
       me.entityPool.add("CoinEntity", CoinEntity);
       me.entityPool.add("EnemyEntity", EnemyEntity);
       
                 
       // enable the keyboard
       me.input.bindKey(me.input.KEY.LEFT,  "left");
       me.input.bindKey(me.input.KEY.RIGHT, "right");
       me.input.bindKey(me.input.KEY.X,     "jump", true);
          
       // start the game
       me.state.change(me.state.PLAY);
    }
};

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
    {   
      // stuff to reset on state change
      // load a level
      me.levelDirector.loadLevel("area01");
    },
    
    
    /* ---
    
         action to perform when game is finished (state change)
        
        --- */
    onDestroyEvent: function()
    {
    
    }

});

window.onReady( function()
{
    jsApp.onload();
});