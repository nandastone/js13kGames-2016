var ui = {
    __els: {},

    init: function () {
        var self = this;

        this.__els.tick = document.getElementById( 'tick' );
        this.__els.play = document.getElementById( 'play' );

        this.__els.tick.addEventListener( 'click', function ( _event ) {
            game.play( false );
        } );

        this.__els.play.addEventListener( 'click', function ( _event ) {
            game.play( true );
        } );
    }
};