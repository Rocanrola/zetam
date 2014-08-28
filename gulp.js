var z = require('./');
var path = require('path');
var livereload = require('gulp-livereload');
var componentPaths;

var $ = {
    nodemon:require('gulp-nodemon'),
    plumber:require('gulp-plumber'),
    less:require('gulp-less'),
    prefix:require('gulp-autoprefixer'),
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
            .pipe($.prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/css/components/'));
    })

    gulp.task('less-pages', function() {
        return gulp.src(addEach(pagesPaths,'/**/styles.less'))
            .pipe($.plumber())
            .pipe($.less())
            .pipe($.prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
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

    gulp.task('browserify-components', function() {
        return gulp.src(addEach(componentPaths,'/**/view.js'))
            .pipe($.plumber())
            .pipe($.browserify())
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/js/components/'));
    })

    gulp.task('browserify-pages', function() {
        return gulp.src(addEach(pagesPaths,'/**/view.js'))
            .pipe($.plumber())
            .pipe($.browserify())
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/js/pages/'));
    })

    gulp.task('browserify',['browserify-components','browserify-pages']);

    gulp.task('browserify-and-autoreload',['browserify'], function() {
        livereload.changed({path:'once.js'});
    });

    // Watch

    gulp.task('watch', function() {
        var lessPaths = addEach(componentPaths,'/**/*.less')
                        .concat(addEach(pagesPaths,'/**/*.less'))
                        .concat(['./less/**/*.less']);

        // jsCs == Javascript Clien Side
        var jsCsPaths = addEach(componentPaths,'/**/view.js')
                        .concat(addEach(pagesPaths,'/**/view.js'))
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
        return $.nodemon({
            script: 'app.js',
            ext: 'js json',
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

    gulp.task('zetam', ['livereload','browserify','less','watch','server']);
    gulp.task('zetam-build', ['browserify','less']);

}