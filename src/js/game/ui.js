import game from './game';

export default {
    els: {},
    playing: false,

    init() {
        const self = this;

        this.els.tick = document.getElementById( 'tick' );
        this.els.play = document.getElementById( 'play' );
        this.els.stage = document.getElementById( 'stage' );
        this.els.fps = document.getElementById( 'fps' );
        this.els.ms = document.getElementById( 'ms' );

        this.els.tick.addEventListener( 'click', () => {
            game.play( false );
        } );

        this.els.play.addEventListener( 'click', () => {
            if ( self.playing ) return;

            game.play( true );
            self.playing = true;
        } );

        this.els.stage.addEventListener( 'click', () => {
            if ( self.playing ) return;

            game.play( true );
            self.playing = true;
        } );
    },

    updateMs( _ms ) {
        this.els.ms.innerText = _ms.toFixed( 2 );
    },

    updateFps( _fps ) {
        this.els.fps.innerText = _fps.toFixed( 2 );
    },
};
