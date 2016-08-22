/* global glitch */

glitch.utils = {
	clamp: function ( _val, _min, _max ) {
        return Math.min( Math.max( _val, _min ), _max );
    }
};