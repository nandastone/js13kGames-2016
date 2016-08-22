glitch.map = {
    __stars: [],
    __enemies: [],
    __frame: 0,

    init: function () {
        this.width = glitch.canvas.width;
        this.height = glitch.canvas.height;

        this.__initStars();
        this.__initEnemies();
    },

    update: function () {
        var self = this;

        this.__frame += 1;

        this.__stars.forEach( function ( _v, _k ) {
            _v.pos.y = _v.pos.y + _v.speed;
            if ( _v.pos.y > _v.canvas.height ) _v.pos.y = 0;
        } );

        this.__enemies.forEach( function ( _v, _k ) {
            if ( !_v.active && _v.activeAt <=  self.__frame ) {
                _v.active = true;
                glitch.game.addBody( _v );
            }
        } );
    },

    render: function () {
        glitch.canvas.ctx.fillStyle = 'black';
        glitch.canvas.ctx.fillRect( 0, 0, this.width, this.height );

        this.__renderStars();
    },

    __initEnemies: function () {
        for ( var i = 0; i < 5; i++ ) {
            var enemy = glitch.enemy.create( 
                glitch.enemy.BASIC, 
                { 
                    x: Math.random() * this.width, 
                    y: -20 
                } 
            );
            
            enemy.active = false;
            enemy.activeAt = i * 100;

            this.__enemies.push( enemy );
        }
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
            speed: 0.3,
            canvas: this.__createStarsCanvas( 10, 2.5 )
        } );
    },

    __createStarsCanvas: function ( _number, _size ) {
        var newCanvas = document.createElement( 'canvas' );
        var newCtx = newCanvas.getContext( '2d' );

        newCanvas.width = this.width;
        newCanvas.height = this.height;

        // @todo How to ensure a good dispersion of stars?
        for ( var i = 0; i < _number; i++ ) {
            var x = Math.random() * newCanvas.width;
            var y = Math.random() * newCanvas.height;

            newCtx.save();
            newCtx.translate( x, y );
            newCtx.scale( _size, _size );
            newCtx.globalAlpha = glitch.utils.clamp( Math.random(), 0.5, 1 );

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
            glitch.canvas.ctx.drawImage( 
                _v.canvas, 
                0, 
                _v.pos.y, 
                _v.canvas.width, 
                _v.canvas.height 
            );

            glitch.canvas.ctx.drawImage( 
                _v.canvas, 
                0, 
                _v.pos.y  - _v.canvas.height, 
                _v.canvas.width, 
                _v.canvas.height 
            );
        } );
    }
};