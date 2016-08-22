/* global glitch */

glitch.map = {
    NUM_ENEMIES: 20,
    ENEMY_FREQUENCY: 100,

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

        this.__stars.forEach( function ( _star ) {
            _star.pos.y = _star.pos.y + _star.speed;
            if ( _star.pos.y > _star.canvas.height ) _star.pos.y = 0;
        } );

        this.__enemies.forEach( function ( _enemy ) {
            if ( !_enemy.active && _enemy.activeAt <=  self.__frame ) {
                _enemy.active = true;
                glitch.game.addBody( _enemy );
            }
        } );
    },

    render: function () {
        glitch.canvas.ctx.fillStyle = 'black';
        glitch.canvas.ctx.fillRect( 0, 0, this.width, this.height );

        this.__renderStars();
    },

    __initEnemies: function () {
        for ( var i = 0; i < this.NUM_ENEMIES; i++ ) {
            var type = glitch.enemy.BASIC;
            var enemy = glitch.enemy.create( 
                type, 
                { 
                    x: glitch.utils.clamp( 
                        Math.random() * this.width,
                        0,
                        this.width - type.width
                    ), 
                    y: -type.height
                } 
            );
            
            enemy.active = false;
            enemy.activeAt = i * this.ENEMY_FREQUENCY;

            this.__enemies.push( enemy );
        }
    },

    __initStars: function () {
        this.__stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0,
            canvas: this.__createStarfieldCanvas( 40, 1 )
        } );

        this.__stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0.1,
            canvas: this.__createStarfieldCanvas( 30, 2 )
        } );

        this.__stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0.3,
            canvas: this.__createStarfieldCanvas( 10, 2.5 )
        } );
    },

    __createStarfieldCanvas: function ( _number, _size ) {
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
            // @todo Instead of alpha, tweak colors of stars brighter/cooler.
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
        this.__stars.forEach( function ( _starfield ) { 
            glitch.canvas.ctx.drawImage( 
                _starfield.canvas, 
                0, 
                _starfield.pos.y, 
                _starfield.canvas.width, 
                _starfield.canvas.height 
            );

            glitch.canvas.ctx.drawImage( 
                _starfield.canvas, 
                0, 
                _starfield.pos.y  - _starfield.canvas.height, 
                _starfield.canvas.width, 
                _starfield.canvas.height 
            );
        } );
    }
};