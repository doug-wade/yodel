var babel      = require('gulp-babel');
var concat     = require('gulp-concat');
var david      = require('gulp-david');
var del        = require('del');
var eslint     = require('gulp-eslint');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var imagemin   = require('gulp-imagemin');
var install    = require('gulp-install');
var karma      = require('karma');
var livereload = require('gulp-livereload');
var mocha      = require('gulp-mocha-co');
var ngHtml2Js  = require('gulp-ng-html2js');
var nodemon    = require('gulp-nodemon');
var paths      = require('./config/paths');
var path       = require('path');
var pngquant   = require('imagemin-pngquant');
var protractor = require('gulp-protractor').protractor;
var ptor       = require('protractor');
// There is a complementary comment in the scripts task
// var uglify     = require('gulp-uglify');

gulp.task('angular-views', function() {
  return gulp.src([
      paths.partials
    ])
    .pipe(ngHtml2Js({
      moduleName: 'yodel',
      prefix: '/partials/'
    }))
    .pipe(concat('angular-views.min.js'))
    .pipe(gulp.dest(path.join(paths.public, 'scripts')))
    .pipe(livereload());
});

gulp.task('bower', function() {
  return gulp.src([
      paths.bowerjson
    ])
    .pipe(install());
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
  return gulp.src(path.join(paths.config, 'config.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-test-data', function() {
  return gulp.src(path.join(paths.config, 'test-data.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('images', function() {
  return gulp.src(paths.images).pipe(imagemin({
      optimizationLevel: 5,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.join(paths.public, 'images')))
    .pipe(livereload());
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

gulp.task('npm', function() {
  return gulp.src([paths.packagejson])
    .pipe(install());
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
    .pipe(concat('all.js'))
    .pipe(babel())
//    .pipe(uglify())
    .pipe(gulp.dest(path.join(paths.public, 'scripts')))
    .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src([
      paths.styles
    ])
    .pipe(gulp.dest(path.join(paths.public, '/css')))
    .pipe(livereload());
});

gulp.task('views', function() {
  return gulp.src([
      paths.views]
    )
    .pipe(gulp.dest(paths.public))
    .pipe(livereload());
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
gulp.task('compile', ['bower', 'images', 'views', 'angular-views', 'styles', 'scripts', 'server-scripts', 'copy-config', 'copy-test-data']);
gulp.task('default', ['compile', 'watch', 'server']);
gulp.task('test', ['mocha', 'karma', 'protractor']);
gulp.task('unit-test', ['watch', 'mocha']);
