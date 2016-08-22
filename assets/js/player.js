/* global glitch */

glitch.player = {
    init: function () {
        this.type = glitch.game.ENTITIES.PLAYER;
        this.active = true;
        this.z = 500;
        this.width = this.w = 27;
        this.height = this.h = 37;
        this.pos = {
            x: ( glitch.canvas.width / 2 ) - ( this.w / 2 ),
            y: glitch.canvas.height - 100
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
                x: glitch.utils.clamp(
                    this.pos.x + this.velocity.x,
                    0,
                    glitch.map.width - this.width
                ),
                y: glitch.utils.clamp(
                    this.pos.y + this.velocity.y,
                    0,
                    glitch.map.height - this.height
                )
            };

            // loop bullets and check if any collide
            glitch.game.getBodies( glitch.game.ENTITIES.BULLET ).forEach( function ( _v ) {
                if ( !_v.active || _v.dead || _v.collidesWith !== glitch.game.ENTITIES.PLAYER ) return;

                if ( glitch.utils.boxCollide( self, _v ) ) {
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

        glitch.canvas.ctx.save();

        if ( this.dead && this.deathFrames ) {
            switch ( this.deathFrames ) {
                case 1:
                case 2:
                    glitch.canvas.ctx.globalAlpha = 0.8;
                    break;
                case 3:
                case 4:
                    glitch.canvas.ctx.globalAlpha = 0.5;
                    break;
                case 5:
                case 6:
                default:
                    glitch.canvas.ctx.globalAlpha = 0.2;
            }
        } else {
            // @todo How to animate turning left over a number of ticks?
            if ( this.velocity.x < 0 ) {
                sprite = this.sprite.left;
            } else if ( this.velocity.x > 0 ) {
                sprite = this.sprite.right;
            }

        }

        glitch.canvas.ctx.drawImage( sprite, this.pos.x, this.pos.y, this.w, this.h );
        glitch.canvas.ctx.restore();
    },

    shoot: function () {
        var b1 = glitch.bullet.create( {
            pos: {
                x: this.pos.x + 2,
                y: this.pos.y + 20
            },
            collidesWith: glitch.game.ENTITIES.ENEMY
        } );

        var b2 = glitch.bullet.create( {
            pos: {
                x: this.pos.x + ( this.width - 2 ),
                y: this.pos.y + 20
            },
            collidesWith: glitch.game.ENTITIES.ENEMY
        } );

        glitch.game.addBody( b1 );
        glitch.game.addBody( b2 );
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
        normal.src = 'assets/img/plane.gif';
        left.src = 'assets/img/plane_turning_right_1.gif';
        left2.src = 'assets/img/plane_turning_right_2.gif';
        right.src = 'assets/img/plane_turning_left_1.gif';
        right2.src = 'assets/img/plane_turning_left_2.gif';

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

        if ( glitch.keyboard.isKeyDown( glitch.keyboard.codes.SPACE ) ) {
            if ( this.__canShoot() ) {
                this.shoot();
            }
        }

        if ( glitch.keyboard.isKeyDown( glitch.keyboard.codes.LEFT ) ) {
            this.velocity.x = -this.speed.x;
        }

        if ( glitch.keyboard.isKeyDown( glitch.keyboard.codes.RIGHT ) ) {
            this.velocity.x = this.speed.x;
        }

        if ( glitch.keyboard.isKeyDown( glitch.keyboard.codes.UP ) ) {
            this.velocity.y = -this.speed.x;
        }

        if ( glitch.keyboard.isKeyDown( glitch.keyboard.codes.DOWN ) ) {
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
