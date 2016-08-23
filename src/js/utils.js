export const clamp = function ( _val, _min, _max ) {
    return Math.min( Math.max( _val, _min ), _max );
};

export const boxCollide = function ( _body1, _body2 ) {
    if (
        ( _body1.pos.x < _body2.pos.x + _body2.width ) &&
        ( _body1.pos.x + _body1.width > _body2.pos.x ) &&
        ( _body1.pos.y < _body2.pos.y + _body2.height ) &&
        ( _body1.height + _body1.pos.y > _body2.pos.y ) ) {
        return true;
    }

    return false;
};
