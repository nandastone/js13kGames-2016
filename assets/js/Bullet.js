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
    this.x = _pos.x;
    this.y = _pos.y;
    this.width = this.w = 5;
    this.height = this.h = 5;
    this.speedy = -7;
    this.speedx = 0;

    // @todo How do centered co-ordinate systems work?
    if ( _alignment = bullet.position.CENTER ) {
        this.x = this.x - ( this.width / 2 );
        this.y = this.y - ( this.height / 2 );
    }
};

Bullet.prototype.update = function () {
    this.x = this.x + this.speedx;
    this.y = this.y + this.speedy;

    // if bullet leaves stage, destroy it
    if ( 
        // off left of screen
        ( ( this.x + this.width ) < 0 ) ||
        // off right of screen
        ( this.x > map.width ) || 
        // off top of screen
        ( ( this.y + this.height ) < 0 ) ||
        // off bottom of screen
        ( this.y > map.height ) ) {
        
        game.removeBody( this );
    }
};

Bullet.prototype.render = function () {
    canvas.ctx.fillStyle = 'red';
    canvas.ctx.fillRect( this.x, this.y, this.width, this.height );
};