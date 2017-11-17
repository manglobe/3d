const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    nunjucks = require('gulp-nunjucks'),
    changed = require('gulp-changed'), //检查改变状态
    browserSync = require("browser-sync").create(); //浏览器实时刷新
    imageMin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'), // 深度压缩
    
//删除dist下的所有文件
gulp.task('delete_dev', function (cb) {
    return del(['dev/*'], cb);
})
/*  sass    */
gulp.task('sass', () => {
    gulp
        .src(['src/static/sass/*.scss', 'src/static/sass/css/**/**.*'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function (err) {
            console.log('Sass Error!', err.message);
            this.emit('end');
        })
        .pipe(autoprefix('last 2 versions'))
        .pipe(sourcemaps.write('maps'))
        .pipe(changed('dev/css', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(gulp.dest('dev/css'))
        .pipe(browserSync.reload({
            stream: true
        }));

});
gulp.task('sass::watch', () => {
    gulp.watch('src/static/sass/*.scss', ['sass']);
})
/*  nunjucks    */
gulp.task('nun', () => {
    gulp
        .src('src/views/*.html')
        .pipe(nunjucks.compile({
            name: 'Sindre'
        }))
        .on('error', function (err) {
            console.log('Sass Error!', err.message);
            this.emit('end');
        })
        .pipe(changed('dev', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(gulp.dest('dev'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('nun::watch', () => {
    gulp.watch('src/views/*.html', ['nun']);
})
/*  js   */
gulp.task('es6', () => {
    gulp
        .src(['src/static/js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', function (err) {
            console.log('es6 Error!', err.message);
            this.emit('end');
        })
        .pipe(sourcemaps.write('maps'))
        .pipe(changed('dev/js', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(gulp.dest('dev/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
    gulp
        .src(['src/static/js/modules/**/*'])
        .pipe(changed('dev/js/modules', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(gulp.dest('dev/js/modules/'))
        .pipe(browserSync.reload({
            stream: true
        }));
})
gulp.task('es6::watch', () => {
    gulp.watch('src/js/*.js', ['es6']);
})
gulp.task('images1', function () {
    gulp
        .src('src/static/images/**/*')
        .pipe(changed('dev/images', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(imageMin({
            progressive: true, // 无损压缩JPG图片
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        .pipe(gulp.dest('dev/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
})
let gulp_dev = () => {
    gulp.start('nun', 'sass', 'es6', 'images1');
    browserSync.init({
        port: 3003,
        server: {
            baseDir: ['dev']
        }
    });
    gulp.watch('src/static/js/**/*', ['es6']); //监控文件变化，自动更新
    gulp.watch('src/static/sass/*.scss', ['sass']);
    gulp.watch('src/views/*.html', ['nun']);
    gulp.watch('src/static/images/**/*', ['images1']);
}

module.exports = gulp_dev;