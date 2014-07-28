var z = require('./');
var livereload = require('gulp-livereload');
var componentPaths;

var $ = {
    nodemon:require('gulp-nodemon'),
    plumber:require('gulp-plumber'),
    less:require('gulp-less'),
    rename:require('gulp-rename'),
    browserify:require('gulp-browserify')
}

module.exports = function(gulp,conf) {
    conf = conf || {};
    conf.expressPort = conf.expressPort || 3000; 

    
    // LESS

    gulp.task('less', function() {
        componentPaths.forEach(function(path){
            gulp.src('./'+path+'/**/styles.less')
                .pipe($.plumber())
                .pipe($.less())
                .pipe($.rename(function(path) {
                    path.basename = path.dirname;
                    path.dirname = '';
                }))
                .pipe(gulp.dest('./public/css/components/'));
        })

        return gulp.src('./pages/**/bundle.less')
            .pipe($.plumber())
            .pipe($.less({
                    compress: true
             }))
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/css/pages/'));
    });


    gulp.task('less-and-autoreload',['less'], function() {
        livereload.changed({path:'once.css'});
    });

    // Browserify

    gulp.task('browserify', function() {
        componentPaths.forEach(function(path){
            gulp.src('./'+path+'/**/view.js')
                    .pipe($.plumber())
                    .pipe($.browserify())
                    .pipe($.rename(function(path) {
                        path.basename = path.dirname;
                        path.dirname = '';
                    }))
                    .pipe(gulp.dest('./public/js/components/'));
        })

        return gulp.src('./pages/**/view.js')
                    .pipe($.plumber())
                    .pipe($.browserify())
                    .pipe($.rename(function(path) {
                        path.basename = path.dirname;
                        path.dirname = '';
                    }))
                    .pipe(gulp.dest('./public/js/pages/'));
    });

    gulp.task('browserify-and-autoreload',['browserify'], function() {
        livereload.changed({path:'once.js'});
    });

    // Watch

    gulp.task('watch', function() {

        gulp.watch(['**/*.less',
                    '!node_modules/**',
                    '!public/**'], ['less-and-autoreload']);

        gulp.watch(['**/*.js',
                    '!node_modules/**',
                    '!public/**'], ['browserify-and-autoreload']);

        gulp.watch(['**/*.html',
                    '!node_modules/**',
                    '!public/**']).on('change', livereload.changed);
    });

    // Livereload

    gulp.task('livereload',function(){
        livereload.listen();
    });

    // Express

    gulp.task('server',function() {
        $.nodemon({
            script: 'app.js',
            ext: 'json',
            ignore: ['**/view.js','public/**'], 
            env: {
                'NODE_ENV': 'development',
                'PORT': conf.expressPort
            }
        })
        .on('restart', function() {
            console.log('express restarted!')
            livereload.changed();
        });
    });

    gulp.task('zetam', ['livereload','browserify','less','server','watch']);
    gulp.task('zetam-build', ['browserify','less']);

}