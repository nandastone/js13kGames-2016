import { boxCollide } from '../utils';
import game from './game';
import canvas from './canvas';
import map from './map';
import Bullet from './Bullet';

export default class Enemy {
    constructor( _options = {} ) {
        this.entity = game.ENTITIES.ENEMY;
        this.isActive = true;

        this.z = 100;
        this.pos = _options.pos;
        this.width = _options.type.width;
        this.height = _options.type.height;
        this.speed = _options.type.speed;
        this.pattern = _options.pattern;

        this.type = _options.type;
        this.hp = _options.type.hp;
        this.frame = 0;
        this.isDead = false;
        this.deathFrames = 0;
        this.shootFrames = _options.type.shootFrames;
    }
    static get TYPES() {
        return {
            BASIC: {
                // @todo Need better way of enemy being able to reference its own type.
                name: 'basic',
                width: 20,
                height: 20,
                hp: 100,
                speed: { x: 1.5, y: 1.5 },
                shootFrames: [ 20, 100, 180 ]
            },

            DOUBLE: {
                name: 'double',
                width: 50,
                height: 20,
                hp: 100,
                speed: { x: 1.5, y: 1.5 },
                shootFrames: [ 40, 80, 180, 220 ]
            }
        };
    }
    // @todo Allow moving along path.
    static get PATTERNS() {
        return {
            // speeds are multipliers of enemy speed
            STRAIGHT_DOWN: {
                0: { x: 0, y: 1 },
            },
            DRIFT_RIGHT: {
                0: { x: 0, y: 1 },
                50: { x: 1, y: 1 },
                100: { x: 0, y: 1 },
            },
            DRIFT_LEFT: {
                0: { x: 0, y: 1 },
                50: { x: -1, y: 1 },
                100: { x: 0, y: 1 },
            },
            DRIFT_RIGHT_THEN_BACK: {
                0: { x: 0, y: 1 },
                50: { x: 1, y: 1 },
                100: { x: 0, y: 1 },
                190: { x: -1, y: 1 },
                240: { x: 0, y: 1 },
            },
        };
    }
    update() {
        if ( !this.isActive ) return;

        this.frame += 1;

        if ( this.isDead ) {
            if ( this.deathFrames >= 6 ) {
                game.removeBody( this );
            } else {
                this.deathFrames += 1;
            }
        } else {
            const patternSpeed = this.getPatternStage();

            this.pos.x += ( this.speed.x * patternSpeed.x );
            this.pos.y += ( this.speed.y * patternSpeed.y );

            // if enemy leaves stage bottom, destroy it
            if ( this.pos.y > map.height ) {
                game.removeBody( this );
            }

            // loop enemies and check if any collide
            game.getBodies( game.ENTITIES.BULLET ).forEach( ( _bullet ) => {
                // @todo Before define active/dead state. We want:
                // 1. Do not update, render, collide, etc.
                // 2. Update and render, do not collide.
                // 3. Update and render, do not move or collide.

                if ( !_bullet.isActive ||
                    _bullet.isDead ||
                    _bullet.collidesWith !== game.ENTITIES.ENEMY ) return;

                if ( boxCollide( this, _bullet ) ) {
                    // damage enemy by bullet amount
                    this.hurt( _bullet.damage );

                    // destroy the bullet
                    _bullet.kill();
                }
            } );

            // loop player and check if any collide
            game.getBodies( game.ENTITIES.PLAYER ).forEach( ( _player ) => {
                if ( !_player.isActive || _player.isDead ) return;

                if ( boxCollide( this, _player ) ) {
                    // damage enemy by collide amount
                    this.hurt( _player.damage );

                    // damage the player by collide amount
                    _player.hurt( _player.damage );
                }
            } );

            if ( this.shootFrames.indexOf( this.frame ) !== -1 ) {
                this.shoot();
            }
        }
    }
    render() {
        if ( !this.isActive ) return;

        canvas.ctx.save();

        if ( this.isDead && this.deathFrames ) {
            switch ( this.deathFrames ) {
            case 1:
            case 2:
                canvas.ctx.globalAlpha = 0.8;
                break;
            case 3:
            case 4:
                canvas.ctx.globalAlpha = 0.5;
                break;
            case 5:
            case 6:
            default:
                canvas.ctx.globalAlpha = 0.2;
            }
        }

        canvas.ctx.fillStyle = 'red';
        canvas.ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
        canvas.ctx.restore();
    }
    hurt( _damage ) {
        this.hp -= _damage;

        if ( this.hp <= 0 ) {
            this.isDead = true;
        }
    }
    shoot() {
        // @todo Compare like `this.type === Enemy.TYPES.BASIC`
        if ( this.type.name === 'basic' ) {
            const b = new Bullet( {
                pos: {
                    x: this.pos.x + ( this.width / 2 ),
                    y: this.pos.y + this.height,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
                collidesWith: game.ENTITIES.PLAYER,
                damage: 100,
            } );

            game.addBody( b );
        } else if ( this.type.name === 'double' ) {
            const b1 = new Bullet( {
                pos: {
                    x: this.pos.x + ( this.width / 2 ) - 15,
                    y: this.pos.y + 20,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
                collidesWith: game.ENTITIES.PLAYER,
                damage: 100
            } );

            const b2 = new Bullet( {
                pos: {
                    x: this.pos.x + ( this.width / 2 ) + 15,
                    y: this.pos.y + 20,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
                collidesWith: game.ENTITIES.PLAYER,
                damage: 100
            } );

            game.addBody( b1 );
            game.addBody( b2 );
        }
    }
    getPatternStage() {
        const stages = Object.keys( this.pattern ).reverse();
        let speed = { x: 0, y: 0 };

        // @todo Improve readability of this loop.
        for ( let i = 0, l = stages.length; i < l; i++ ) {
            if ( this.frame >= stages[ i ] ) {
                speed = this.pattern[ stages[ i ] ];
                break;
            }
        }

        return speed;
    }
}
