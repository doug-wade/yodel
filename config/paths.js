var path = require('path');
var process = require('process');

var root = process.cwd();
var config = path.join(root, 'config');

module.exports = {
  bower: 'public/vendor',
  bowerjson: path.join(root, 'bower.json'),
  build: path.join(root, 'build'),
  config: config,
  db: 'yodel88/yodel-db.json',
  e2especs: 'test/e2e/*.scenarios.js',
  karmaconf: path.join(config, 'karma.js'),
  images: path.join(root, 'images/**/*.*'),
  packagejson: path.join(root, 'package.json'),
  partials: 'webapp/**/*.html',
  public: path.join(root, 'public'),
  root: root,
  scripts: 'webapp/**/*.js',
  server: 'server/**/*.js',
  serverspecs: 'test/server/*.spec.js',
  styles: path.join(root, 'stylesheets/**/*.styl'),
  views: 'views/*.html'
};
