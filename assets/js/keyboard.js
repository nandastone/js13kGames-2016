glitch.keyboard = {
    __down: {},
    __preserved: {},
    __released: {},

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

    init: function () {
        var self = this;

        document.addEventListener( 'keydown', function ( _event ) {
            self.__down[ _event.keyCode ] = true;
            self.__preserved[ _event.keyCode ] = true;
        } );

        document.addEventListener( 'keyup', function ( _event ) {
            self.__released[ _event.keyCode ] = true;
            delete self.__down[ _event.keyCode ];
        } );
    },

    isKeyDown: function ( _key ) {
        return this.__down[ _key ];
    },

    isKeyPreserved: function ( _key ) {
        if ( typeof this.__preserved[ _key ] !== 'undefined' ) {
            delete this.__preserved[ _key ];
            return true;
        }

        return false;
    },

    isKeyReleased: function ( _key ) {
        if ( typeof this.__released[ _key ] !== 'undefined' ) {
            delete this.__released[ _key ];
            return true;
        }

        return false;
    }
};
