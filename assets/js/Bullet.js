/* global glitch */

glitch.bullet = {
    create: function ( _pos ) {
        return new Bullet( _pos );
    }
};

var Bullet = function ( _pos ) {
    this.type = glitch.game.ENTITIES.BULLET;
    this.z = 5;
    this.pos = _pos;
    this.width = this.w = 5;
    this.height = this.h = 5;
    this.speed = {
        y: -10,
        x: 0
    };
    this.damage = 25;

    // center align bullet position
    this.pos.x = this.pos.x - ( this.width / 2 );
    this.pos.y = this.pos.y - ( this.height / 2 );
};

Bullet.prototype.update = function () {
    var self = this;

    this.pos.x = this.pos.x + this.speed.x;
    this.pos.y = this.pos.y + this.speed.y;

    // if bullet leaves stage, destroy it
    if ( 
        // off left of screen
        ( ( this.pos.x + this.width ) < 0 ) ||
        // off right of screen
        ( this.pos.x > glitch.map.width ) || 
        // off top of screen
        ( ( this.pos.y + this.height ) < 0 ) ||
        // off bottom of screen
        ( this.pos.y > glitch.map.height ) ) {
        
        glitch.game.removeBody( this );
    }

    // loop enemies and check if any collide
    glitch.game.getBodies( glitch.game.ENTITIES.ENEMY ).forEach( function ( _v ) {
        if ( !_v.active ) return;

        if ( glitch.utils.boxCollide( self, _v ) ) {
            _v.damage( self.damage );
            glitch.game.removeBody( self );
        }
    } );
};

Bullet.prototype.render = function () {
    glitch.canvas.ctx.save();
    glitch.canvas.ctx.fillStyle = 'red';
    glitch.canvas.ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
    glitch.canvas.ctx.restore();
};