import { clamp, boxCollide } from '../utils';
import game from './game';
import keyboard from './keyboard';
import canvas from './canvas';
import map from './map';
import bullet from './bullet';

const player = {
    init: function () {
        this.type = game.ENTITIES.PLAYER;
        this.active = true;
        this.z = 500;
        this.width = this.w = 27;
        this.height = this.h = 37;
        this.pos = {
            x: ( canvas.width / 2 ) - ( this.w / 2 ),
            y: canvas.height - 100
        };
        this.speed = { x: 4, y: 5 };
        this.velocity = { x: 0, y: 0 };
        this.sprite = {};
        this.shootDelay = 0;
        this.hp = 200;
        this.damage = 100;
        this.deathFrames = 6;

        this.__initSprite();
    },

    update: function () {
        var self = this;

        if ( !this.active ) return;

        this.shootDelay += 1;

        if ( this.dead ) {
            if ( this.deathFrames >= 6 ) {
                // @todo Game over
                console.log( 'GAME OVER MAN!' );
                this.active = false;
            } else {
                this.deathFrames += 1;
            }
        } else {
            // detect player actions via keyboard input
            this.__detectKeys();

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
                )
            };

            // loop bullets and check if any collide
            game.getBodies( game.ENTITIES.BULLET ).forEach( function ( _v ) {
                if ( !_v.active || _v.dead || _v.collidesWith !== game.ENTITIES.PLAYER ) return;

                if ( boxCollide( self, _v ) ) {
                    // damage enemy by bullet amount
                    self.hurt( _v.damage );

                    // destroy the bullet
                    _v.kill();
                }
            } );
        }
    },

    render: function () {
        var sprite = this.sprite.normal;

        if ( !this.active ) return;

        canvas.ctx.save();

        if ( this.dead && this.deathFrames ) {
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
        } else {
            // @todo How to animate turning left over a number of ticks?
            if ( this.velocity.x < 0 ) {
                sprite = this.sprite.left;
            } else if ( this.velocity.x > 0 ) {
                sprite = this.sprite.right;
            }

        }

        canvas.ctx.drawImage( sprite, this.pos.x, this.pos.y, this.w, this.h );
        canvas.ctx.restore();
    },

    shoot: function () {
        var b1 = bullet.create( {
            pos: {
                x: this.pos.x + 2,
                y: this.pos.y + 20
            },
            collidesWith: game.ENTITIES.ENEMY
        } );

        var b2 = bullet.create( {
            pos: {
                x: this.pos.x + ( this.width - 2 ),
                y: this.pos.y + 20
            },
            collidesWith: game.ENTITIES.ENEMY
        } );

        game.addBody( b1 );
        game.addBody( b2 );
    },

    hurt: function ( _damage ) {
        this.hp -= _damage;

        if ( this.hp <= 0 ) {
            this.dead = true;
        }
    },

    // @todo Investigate sprite maps and animating them.
    __initSprite: function () {
        var normal = new Image();
        var left = new Image();
        var left2 = new Image();
        var right = new Image();
        var right2 = new Image();

        // http://www.gsarchives.net/index2.php?category=sprites&system=computer&game=raptor&type=sprites&level0=non-animated
        normal.src = 'plane.gif';
        left.src = 'plane_turning_right_1.gif';
        left2.src = 'plane_turning_right_2.gif';
        right.src = 'plane_turning_left_1.gif';
        right2.src = 'plane_turning_left_2.gif';

        this.sprite = {
            normal: normal,
            left: left,
            left2: left2,
            right: right,
            right2: right2
        };
    },

    __detectKeys: function () {
        this.velocity.x = 0;
        this.velocity.y = 0;

        if ( keyboard.isKeyDown( keyboard.codes.SPACE ) ) {
            if ( this.__canShoot() ) {
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

    __canShoot: function () {
        if ( this.shootDelay < 10 ) {
            return false;
        }

        this.shootDelay = 0;
        return true;
    }
};

export default player;
