var player = {
    __tempPos: null,

    init: function () {
        this.w = 10;
        this.h = 10;
        this.pos = { x: 0, y: 0 };

        // @temp Until proper system for tracking current position on map.
        this.__tempPos = map.__map[ 0 ][ 0 ];

        // @temp Until proper position initialisation.
        this.move();
    },

    update: function () {},

    render: function () {
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect( this.pos.x, this.pos.y, this.w, this.h );
    },

    move: function ( _direction ) {
        var current = map.pxToTile( this.pos );
        // @temp Until above method works.
        current = this.__tempPos;
        var destination = map.tileNeighbour( current, _direction );

        if ( !destination ) {
            console.error( 'Cannot move to that tile.' );
        } else {
            this.__tempPos = destination;
            this.pos = map.tileToPx( destination );
            // @temp Hacked centering to tile.
            this.pos = { x: this.pos.x + 20, y: this.pos.y + 20 };
            // @todo Do whatever happens when you move to a new tile!
        }
    }
 };
