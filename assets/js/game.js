/* global glitch */

/**
 * 1. Detect enemy collision with player.
 * 2. Damage enemy and player on collide.
 * 3. Player death detection + explosion animation.
 * 4. How to schedule level of enemies in particular pattern?
 * 5. Improve death animation code to not be so heavily tied into update/render.
 */

glitch.game = {
    ENTITIES: {
        PLAYER: 1,
        BULLET: 2,
        ENEMY: 3
    },
    MS_PER_FRAME: ( 1000 / 60 ),

    __bodies: [],

    init: function () {},
    
    play: function ( _continue ) {
        var self = this,
            timeStart, timeEnd;

        timeStart = performance.now();

        this.update();
        this.render();

        timeEnd = performance.now();

        glitch.ui.updateMs( timeEnd - timeStart );
        glitch.ui.updateFps( this.__calculateFps( timeEnd - timeStart ) );

        if ( _continue || typeof _continue === 'undefined' ) {
            window.setTimeout( function() {
                window.requestAnimationFrame( function () { self.play.call( self ); } );
            }, this.MS_PER_FRAME - ( timeEnd - timeStart ) );
        }
    },

    update: function() {
        this.__sortBodies();

        this.__bodies.forEach( function ( _v ) {
            if ( typeof _v.update !== 'undefined' ) {
                _v.update();
            }
        } );
    },

    render: function() {
        glitch.canvas.ctx.clearRect( 0, 0, glitch.canvas.width, glitch.canvas.height );

        this.__bodies.forEach( function ( _v ) {
            if ( typeof _v.render !== 'undefined' ) {
                _v.render();
            }
        } );
    },

    addBody: function ( _body ) {
        if ( typeof _body.init !== 'undefined' ) {
            _body.init();
        }

        if ( !_body.z ) _body.z = 0;

        this.__bodies.push( _body );
    },

    removeBody: function ( _body ) {
        var self = this;

        this.__bodies.forEach( function ( _v, _k ) {
            if ( _v === _body ) {
                self.__bodies.splice( _k, 1 );
            }
        } );
    },

    getBodies: function ( _type ) {
        return this.__bodies.filter( function ( _body ) {
            return _body.type === _type;
        } );
    },

    __calculateFps: function ( _delta ) {
        return 1000 / glitch.utils.clamp( _delta, this.MS_PER_FRAME, 1000 );
    },

    __sortBodies: function () {
        this.__bodies.sort( function ( _a, _b ) { 
            return _a.z - _b.z;
        } );
    }
};

glitch.keyboard.init();

glitch.game.init();
glitch.game.addBody( glitch.ui );
glitch.game.addBody( glitch.map );
glitch.game.addBody( glitch.player );
// glitch.game.play();