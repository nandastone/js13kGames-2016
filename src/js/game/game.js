import { clamp } from '../utils';
import canvas from './canvas';
import ui from './ui';

/**
 * 1. How to schedule level of enemies in particular pattern?
 * 2. Improve death animation code to not be so heavily tied into update/render.
 * 3. Improve collision check code as above? Component?
 */

export default {
    ENTITIES: {
        PLAYER: 1,
        BULLET: 2,
        ENEMY: 3,
    },
    MS_PER_FRAME: ( 1000 / 60 ),

    bodies: [],

    init() {},

    play( _continue ) {
        const timeStart = performance.now();

        this.update();
        this.render();

        const timeEnd = performance.now();

        ui.updateMs( timeEnd - timeStart );
        ui.updateFps( this.calculateFps( timeEnd - timeStart ) );

        if ( _continue || typeof _continue === 'undefined' ) {
            window.setTimeout( () => {
                window.requestAnimationFrame( () => { this.play.call( this ); } );
            }, this.MS_PER_FRAME - ( timeEnd - timeStart ) );
        }
    },

    update() {
        this.sortBodies();

        this.bodies.forEach( ( _body ) => {
            if ( typeof _body.update !== 'undefined' ) {
                _body.update();
            }
        } );
    },

    render() {
        canvas.ctx.clearRect( 0, 0, canvas.width, canvas.height );

        this.bodies.forEach( ( _body ) => {
            if ( typeof _body.render !== 'undefined' ) {
                _body.render();
            }
        } );
    },

    addBody( _body ) {
        const body = _body;

        if ( typeof body.init !== 'undefined' ) {
            body.init();
        }

        if ( !body.z ) body.z = 0;

        this.bodies.push( body );
    },

    removeBody( _body ) {
        this.bodies.forEach( ( _v, _k ) => {
            if ( _v === _body ) {
                this.bodies.splice( _k, 1 );
            }
        } );
    },

    getBodies( _entity ) {
        return this.bodies.filter( ( _body ) => _body.entity === _entity );
    },

    calculateFps( _delta ) {
        return 1000 / clamp( _delta, this.MS_PER_FRAME, 1000 );
    },

    sortBodies() {
        this.bodies.sort( ( _a, _b ) => _a.z - _b.z );
    },
};
