const gulp        = require( 'gulp' );

module.exports = () => {
  gulp.task( 'images', function () {
    return gulp.src( [ 'src/img/**/*' ] )
      .pipe( gulp.dest( './dist' ) );
  } );
};
