export default {
    down: {},
    preserved: {},
    released: {},

    codes: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,

        CTRL: 17,
        SPACE: 32,

        NUM0: 96,
        NUM1: 97,
        NUM2: 98,
        NUM3: 99,
        NUM4: 100,
        NUM5: 101,
        NUM6: 102,
        NUM7: 103,
        NUM8: 104,
        NUM9: 105,
    },

    init() {
        const self = this;

        document.addEventListener( 'keydown', ( _event ) => {
            self.down[ _event.keyCode ] = true;
            self.preserved[ _event.keyCode ] = true;
        } );

        document.addEventListener( 'keyup', ( _event ) => {
            self.released[ _event.keyCode ] = true;
            delete self.down[ _event.keyCode ];
        } );
    },

    isKeyDown( _key ) {
        return this.down[ _key ];
    },

    isKeyPreserved( _key ) {
        if ( typeof this.preserved[ _key ] !== 'undefined' ) {
            delete this.preserved[ _key ];
            return true;
        }

        return false;
    },

    isKeyReleased( _key ) {
        if ( typeof this.released[ _key ] !== 'undefined' ) {
            delete this.released[ _key ];
            return true;
        }

        return false;
    },
};
