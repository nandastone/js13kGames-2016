import { boxCollide } from '../utils';
import game from './game';
import canvas from './canvas';
import map from './map';
import bullet from './bullet';

const enemy = {
    BASIC: {
        width: 20,
        height: 20,
        speed: { x: 0, y: 3 },
        hp: 100
    },

    create: function ( _type, _pos ) {
        return new Enemy( _type, _pos );
    }
};

var Enemy = function ( _type, _pos ) {
    this.type = game.ENTITIES.ENEMY;
    this.active = true;
    this.z = 100;
    this.pos = _pos;
    this.width = _type.width;
    this.height = _type.height;
    this.speed = _type.speed;
    this.hp = _type.hp;
    this.dead = false;
    this.deathFrames = 0;

    this.__frame = 0;
    this.__hasShot = false;
    this.__shootFrame = Math.random() * 50;
};

Enemy.prototype.update = function () {
    var self = this;

    if ( !this.active ) return;

    this.__frame += 1;

    if ( this.dead ) {
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
        game.getBodies( game.ENTITIES.BULLET ).forEach( function ( _v ) {
            // @todo Before define active/dead state. We want:
            // 1. Do not update, render, collide, etc.
            // 2. Update and render, do not collide.
            // 3. Update and render, do not move or collide.

            if ( !_v.active || _v.dead || _v.collidesWith !== game.ENTITIES.ENEMY ) return;

            if ( boxCollide( self, _v ) ) {
                // damage enemy by bullet amount
                self.hurt( _v.damage );

                // destroy the bullet
                _v.kill();
            }
        } );

        // loop player and check if any collide
        game.getBodies( game.ENTITIES.PLAYER ).forEach( function ( _v ) {
            if ( !_v.active || _v.dead ) return;

            if ( boxCollide( self, _v ) ) {
                // damage enemy by collide amount
                self.hurt( _v.damage );

                // damage the player by collide amount
                _v.hurt( _v.damage );
            }
        } );

        if ( !this.__hasShot && this.__frame > this.__shootFrame ) {
            this.shoot();
        }
    }
};

Enemy.prototype.render = function () {
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
    }

    canvas.ctx.fillStyle = 'red';
    canvas.ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
    canvas.ctx.restore();
};

Enemy.prototype.hurt = function ( _damage ) {
    this.hp -= _damage;

    if ( this.hp <= 0 ) {
        this.dead = true;
    }
};

Enemy.prototype.shoot = function () {
    var b = bullet.create( {
        pos: {
            x: this.pos.x + ( this.width / 2 ),
            y: this.pos.y + this.height
        },
        velocity: {
            x: 0,
            y: 5
        },
        collidesWith: game.ENTITIES.PLAYER,
        damage: 100
    } );

    game.addBody( b );

    this.__hasShot = true;
};

export default enemy;
