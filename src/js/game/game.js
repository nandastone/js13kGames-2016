import { clamp } from '../utils';
import canvas from './canvas';
import ui from './ui';

/**
 * Game starts on space station. Glitch storm hits station. Escape craft is launched into the aftermath and weird
 * glitch creatures attack. Fighting off waves of attackers until the boss is reached. Once boss is defeated the craft
 * approaches a bright glitchy light and merges. The whiteness fades to reveal you were asleep on the space station all
 * along.
 *
 * Gameplay consists of standard SHMUP gameplay with increasingly complex waves of enemies. New and more powerful
 * enemies are introduced at points. Goal of 5 unique enemies. Certain enemies drop new weapons which help combat
 * increasing difficulty. At end of game there is a boss which requires a unique pattern to defeat. Glitch is
 * introduced by:
 *
 * 1. Glitch storm to start game.
 * 2. Triggered points where smaller glitch storm flies across background, and will add extra challenge:
 *      - speed up the pace of the game
 *      - make enemy bullets almost invisible
 *      - your weapon glitches and does not work
 * 3. Weapon has a chance to glitch enemies on death into random objects.
 * 4. Enemies have a strange and glitchy appearance.
 * 5. Boss requires a glitchy non-obvious mechanic to defeat.
 *
 * Enemies:
 *
 * 1. Shoots 2 bullets straight ahead and moves in predictable pattern.
 * 2. Shoots two sets of two bullets as it moves sideways.
 * 3. Shoots two bullets forward as it moves fast and diagonal across the screen.
 * 4. Shoots bullets towards the players location as it moves side to side down the screen.
 * 5. Strong ship that shoots two lasers in regular cycles.
 *
 * @todo:
 * 1. Improve death animation code to not be so heavily tied into update/render.
 * 2. Improve collision check code as above? Component?
 * 3. Create new enemy types and movement patterns.
 * 4. Create new weapons.
 * 5. Create power ups to equip new weapons.
 * 6. Create enemy that drops power up.
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
