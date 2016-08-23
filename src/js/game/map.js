import { clamp } from '../utils';
import canvas from './canvas';
import game from './game';
import enemy from './enemy';

const map = {
    NUM_ENEMIES: 20,
    ENEMY_FREQUENCY: 100,

    stars: [],
    enemies: [],
    frame: 0,

    init() {
        this.width = canvas.width;
        this.height = canvas.height;

        this.initStars();
        this.initEnemies();
    },

    update() {
        const self = this;

        this.frame += 1;

        this.stars.forEach( ( _star ) => {
            _star.pos.y += _star.speed;
            if ( _star.pos.y > _star.canvas.height ) _star.pos.y = 0;
        } );

        this.enemies.forEach( ( _enemy ) => {
            if ( !_enemy.active && _enemy.activeAt <= self.frame ) {
                _enemy.active = true;
                game.addBody( _enemy );
            }
        } );
    },

    render() {
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect( 0, 0, this.width, this.height );

        this.renderStars();
    },

    initEnemies() {
        for ( let i = 0; i < this.NUM_ENEMIES; i++ ) {
            const type = enemy.BASIC;
            const e = enemy.create(
                type,
                {
                    x: clamp(
                        Math.random() * this.width,
                        0,
                        this.width - type.width
                    ),
                    y: -type.height,
                }
            );

            e.active = false;
            e.activeAt = i * this.ENEMY_FREQUENCY;

            this.enemies.push( e );
        }
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
};

export default map;
