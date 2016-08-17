var map = {
    __stars: [],

    init: function () {
        var self = this;

        this.width = this.w = canvas.width;
        this.height = this.h = canvas.height;

        this.__initStars();
    },

    update: function () {
        this.__stars.forEach( function ( _v, _k ) {
            _v.pos.y = _v.pos.y + _v.speed;
            if ( _v.pos.y > _v.canvas.height ) _v.pos.y = 0;
        } );
    },

    render: function () {
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect( 0, 0, canvas.width, canvas.height );

        this.__renderStars();
    },

    __initStars: function () {
        this.__stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0,
            canvas: this.__createStarsCanvas( 40, 1 )
        } );

        this.__stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0.1,
            canvas: this.__createStarsCanvas( 30, 2 )
        } );

        this.__stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0.2,
            canvas: this.__createStarsCanvas( 10, 2.5 )
        } );
    },

    __createStarsCanvas: function ( _number, _size ) {
        var newCanvas = document.createElement( 'canvas' );
        var newCtx = newCanvas.getContext( '2d' );

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        // @todo How to ensure a good dispersion of stars?
        for ( var i = 0; i < _number; i++ ) {
            var x = Math.random() * newCanvas.width;
            var y = Math.random() * newCanvas.height;

            newCtx.save();
            newCtx.translate( x, y );
            newCtx.scale( _size, _size );
            newCtx.globalAlpha = utils.clamp( Math.random(), 0.5, 1 );

            // draw star shape
            newCtx.fillStyle = '#0046b8';
            newCtx.fillRect( 1, 0, 1, 1 );
            newCtx.fillRect( 0, 1, 1, 1 );
            newCtx.fillRect( 2, 1, 1, 1 );
            newCtx.fillRect( 1, 2, 1, 1 );
            newCtx.fillStyle = '#529afd';
            newCtx.fillRect( 1, 1, 1, 1 );

            newCtx.restore();
        }

        return newCanvas;
    },

    __renderStars: function () {
        this.__stars.forEach( function ( _v, _k ) { 
            canvas.ctx.drawImage( 
                _v.canvas, 
                0, 
                _v.pos.y, 
                _v.canvas.width, 
                _v.canvas.height 
            );

            canvas.ctx.drawImage( 
                _v.canvas, 
                0, 
                _v.pos.y  - _v.canvas.height, 
                _v.canvas.width, 
                _v.canvas.height 
            );
        } );
    }
};