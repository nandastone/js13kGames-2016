var bullet = {
    position: {
        LEFT: 1,
        CENTER: 2,
        RIGHT: 3
    },

    create: function ( _pos, _alignment ) {
        return new Bullet( _pos, _alignment );
    }
};

var Bullet = function ( _pos, _alignment ) {
    this.z = 5;
    this.pos = _pos;
    this.width = this.w = 5;
    this.height = this.h = 5;
    this.speed = {
        y: -10,
        x: 0
    };

    // @todo How do centered co-ordinate systems work?
    if ( _alignment = bullet.position.CENTER ) {
        this.pos.x = this.pos.x - ( this.width / 2 );
        this.pos.y = this.pos.y - ( this.height / 2 );
    }
};

Bullet.prototype.update = function () {
    this.pos.x = this.pos.x + this.speed.x;
    this.pos.y = this.pos.y + this.speed.y;

    // if bullet leaves stage, destroy it
    if ( 
        // off left of screen
        ( ( this.pos.x + this.width ) < 0 ) ||
        // off right of screen
        ( this.pos.x > map.width ) || 
        // off top of screen
        ( ( this.pos.y + this.height ) < 0 ) ||
        // off bottom of screen
        ( this.pos.y > map.height ) ) {
        
        game.removeBody( this );
    }
};

Bullet.prototype.render = function () {
    canvas.ctx.save();
    canvas.ctx.fillStyle = 'red';
    canvas.ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
    canvas.ctx.restore();
};