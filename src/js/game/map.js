import { clamp } from '../utils';
import canvas from './canvas';
import game from './game';
import Enemy from './Enemy';
import Level from './Level';

export default {
    stars: [],

    init() {
        this.width = canvas.width;
        this.height = canvas.height;

        this.initStars();
        this.initLevel( Level.LEVELS.ONE );
    },

    update() {
        this.stars.forEach( ( _star ) => {
            _star.pos.y += _star.speed;
            if ( _star.pos.y > _star.canvas.height ) _star.pos.y = 0;
        } );
    },

    render() {
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect( 0, 0, this.width, this.height );

        this.renderStars();
    },

    initStars() {
        this.stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0,
            canvas: this.createStarfieldCanvas( 40, 1 ),
        } );

        this.stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0.1,
            canvas: this.createStarfieldCanvas( 30, 2 ),
        } );

        this.stars.push( {
            pos: { x: 0, y: 0 },
            speed: 0.3,
            canvas: this.createStarfieldCanvas( 10, 2.5 ),
        } );
    },

    createStarfieldCanvas( _number, _size ) {
        const newCanvas = document.createElement( 'canvas' );
        const newCtx = newCanvas.getContext( '2d' );

        newCanvas.width = this.width;
        newCanvas.height = this.height;

        // @todo How to ensure a good dispersion of stars?
        for ( let i = 0; i < _number; i++ ) {
            const x = Math.random() * newCanvas.width;
            const y = Math.random() * newCanvas.height;

            newCtx.save();
            newCtx.translate( x, y );
            newCtx.scale( _size, _size );
            // @todo Instead of alpha, tweak colors of stars brighter/cooler.
            newCtx.globalAlpha = clamp( Math.random(), 0.5, 1 );

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

    renderStars() {
        this.stars.forEach( ( _starfield ) => {
            canvas.ctx.drawImage(
                _starfield.canvas,
                0,
                _starfield.pos.y,
                _starfield.canvas.width,
                _starfield.canvas.height
            );

            canvas.ctx.drawImage(
                _starfield.canvas,
                0,
                _starfield.pos.y - _starfield.canvas.height,
                _starfield.canvas.width,
                _starfield.canvas.height
            );
        } );
    },

    initLevel( _level ) {
        var l = new Level( { level: _level } );
        // this.currentLevel
        game.addBody( l );
    }
};
