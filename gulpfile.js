const gulp = require('gulp'),
    /*sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    gzip = require('gulp-gzip'),
    concat = require('gulp-concat'), // 多文件合并为
    cleanCSS = require('gulp-clean-css'),
    ugLify = require('gulp-uglify'), //压缩js
    imageMin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'), // 深度压缩
    htmlMin = require('gulp-htmlmin'), //压缩html
    changed = require('gulp-changed'), //检查改变状态
    browserSync = require("browser-sync").create(), //浏览器实时刷新
    rev = require('gulp-rev-collector'),    //时间戳
    del = require('del'),
    nunjucks = require('gulp-nunjucks');*/
    clean = require('gulp-clean'),
    gulp_dev = require('./gulp_modules/gulp-dev'), 
    gulp_dist = require('./gulp_modules/gulp-dist');
    gulp_iis = require('./gulp_modules/gulp-iis');

gulp.task('clean-dist', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});
gulp.task('clean-dev', function () {
    return gulp.src('dev', { read: false })
        .pipe(clean());
});
gulp.task('clean-test', function () {
    return gulp.src('test', { read: false })
        .pipe(clean());
});
gulp.task('dev', ['clean-dev'], gulp_dev)
gulp.task('dist', ['clean-dist'], gulp_dist)
gulp.task('iis',  gulp_iis)
gulp.task('clean-all', ['clean-dev'
    , 'clean-dist', 'clean-test'
])



gulp.task('images', function () {
    gulp
        .src('src/static/images/**/*')
 
        .pipe(gulp.dest('dev/images'))
     
})

/*gulp.task('default', () => {
    console.log('default')
})
//删除dist下的所有文件
gulp.task('delete_dist', function (cb) {
    return del(['dist/*'], cb);
})
*/