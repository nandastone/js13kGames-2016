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

        this.hp = _options.type.hp;
        this.frame = 0;
        this.isDead = false;
        this.deathFrames = 0;
        this.hasShot = false;
        this.shootFrame = _options.type.shootFrame;
    }
    static get TYPES() {
        return {
            BASIC: {
                width: 20,
                height: 20,
                speed: { x: 0, y: 3 },
                hp: 100,
                shootFrame: 40,
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
            this.pos.x = this.pos.x + this.speed.x;
            this.pos.y = this.pos.y + this.speed.y;

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

            if ( !this.hasShot && this.frame > this.shootFrame ) {
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

        this.hasShot = true;
    }
}
