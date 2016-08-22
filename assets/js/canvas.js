glitch.canvas = ( function () {
    var el = document.getElementById( 'stage' );
    
    return {
        el: el,
        ctx: el.getContext( '2d' ),
        width: el.width,
        height: el.height
    };
}() );
