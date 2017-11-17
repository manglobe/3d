const gulp = require('gulp'),
      replace = require('gulp-replace');

gulp.task('iis-path', function () {
  gulp
    .src('dev/**/**.*')
    .pipe(gulp.dest('../IIS-text-path/'))

    
  gulp
    .src('dev/css/**/**.*')
    .pipe(replace(/\.\.\/images/,'../../../images/thgn/jifen'))   
    .pipe(gulp.dest('../IIS-text-path/路径/css'))
    

    
  gulp
    .src('dev/**.html')
    .pipe(replace(/js\/modules\/(.+\.js)/,'../../js/thgn/jifen/$1'))
    .pipe(replace(/css\/.*\/(.+\.css)/,'../../css/thgn/jifen/$1'))
    .pipe(replace(/images\/.*\/(.+\.*)/,'../../images/thgn/jifen/$1'))
    .pipe(gulp.dest('../IIS-text-path/路径/'))



});
let gulp_iis = () => {
  gulp.start('iis-path');
}
module.exports = gulp_iis;