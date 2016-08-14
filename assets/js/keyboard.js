var keyboard = {
    codes: {
        UP:     38,
        DOWN:   40,
        LEFT:   37,
        RIGHT:  39,

        CTRL:   17,
        SPACE:  32,

        NUM0:   96,
        NUM1:   97,
        NUM2:   98,
        NUM3:   99,
        NUM4:   100,
        NUM5:   101,
        NUM6:   102,
        NUM7:   103,
        NUM8:   104,
        NUM9:   105
    },
    __keys: {},

    init: function () {
        var self = this;

        document.addEventListener( 'keydown', function ( _event ) {
            for ( key in self.codes ) {
                if ( self.codes[ key ] === _event.keyCode) {
                    self.__keys[ self.codes[ key ] ] = true;
                    break;
                }
            }
        } );

        document.addEventListener( 'keyup', function ( _event ) {
            for ( key in self.codes ) {
                if ( self.codes[ key ] === _event.keyCode) {
                    self.__keys[ self.codes[ key ] ] = false;
                    break;
                }
            }
        } );
    },

    isKeyDown: function ( _key ) {
        return this.__keys[ _key ];
    }
};
