'use strict';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import data from 'gulp-data';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import uglify from 'gulp-uglify';
import zip from 'gulp-zip';
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import pngquant from 'imagemin-pngquant';
import svgo from 'imagemin-svgo';
import pug from 'gulp-pug';
import rupture from 'rupture';
import sGrid from 's-grid';

// file source and destination variables

// pug (formerly jade)
const pugSrc  = 'source/pug/views/**/*.pug';

// Images
const imgSrc       = 'source/img/**/*';
const imgDest      = 'build/img';

// Stylesheets
const cssSrc       = 'source/stylus/*.styl';
const cssDest      = 'build/css';

// Sripts
const jsSrc        = 'source/js/*.js';
const jsDest       = 'build/js';
const jsVendorSrc  = 'source/js/vendor/*.js';
const jsVendorDest = 'build/js/vendor';

// Handle errors
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Static Server + watching stylus/html/js/image files
gulp.task('serve', ['build'], () => {

  browserSync({
    server: {
       baseDir: './build',
    },
    notify: false,
  });

  gulp.watch("source/img/**/*", ['images'], browserSync.reload);
  gulp.watch("source/stylus/**/*.styl", ['css']);
  gulp.watch("source/pug/**/*.pug", ['pug']);
  gulp.watch("source/js/*.js", ['scripts']);
  gulp.watch("source/js/vendor/*.js", ['scripts-vendor']);
});

// Compile Stylus into CSS, add vendor prefixes & auto-inject into browser
gulp.task('css', () => {
  gulp.src(cssSrc)
  .pipe(plumber({errorHandler: handleError}))
    .pipe(newer(cssDest))
    .pipe(stylus({
      use: [sGrid(), rupture()],
      paths: ['source/stylus'],
    }))
    .pipe(rename('master.css'))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream());
});

// Concatenate scripts (we don't minify these)

gulp.task('scripts', () => {
  gulp.src(jsSrc)
    .pipe(plumber())
    .pipe(newer(jsSrc))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(concat('main.js')) // concat pulls all our files together before minifying them
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({stream: true}));
});

// Copy and optimise images from source to build
gulp.task('images', () => {
  gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant(), jpegtran(), gifsicle()],
    }))
    .pipe(gulp.dest(imgDest))
    .pipe(size({
      title: 'images',
    }));
});

// Copy changed vendor scripts to build dir
gulp.task('scripts-vendor', () => {
  gulp.src(jsVendorSrc)
    .pipe(newer(jsVendorDest))
    .pipe(gulp.dest(jsVendorDest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

gulp.task('pug', () => {
  gulp.src(pugSrc)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

// gulp.task('clean', () => {
//     $.del(['build/'] );
// });

gulp.task('clean', del.bind(null, 'build/*', {
  dot: true,
}));

gulp.task('build', (callback) => {
  runSequence('clean', ['pug', 'images', 'scripts', 'scripts-vendor', 'css'],
    callback);
});

gulp.task('default', ['serve']);
