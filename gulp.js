var z = require('./');
var path = require('path');
var livereload = require('gulp-livereload');
var componentPaths;

var $ = {
    nodemon:require('gulp-nodemon'),
    plumber:require('gulp-plumber'),
    less:require('gulp-less'),
    rename:require('gulp-rename'),
    browserify:require('gulp-browserify')
}

var addEach = function(arr,add){
    var newArr = arr.slice(0);

    for (var i = 0; i < newArr.length; i++) {
        newArr[i] += (typeof add == 'string' ? add : add[i]);
    };
    return newArr;
}

module.exports = function(gulp,conf) {
    conf = conf || {};
    conf.expressPort = conf.expressPort || 3000; 
    conf.paths = conf.paths || [];
    
    var componentPaths = ['./components'].concat(addEach(conf.paths,'/components'));
    var pagesPaths = ['./pages'].concat(addEach(conf.paths,'/pages'));

    gulp.task('less-components', function() {
        return gulp.src(addEach(componentPaths,'/**/styles.less'))
            .pipe($.plumber())
            .pipe($.less())
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/css/components/'));
    })

    gulp.task('less-pages', function() {
        return gulp.src(addEach(pagesPaths,'/**/bundle.less'))
            .pipe($.plumber())
            .pipe($.less())
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/css/pages/'));
    })

    gulp.task('less',['less-components','less-pages']);


    gulp.task('less-and-autoreload',['less'], function() {
        livereload.changed({path:'once.css'});
    });

    // Browserify

    gulp.task('browserify', function() {
        conf.paths.forEach(function(path){

            gulp.src(path+'/components/**/view.js')
                    .pipe($.plumber())
                    .pipe($.browserify())
                    .pipe($.rename(function(path) {
                        path.basename = path.dirname;
                        path.dirname = '';
                    }))
                    .pipe(gulp.dest('./public/js/components/'));

            gulp.src(path+'/pages/**/view.js')
                    .pipe($.plumber())
                    .pipe($.browserify())
                    .pipe($.rename(function(path) {
                        path.basename = path.dirname;
                        path.dirname = '';
                    }))
                    .pipe(gulp.dest('./public/js/pages/'));
        })

    });

    gulp.task('browserify-and-autoreload',['browserify'], function() {
        livereload.changed({path:'once.js'});
    });

    // Watch

    gulp.task('watch', function() {
        var lessPaths = addEach(componentPaths,'/**/*.less')
                        .concat(addEach(pagesPaths,'/**/*.less'))
                        .concat(['./less/**/*.less']);

        // jsCs == Javascript Clien Side
        var jsCsPaths = addEach(componentPaths,'/**/*.js')
                        .concat(addEach(pagesPaths,'/**/*.js'))
                        .concat(['./scripts/**/*.js']);

        var templatesPaths = addEach(componentPaths,'/**/*.html')
                            .concat(addEach(pagesPaths,'/**/*.html'));

        gulp.watch(lessPaths, ['less-and-autoreload']);
        gulp.watch(jsCsPaths, ['browserify-and-autoreload']);
        gulp.watch(templatesPaths).on('change', livereload.changed);
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