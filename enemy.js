var Enemy = me.ObjectEntity.extend({
	init: function( x, y, settings ){
		this.parent( x, y, settings );

		// Pick the starting direction
		this.changeDirection( settings.direction || 0 );

		// Starting velocity is arbitrary.
		this.setVelocity( 1, 0 );
		this.setMaxVelocity( 1, 8 );

		// Gravity is arbitrary.
		this.gravity = 0.6;

		//this.updateColRect( 8, 32, -1 );

		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;

		this.addAnimation( "idle", [0] );
		this.addAnimation( "die", [3] );
		this.addAnimation( "run", [1, 0, 2, 0] );

		this.setCurrentAnimation( "run" );

        this.updateColRect( 0, 96, 20, 67 );
	}
});