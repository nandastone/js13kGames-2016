export default ( function canvas() {
    const el = document.getElementById( 'stage' );

    return {
        el,
        ctx: el.getContext( '2d' ),
        width: el.width,
        height: el.height,
    };
}() );
