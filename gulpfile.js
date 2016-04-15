// gulpfile.js

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var del = require('del');
var zip = require('gulp-zip');
var webpack = require('gulp-webpack');

gulp.task('clean-build', function(){
  return del([
    './build',
  ]);
});

gulp.task('copy', function(){
  return gulp.src('./src/**/*')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-production', function(){
  return gulp.src([
    './src/**/*.html',
    './src/manifest.json'
    ])
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-images', function(){
  return gulp.src('./src/images/**/*', {base : './src'})
    .pipe(gulp.dest('./build'));
});

gulp.task('sass', function(){
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});
gulp.task('sass-min', function(){
  return gulp.src('src/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('clean-sass', function(){
  return gulp.src('build/**/*.scss', {read: false})
    .pipe(clean());
});

gulp.task('watch', function(){
  gulp.watch('src/**/*', gulp.series('default'));
});

gulp.task('minimize-assets', function(){
  return gulp.src('./src/**/*.html')
    .pipe(usemin({
      css : [cssmin],
      js  : [function(){ return uglify({compress: {drop_console:true}}); }],
      jsLibs : [function(){ return uglify({compress: {drop_console:true}}); }]
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('minimize-modules', function(){
  return gulp.src('./src/**/*.html')
    .pipe(usemin({
      jsLibs : []
    }))
    .pipe(gulp.dest('./build'));
});


gulp.task('zip', function(){
  return gulp.src('build/**')
    .pipe(zip('app.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('webpack', function(){
  return gulp.src('src/js/entry/**')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./build/js/bundles'));
});



gulp.task('default', gulp.series('clean-build', 'copy', 'copy-images', 'sass', 'clean-sass', 'minimize-modules'));
gulp.task('production', gulp.series('clean-build', 'copy-production', 'copy-images', 'sass-min', 'minimize-assets', 'zip'));