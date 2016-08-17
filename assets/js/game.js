/**
 * 1. Add 2nd level of background layer (parallax).
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
            if ( _v.hasOwnProperty( 'update' ) ) {
                _v.update();
            }
        } );
    },

    render: function() {
        canvas.ctx.clearRect( 0, 0, canvas.w, canvas.h );

        this.__bodies.forEach( function ( _v, _k ) {
            if ( _v.hasOwnProperty( 'render' ) ) {
                _v.render();
            }
        } );
    },

    addBody: function ( _body ) {
        if ( _body.hasOwnProperty( 'init' ) ) {
            _body.init();
        }

        this.__bodies.push( _body );
    }
};

keyboard.init();

game.init();
game.addBody( ui );
game.addBody( map );
game.addBody( player );
// game.play();