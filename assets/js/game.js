/**
 * 1. Allow shooting to create bullet objects.
 * 2. Track bullet objects in memory.
 * 3. When bullet objects leave the stage, clean them up.
 * 4. Add 2nd level of background layer (parallax).
 */

var game = {
    __bodies: [],

    init: function () {},
    
    play: function ( _continue ) {
        if ( typeof _continue === 'undefined' ) _continue = true;

        game.update();
        game.render();

        if ( _continue ) window.requestAnimationFrame( game.play );
    },

    update: function() {
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

        this.__bodies.push( _body );
    },

    removeBody: function ( _body ) {
        var self = this;

        this.__bodies.forEach( function ( _v, _k ) {
            if ( _v === _body ) {
                self.__bodies.splice( _k, 1 );
            }
        } );
    }
};

keyboard.init();

game.init();
game.addBody( ui );
game.addBody( map );
game.addBody( player );
// game.play();