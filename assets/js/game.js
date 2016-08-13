var game = {
    __bodies: [],
    
    play: function() {
        game.update();
        game.render();

        window.requestAnimationFrame( game.play );
    },

    update: function() {
        this.__bodies.forEach( function ( _v, _k ) {
            _v.update();
        } );
    },

    render: function() {
        canvas.ctx.clearRect( 0, 0, canvas.w, canvas.h );

        this.__bodies.forEach( function ( _v, _k ) {
            _v.render();
        } );
    },

    addBody: function ( _body ) {
        if ( _body.hasOwnProperty( 'init' ) ) {
            _body.init();
        }

        this.__bodies.push( _body );
    }
};

game.addBody( map );
game.addBody( player );
game.play();