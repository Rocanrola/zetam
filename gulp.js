var z = require('./');
var path = require('path');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var componentPaths;

var $ = {
    watch:require('gulp-watch'),
    nodemon:require('gulp-nodemon'),
    plumber:require('gulp-plumber'),
    less:require('gulp-less'),
    prefix:require('gulp-autoprefixer'),
    rename:require('gulp-rename')
}

var plumberOption = {
    errorHandler:function(e){
        console.log(e);
    }
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
        return gulp.src(addEach(componentPaths,'/**/styles.less'), { read: false })
            .pipe($.watch())
            .pipe($.plumber(plumberOption))
            .pipe($.less())
            .pipe($.prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/css/components/'))
            .pipe(livereload());
    })

    gulp.task('less-pages', function() {
        return gulp.src(addEach(pagesPaths,'/**/styles.less'), { read: false })
            .pipe($.watch())
            .pipe($.plumber(plumberOption))
            .pipe($.less())
            .pipe($.prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/css/pages/'))
            .pipe(livereload());
    })

    gulp.task('less',['less-components','less-pages']);


    // Browserify

    gulp.task('browserify-components', function() {
        var browserified = transform(function(filename) {
            var b = browserify(filename);
            return b.bundle();
        });

        return gulp.src(addEach(componentPaths,'/**/view.js'))
            .pipe($.watch())
            .pipe($.plumber(plumberOption))
            .pipe(browserified)
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/js/components/'))
            .pipe(livereload({path:'once.js'}));
    })

    gulp.task('browserify-pages', function() {

        var browserified = transform(function(filename) {
            var b = browserify(filename);
            return b.bundle();
        });


        return gulp.src(addEach(pagesPaths,'/**/view.js'))
            .pipe($.watch())
            .pipe($.plumber(plumberOption))
            .pipe(browserified)
            .pipe($.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = '';
            }))
            .pipe(gulp.dest('./public/js/pages/'))
            .pipe(livereload({path:'once.js'}));
    })

    gulp.task('browserify',['browserify-components','browserify-pages']);


    // Livereload
    var templatesPaths = addEach(componentPaths,'/**/*.html')
        .concat(addEach(pagesPaths,'/**/*.html'));

    gulp.watch(templatesPaths).on('change', livereload.changed);

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

    gulp.task('zetam', ['livereload','browserify','less','server']);
    gulp.task('zetam-build', ['browserify','less']);

}