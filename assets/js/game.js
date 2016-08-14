var game = {
    __els: {},
    __bodies: [],

    init: function () {
        var self = this;

        this.__els.tick = document.getElementById( 'tick' );
        this.__els.play = document.getElementById( 'play' );

        this.__els.tick.addEventListener( 'click', function ( _event ) {
            self.play( false );
        } );

        this.__els.play.addEventListener( 'click', function ( _event ) {
            self.play( true );
        } );
    },
    
    play: function ( _continue ) {
        if ( typeof _continue === 'undefined' ) _continue = true;

        game.update();
        game.render();

        if ( _continue ) window.requestAnimationFrame( game.play );
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

keyboard.init();

game.init();
game.addBody( map );
game.addBody( player );
// game.play();