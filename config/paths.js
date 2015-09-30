var path = require('path');

var projectRoot = path.resolve(path.join(__dirname, '..'));
var persistentOutput = path.resolve(path.join(projectRoot, '..', '/yodel-persistent'));
var config = path.join(projectRoot, 'config');

module.exports = {
  bower: 'public/vendor',
  bowerjson: path.join(projectRoot, 'bower.json'),
  build: path.join(projectRoot, 'build'),
  config: config,
  db: path.join(persistentOutput, 'yodel-db.json'),
  e2especs: 'test/e2e/*.scenarios.js',
  karmaconf: path.join(config, 'karma.js'),
  logs: path.join(persistentOutput, 'logs'),
  images: path.join(projectRoot, 'images/**/*.*'),
  packagejson: path.join(projectRoot, 'package.json'),
  partials: 'webapp/**/*.html',
  persistent: persistentOutput,
  public: path.join(projectRoot, 'public'),
  root: projectRoot,
  scripts: 'webapp/**/*.js',
  server: 'server/**/*.js',
  serverspecs: 'test/server/*.spec.js',
  styles: path.join(projectRoot, 'stylesheets/**/*.styl'),
  templates: path.join(projectRoot, 'templates'),
  views: 'views/*.html'
};
