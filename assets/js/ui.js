var ui = {
    __els: {},
    __playing: false,

    init: function () {
        var self = this;

        this.__els.tick = document.getElementById( 'tick' );
        this.__els.play = document.getElementById( 'play' );
        this.__els.stage = document.getElementById( 'stage' );

        this.__els.tick.addEventListener( 'click', function ( _event ) {
            game.play( false );
        } );

        this.__els.play.addEventListener( 'click', function ( _event ) {
            if ( self.__playing ) return;

            game.play( true );
            self.__playing = true;
        } );

        this.__els.stage.addEventListener( 'click', function ( _event ) {
            if ( self.__playing ) return;
            
            game.play( true );
            self.__playing = true;
        } );
    }
};