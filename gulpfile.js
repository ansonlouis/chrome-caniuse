// gulpfile.js

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var clean = require('gulp-clean');

gulp.task('clean-build', function(){
  return gulp.src('./build')
    .pipe(clean());
});

gulp.task('copy', function(){
  return gulp.src('./src/**/*')
    .pipe(gulp.dest('./build'));
});


gulp.task('sass', function(){
  return gulp.src('build/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(flatten())
    .pipe(gulp.dest('build'));
});

gulp.task('clean-sass', function(){
  return gulp.src('build/**/*.scss', {read: false})
    .pipe(clean());
});

gulp.task('watch', function(){
  gulp.watch('src/**/*', gulp.series('default'));
});


gulp.task('default', gulp.series('clean-build', 'copy', 'sass', 'clean-sass'));
