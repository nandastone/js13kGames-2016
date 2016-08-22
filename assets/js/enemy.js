glitch.enemy = {
    BASIC: {
        width: 20,
        height: 20,
        speed: { x: 0, y: 10 }
    },

    create: function ( _type, _pos ) {
        return new Enemy( _type, _pos );
    }
};

var Enemy = function ( _type, _pos ) {
    this.z = 10;
    this.pos = _pos;
    this.width = _type.width;
    this.height = _type.height;
    this.speed = _type.speed;
    this.active = true;
};

Enemy.prototype.update = function () {
    if ( !this.active ) return;

    this.pos.x = this.pos.x + this.speed.x;
    this.pos.y = this.pos.y + this.speed.y;

    // if enemy leaves stage bottom, destroy it
    if ( this.pos.y > glitch.map.height ) {
        glitch.game.removeBody( this );
    }
};

Enemy.prototype.render = function () {
    if ( !this.active ) return;

    glitch.canvas.ctx.save();
    glitch.canvas.ctx.fillStyle = 'red';
    glitch.canvas.ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
    glitch.canvas.ctx.restore();
};