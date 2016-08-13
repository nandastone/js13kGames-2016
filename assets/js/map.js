var map = {
    __tiles: {
        1: {
            // @todo Remove size from here, it's a global constant.'
            w: 50,
            h: 50,
            background: 'yellow' 
        },
        2: {
            w: 50,
            h: 50, 
            background: 'green' 
        },
        3: { 
            w: 50,
            h: 50,
            background: 'brown' 
        }
    },

    __grid: [
        [ 1, 2, 1, 1, 3],
        [ 3, 3, 3, 3, 3],
        [ 2, 2, 2, 2, 2],
        [ 2, 2, 1, 1, 1]
    ],

    __map: [],

    init: function () {
        var self = this;

        this.__grid.forEach( function ( _row, _y ) {
            var row = [];

            _row.forEach( function ( _tile, _x ) {
                var tile = {};

                tile.location = { c: _x, r: _y };
                tile.isOddRow = !!( _y % 2 );
                // @todo This is not just display, size is used for everything.
                tile.display = self.__tiles[ _tile ];

                row.push( tile );
            } );

            self.__map.push( row );
        } );
    },
    
    update: function () {},

    render: function () {
        var self = this;

        this.__map.forEach( function ( _row, _y ) {
            _row.forEach( function ( _tile, _x ) {
                self.__renderTile( _tile.display, self.tileToPx( _tile ) );
            } );
        } );
    },

    pxToTile: function ( _px ) {
        // @todo Implement.
        return this.__grid[ 0 ][ 0 ];
    },

    tileToPx: function ( _tile ) {
        /**
         * PlotX=MapX*Width+(MapY AND 1)*(Width/2)
         * PlotY=MapY*HeightOverLapping
         * HeightOverLapping=(Height of Hexagon)*0.66
         */

        // translates to top left of tile
        // @todo Add option to translate to center of tile.

        var x = _tile.location.c * _tile.display.w;
        var y = _tile.location.r * ( _tile.display.h * 0.66 );

        // offset every 2nd row of tiles
        if ( _tile.isOddRow ) x = x + ( _tile.display.w / 2 );

        return { x: x, y: y };
    },

    tileNeighbour: function ( _tile, _direction ) {
        var x = _tile.location.c + this.__deltaX( _direction, _tile.isOddRow );
        var y = _tile.location.r + this.__deltaY( _direction );
        // @todo Check overflowing bounds.
        var next = this.__map[ y ][ x ];

        console.info( 'current tile:', _tile, _tile.location );
        console.info( 'isOddRow:', _tile.isOddRow );
        console.info( 'movement direction:', _direction );
        console.info( 'deltaX:', this.__deltaX( _direction, _tile.isOddRow ) );
        console.info( 'deltaY:', this.__deltaY( _direction ) );
        console.info( 'x:', x );
        console.info( 'y:', y );
        console.info( 'Next tile:', next, next.location );
        
        return next;
    },

    __renderTile: function ( _tile, _position ) {
        var qwidth = _tile.w / 2;
        var qheight = _tile.h / 3;

        canvas.ctx.fillStyle = _tile.background;

        // @temp Hacky hexagon drawing code, replace with iteration around angles.
        // @todo Stroke outline of hex. 
        canvas.ctx.beginPath();
        canvas.ctx.moveTo( _position.x, _position.y + qheight );
        canvas.ctx.lineTo( _position.x, _position.y + ( qheight * 2 ) );
        canvas.ctx.lineTo( _position.x + qwidth, _position.y + ( qheight * 3 ) );
        canvas.ctx.lineTo( _position.x + ( qwidth * 2 ), _position.y + ( qheight * 2 ) );
        canvas.ctx.lineTo( _position.x + ( qwidth * 2 ), _position.y + qheight );
        canvas.ctx.lineTo( _position.x + qwidth, _position.y );
        canvas.ctx.fill();
        
        // canvas.ctx.fillRect( _position.x, _position.y, _tile.w, _tile.h );
        // canvas.ctx.strokeStyle = 'black';
        // canvas.ctx.strokeRect( _position.x, _position.y, _tile.w, _tile.h );
    },

    __deltaX: function ( _direction, _oddrow ) {
        var result = 0;

        switch( _direction ) {
            case hex.directions.EAST: 
                result = 1; 
                break;
            case hex.directions.WEST: 
                result = -1;
                break;
            case hex.directions.SOUTHEAST:
            case hex.directions.NORTHEAST: 
                if ( _oddrow === true) result = 1; 
                break;
            case hex.directions.SOUTHWEST:
            case hex.directions.NORTHWEST: 
                if ( _oddrow === false ) result = -1;
                break;
        }
        
        return( result );
    },

    __deltaY: function ( _direction ) {
        var result = 0;

        switch( _direction ) {
            case hex.directions.SOUTHEAST:
            case hex.directions.SOUTHWEST: 
                result = 1;
                break;
            case hex.directions.NORTHEAST:
            case hex.directions.NORTHWEST: 
                result = -1;
                break;
        }

        return( result );
    }
};