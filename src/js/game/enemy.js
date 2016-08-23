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
        this.pattern = _options.pattern;

        this.hp = _options.type.hp;
        this.frame = 0;
        this.isDead = false;
        this.deathFrames = 0;
        this.shootFrames = _options.type.shootFrames;
    }
    static get TYPES() {
        return {
            BASIC: {
                width: 20,
                height: 20,
                hp: 100,
                shootFrames: [ 20, 120 ]
            },
        };
    }
    // @todo Allow moving along path.
    static get PATTERNS() {
        return {
            STRAIGHT_DOWN: {
                0: { x: 0, y: 2 },
            },
            DRIFT_RIGHT: {
                0: { x: 0, y: 2 },
                50: { x: 1.5, y: 2 },
                100: { x: 0, y: 2 },
            },
            DRIFT_LEFT: {
                0: { x: 0, y: 2 },
                50: { x: -1.5, y: 2 },
                100: { x: 0, y: 2 },
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
            const speed = this.getPatternStage();

            this.pos.x += speed.x;
            this.pos.y += speed.y;

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
