const gulp = require('gulp'),
    gzip = require('gulp-gzip'),
    concat = require('gulp-concat'), // 多文件合并为
    cleanCSS = require('gulp-clean-css'),
    ugLify = require('gulp-uglify'), //压缩js
    imageMin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'), // 深度压缩
    htmlMin = require('gulp-htmlmin'), //压缩html
    changed = require('gulp-changed'), //检查改变状态
    browserSync = require("browser-sync").create(), //浏览器实时刷新
    replace = require('gulp-replace');




gulp.task('html', () => {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp
        .src('dev/*.html')
        .pipe(changed('dist', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(htmlMin(options))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('css', () => {
    gulp
        .src(['dev/css/public.css', 'dev/css/*.css'])
        .pipe(changed('dist/css', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(replace(/\.\.\//g, '/'))
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('js', () => {
    gulp
        .src(['dev/js/*/*.js', 'dev/js/*.js'])
        .pipe(changed('dist/js', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(concat('index.js'))
        .pipe(ugLify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('images', function () {
    gulp
        .src('dev/images/**.*')
        .pipe(changed('dist/images', {
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(imageMin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

let gulp_dist = () => {
    gulp.start('html', 'css', 'js', 'images');
    browserSync.init({
        port: 3005,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('dev/js/*.js', ['js']); //监控文件变化，自动更新
    gulp.watch('dev/css/*.css', ['css']);
    gulp.watch('dev/*.html', ['html']);
    gulp.watch('dev/images/*.*', ['images']);
}

module.exports = gulp_dist;