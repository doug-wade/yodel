var babel        = require('gulp-babel');
var bower        = require('gulp-bower');
var concat       = require('gulp-concat');
var consolidate  = require('gulp-consolidate');
var david        = require('gulp-david');
var del          = require('del');
var eslint       = require('gulp-eslint');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var gutil        = require('gulp-util');
var imagemin     = require('gulp-imagemin');
var karma        = require('karma');
var livereload   = require('gulp-livereload');
var minifyCss    = require('gulp-minify-css');
var minifyHtml   = require('gulp-minify-html');
var mocha        = require('gulp-mocha-co');
var ngHtml2Js    = require('gulp-ng-html2js');
var nodemon      = require('gulp-nodemon');
var paths        = require('./config/paths');
var path         = require('path');
var pngquant     = require('imagemin-pngquant');
var protractor   = require('gulp-protractor').protractor;
var ptor         = require('protractor');
var sourcemaps   = require('gulp-sourcemaps');
var stylus       = require('gulp-stylus');
var uglify       = require('gulp-uglify');

var isProd = false;
var isWatch = false;

gulp.task('set-prod', function() {
  isProd = true;
  isWatch = false;
});

gulp.task('set-watch', function() {
  isProd = false;
  isWatch = true;
});

gulp.task('angular-views', function() {
  return gulp.src([
      paths.partials
    ])
    // options per: https://www.npmjs.com/package/gulp-ng-html2js
    .pipe(gulpif(isProd, minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    })))
    .pipe(ngHtml2Js({
      moduleName: 'yodel',
      prefix: '/partials/'
    }))
    .pipe(concat(isProd ? 'angular-views.min.js' : 'angular-views.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest(path.join(paths.public, 'scripts')))
    .pipe(gulpif(isWatch, livereload()));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(paths.bower));
});

gulp.task('checkDependencies', function() {
  return gulp.src('package.json')
    .pipe(david())
    .pipe(david.reporter);
});

gulp.task('clean', function() {
  return del([paths.build, paths.public], function(err, deletedFiles) {
    if (err) {
      gutil.log(err);
    } else {
      gutil.log('Cleaned files: ', deletedFiles.join(', '));
    }
  });
});

gulp.task('clean-db', function() {
  return del([paths.db], function(err, deletedFiles) {
    if (err) {
      gutil.log(err);
    } else {
      gutil.log('Cleaned files: ', deletedFiles.join(', '));
    }
  });
});

gulp.task('copy-config', [ 'copy-test-data' ], function() {
  return gulp.src([path.join(paths.config, 'config.js'), path.join(paths.config, 'paths.js')])
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-test-data', function() {
  return gulp.src(path.join(paths.config, 'test-data.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    // Image minification for just 4 images takes 34 seconds; only do it in prod.
    .pipe(gulpif(isProd, imagemin({
      optimizationLevel: 5,
      use: [pngquant()]
    })))
    .pipe(gulp.dest(path.join(paths.public, 'images')))
    .pipe(gulpif(isWatch, livereload()));
});

gulp.task('karma', function(done) {
  return karma.server.start({
      configFile: paths.karmaconf,
      singleRun: true
    }, done);
});

gulp.task('lint-server', function() {
  gulp.src(paths.server)
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});

gulp.task('lint-webapp', function() {
  gulp.src(paths.scripts)
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint-webapp', 'lint-server']);

gulp.task('mocha', function() {
  return gulp.src(paths.serverspecs)
    .pipe(mocha({
        reporter: 'nyan'
    }));
});

gulp.task('protractor', ['webdriver_update', 'webdriver_standalone'], function() {
  return gulp.src(paths.e2especs)
    .pipe(protractor({
      configFile: path.join(paths.config, 'protractor.js')
    })).on('error', function(e) {
      throw e;
    });
});

gulp.task('server', function() {
  return nodemon({
      script: path.join(paths.build, '/server.js'),
      nodeArgs: ['--harmony'],
      ignore: ['bower_components/**', 'node_modules/**', 'src/**', 'test/**', 'views/**', 'images/**']
    });
});

gulp.task('server-scripts', ['lint'], function() {
  var options = {
    blacklist: [
      'regenerator'
    ]
  };
  return gulp.src(paths.server)
    .pipe(babel(options))
    .pipe(gulp.dest(paths.build));
});

gulp.task('scripts', function() {
  return gulp.src([
      'webapp/**/!(app)*.js',
      'webapp/app.js'
    ])
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(babel())
    .pipe(concat(isProd ? 'all.min.js' : 'all.js'))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(gulp.dest(path.join(paths.public, 'scripts')))
    .pipe(gulpif(isWatch, livereload()));
});

gulp.task('styles', function() {
  return gulp.src([
      paths.styles
    ])
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(paths.public, '/css')))
    .pipe(gulpif(isWatch, livereload()));
});

gulp.task('styles-prod', function() {
  return gulp.src([
      paths.styles
    ])
    .pipe(stylus())
    .pipe(concat('app.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(path.join(paths.public, '/css')));
});

gulp.task('views', function() {
  return gulp.src([
      paths.views
    ])
    .pipe(consolidate('lodash', {
      isProd: isProd
    }))
    .pipe(gulpif(isProd, minifyHtml()))
    .pipe(gulp.dest(paths.public))
    .pipe(gulpif(isWatch, livereload()));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.partials, ['angular-views']);
  gulp.watch(paths.bowerjson, ['bower']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.packagejson, ['npm']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.server, ['server-scripts']);
  gulp.watch(paths.serverspecs, ['mocha']);
  gulp.watch(path.join(paths.config, 'test-data.js'), ['copy-test-data']);
  gulp.watch(path.join(paths.config, 'config.js'), ['copy-config']);
  return gulp.watch(paths.views, ['views']);
});

gulp.task('webdriver_standalone', ptor.webdriver_standalone);
gulp.task('webdriver_update', ptor.webdriver_update);
gulp.task('debug-prod', ['set-prod', 'views', 'angular-views', 'styles-prod', 'scripts', 'server-scripts', 'copy-config', 'copy-test-data']);
gulp.task('compile', ['bower', 'images', 'views', 'angular-views', 'styles', 'scripts', 'server-scripts', 'copy-config', 'copy-test-data']);
gulp.task('compile-prod', ['set-prod', 'images', 'views', 'angular-views', 'styles-prod', 'scripts', 'server-scripts', 'copy-config', 'copy-test-data']);
gulp.task('default', ['set-watch', 'compile', 'watch', 'server']);
gulp.task('test', ['mocha', 'karma', 'protractor']);
gulp.task('unit-test', ['watch', 'mocha']);
