/**
 * 1. 
 */

var game = {
    MS_PER_FRAME: ( 1000 / 60 ),

    __bodies: [],

    init: function () {},
    
    play: function ( _continue ) {
        var self = this,
            timeStart, timeEnd;

        timeStart = performance.now();

        game.update();
        game.render();

        timeEnd = performance.now();

        ui.updateMs( timeEnd - timeStart );
        ui.updateFps( this.__calculateFps( timeEnd - timeStart ) );

        if ( _continue || typeof _continue === 'undefined' ) {
            window.setTimeout( function() {
                window.requestAnimationFrame( function() { game.play.call( self ); } );
            }, game.MS_PER_FRAME - ( timeEnd - timeStart ) );
        }
    },

    update: function() {
        this.__sortBodies();
        this.__bodies.forEach( function ( _v, _k ) {
            if ( typeof _v.update !== 'undefined' ) {
                _v.update();
            }
        } );
    },

    render: function() {
        canvas.ctx.clearRect( 0, 0, canvas.w, canvas.h );

        this.__bodies.forEach( function ( _v, _k ) {
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

    __calculateFps: function ( _delta ) {
        return 1000 / utils.clamp( _delta, game.MS_PER_FRAME, 1000 );
    },

    __sortBodies: function () {
        this.__bodies.sort( function ( _a, _b ) { 
            return _a.z - _b.z;
        } );
    }
};

keyboard.init();

game.init();
game.addBody( ui );
game.addBody( map );
game.addBody( player );
// game.play();