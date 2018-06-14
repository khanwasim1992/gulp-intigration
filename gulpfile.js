var gulp = require('gulp');

var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var cache = require('gulp-cache');
var del = require('del');

var imagemin = require('gulp-imagemin');

gulp.task('sass',function(){
    return gulp.src('app/css/scss/**/*.scss')
        .pipe(sass()) // using gulp-sass
        .pipe(gulp.dest('app/css/style.css'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

// Gulp watch syntax
gulp.task('watch',['browserSync', 'sass'],function(){
    gulp.watch('app/css/scss/**/*.scss', ['sass']); 
    gulp.watch('app/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.js',browserSync.reload);
})

// concatinating files js and css
gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      // Minifies only if it's a JavaScript file
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});

// minify minages 
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced : true,
    })))
    .pipe(gulp.dest('dist/images'))
  });

  
  // copying font files  
  gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
  })

  // clean build 
  gulp.task('clean:dist', function() {
    return del.sync('dist');
  }) 

  gulp.task('build', function (callback) {
    runSequence('clean:dist', 
      ['sass', 'useref', 'images', 'fonts'],
      callback
    )
  })

  gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
      callback
    )
  })

var runSequence = require('run-sequence');

gulp.task('task-name', function(callback) {
  runSequence('task-one', 'task-two', 'task-three', callback);
});

// browser sync
gulp.task('browserSync',function(){
    browserSync.init({
        server :{
            baseDir : 'app'    
        },
    })
})
