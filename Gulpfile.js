var browserify  = require('gulp-browserify');
var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var minifyCSS   = require('gulp-minify-css');
var minifyHTML  = require('gulp-minify-html');
var stripDebug  = require('gulp-strip-debug');
var uglify      = require('gulp-uglify');
var stylus      = require('gulp-stylus');
var nib         = require('nib');
var plumber     = require('gulp-plumber');
var watch       = require('gulp-watch');
var livereload  = require('gulp-livereload');
var modernizr   = require('gulp-modernizr');

gulp.task('watch', function(){
  gulp.watch('./app/*.html', ['html']);
  gulp.watch('./app/stylus/styles.styl', ['stylus']);
  gulp.watch('./app/javascript/main.js', ['javascript']);
});

gulp.task('livereload', function(){
  
  gulp.watch('./app/*.html', ['html']);
  gulp.watch('./app/stylus/styles.styl', ['stylus']);
  gulp.watch('./app/javascript/main.js', ['javascript']);
  livereload.listen();
});

gulp.task('html', function () {
  var htmlSrc = './app/*.html',
      htmlDst = './public';
  gulp.src(htmlSrc)
  .pipe(plumber())
  .pipe(minifyHTML())
  .pipe(gulp.dest(htmlDst))
  .pipe(livereload());
});

gulp.task('javascript', function () {
  var jsSrc = './app/javascripts/main.js',
      jsDst = './public/javascript';
  gulp.src(jsSrc)
    .pipe(plumber())
    .pipe(modernizr())
    .pipe(browserify())
    .pipe(uglify({ compress: true }))
    .pipe(stripDebug(jsSrc))
    .pipe(gulp.dest(jsDst))
    .pipe(livereload());
});

gulp.task('stylus', function()
{
  var stylusSrc = './app/stylus/styles.styl',
      stylusDst = './public/stylesheet';

  gulp.src(stylusSrc)
    .pipe(plumber())
    .pipe(stylus(
                 {use:nib(),
                  compress:true
                 }))
    .pipe(gulp.dest(stylusDst))
    .pipe(livereload());
});

gulp.task('fonts', function () {
  gulp.src('app/fonts/**')
    .pipe(plumber())
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('data', function () {
   gulp.src('app/data.json')
   .pipe(plumber())
   .pipe(gulp.dest('./public'));
});

gulp.task('css', function () {
  gulp.src('app/css/**/*.css')
    .pipe(plumber())
    .pipe(minifyCSS({ keepSpecialComments: '*', keepBreaks: '*'}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', function () {
  var imgSrc = './app/imagenes/**/*',
      imgDst = './public/imagenes';

  gulp.src(imgSrc)
    .pipe(plumber())
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

gulp.task('default', [ 'javascript', 'stylus', 'images', 'html', 'fonts', 'data' ]);
