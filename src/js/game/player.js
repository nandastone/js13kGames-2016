import { clamp, boxCollide } from '../utils';
import game from './game';
import keyboard from './keyboard';
import canvas from './canvas';
import map from './map';
import Bullet from './Bullet';

export default {
    init() {
        this.entity = game.ENTITIES.PLAYER;
        this.isActive = true;

        this.z = 500;
        this.sprite = {};
        this.width = this.w = 27;
        this.height = this.h = 37;
        this.pos = {
            x: ( canvas.width / 2 ) - ( this.w / 2 ),
            y: canvas.height - 100,
        };
        this.speed = { x: 4, y: 5 };
        this.velocity = { x: 0, y: 0 };

        this.shootDelay = 0;
        this.hp = 200;
        this.damage = 100;
        this.deathFrames = 6;

        this.initSprite();
    },

    update() {
        if ( !this.isActive ) return;

        this.shootDelay += 1;

        if ( this.isDead ) {
            if ( this.deathFrames >= 6 ) {
                // @todo Game over
                console.log( 'GAME OVER MAN!' );
                this.isActive = false;
            } else {
                this.deathFrames += 1;
            }
        } else {
            // detect player actions via keyboard input
            this.detectKeys();

            // update position of player based on input
            this.pos = {
                x: clamp(
                    this.pos.x + this.velocity.x,
                    0,
                    map.width - this.width
                ),
                y: clamp(
                    this.pos.y + this.velocity.y,
                    0,
                    map.height - this.height
                ),
            };

            // loop bullets and check if any collide
            game.getBodies( game.ENTITIES.BULLET ).forEach( ( _bullet ) => {
                if ( !_bullet.isActive ||
                    _bullet.isDead ||
                    _bullet.collidesWith !== game.ENTITIES.PLAYER ) return;

                if ( boxCollide( this, _bullet ) ) {
                    // damage enemy by bullet amount
                    this.hurt( _bullet.damage );

                    // destroy the bullet
                    _bullet.kill();
                }
            } );
        }
    },

    render() {
        let sprite = this.sprite.normal;

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
        } else if ( this.velocity.x < 0 ) {
            // @todo How to animate turning left over a number of ticks?
            sprite = this.sprite.left;
        } else if ( this.velocity.x > 0 ) {
            sprite = this.sprite.right;
        }

        canvas.ctx.drawImage( sprite, this.pos.x, this.pos.y, this.w, this.h );
        canvas.ctx.restore();
    },

    shoot() {
        const b1 = new Bullet( {
            pos: {
                x: this.pos.x + 2,
                y: this.pos.y + 20,
            },
            collidesWith: game.ENTITIES.ENEMY,
        } );

        const b2 = new Bullet( {
            pos: {
                x: this.pos.x + ( this.width - 2 ),
                y: this.pos.y + 20,
            },
            collidesWith: game.ENTITIES.ENEMY,
        } );

        game.addBody( b1 );
        game.addBody( b2 );
    },

    hurt( _damage ) {
        this.hp -= _damage;

        if ( this.hp <= 0 ) {
            this.isDead = true;
        }
    },

    // @todo Investigate sprite maps and animating them.
    initSprite() {
        const normal = new Image();
        const left = new Image();
        const left2 = new Image();
        const right = new Image();
        const right2 = new Image();

        // http://www.gsarchives.net/index2.php?category=sprites&system=computer&game=raptor&type=sprites&level0=non-animated
        normal.src = 'plane.gif';
        left.src = 'plane_turning_right_1.gif';
        left2.src = 'plane_turning_right_2.gif';
        right.src = 'plane_turning_left_1.gif';
        right2.src = 'plane_turning_left_2.gif';

        this.sprite = {
            normal,
            left,
            left2,
            right,
            right2,
        };
    },

    detectKeys() {
        this.velocity.x = 0;
        this.velocity.y = 0;

        if ( keyboard.isKeyDown( keyboard.codes.SPACE ) ) {
            if ( this.canShoot() ) {
                this.shoot();
            }
        }

        if ( keyboard.isKeyDown( keyboard.codes.LEFT ) ) {
            this.velocity.x = -this.speed.x;
        }

        if ( keyboard.isKeyDown( keyboard.codes.RIGHT ) ) {
            this.velocity.x = this.speed.x;
        }

        if ( keyboard.isKeyDown( keyboard.codes.UP ) ) {
            this.velocity.y = -this.speed.x;
        }

        if ( keyboard.isKeyDown( keyboard.codes.DOWN ) ) {
            this.velocity.y = this.speed.x;
        }
    },

    canShoot() {
        if ( this.shootDelay < 10 ) {
            return false;
        }

        this.shootDelay = 0;
        return true;
    },
};
