'use strict';

const gulp = require( 'gulp' );

// Bootstrap individual task files
[ 'build', 'css', 'images', 'template', 'watch', 'zip' ]
  .forEach( task => require( `./tasks/${ task }` )() );

gulp.task( 'default', [ 'build', 'css', 'images', 'template', 'zip', 'report' ] );
