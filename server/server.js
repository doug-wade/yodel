var aws        = require('aws-sdk');
var bodyParser = require('koa-bodyparser');
var bunyan     = require('koa-bunyan');
var config     = require('./config.js');
var gzip       = require('koa-gzip');
var json       = require('koa-json');
var jwt        = require('koa-jwt');
var koa        = require('koa');
var logger     = require('./logger.js');
var router     = require('koa-router')();
var serve      = require('koa-static');
var session    = require('koa-session');
var validate   = require('koa-validate');
var views      = require('co-views');

var app        = module.exports = koa();

app.use(bunyan(logger, {
  level: 'info',
  timeLimit: 250
}));

aws.config.region = config.aws.region;

app.use(jwt({secret: config.jwtAuthSecret}).unless({ path: [
  /^\/$/,
  /^\/google39a401e34b9a7d21.html$/,
  /^\/favicon\.ico/,
  /^\/css/,
  /^\/images/,
  /^\/js/,
  /^\/login/,
  /^\/public/,
  /^\/scripts/,
  /^\/signup/,
  /^\/vendor/,
  /^\/resource/,
  /^\/events/,
  /^\/resource/,
  /^\/contact-us/,
  /^\/search/
]}));

app.use(json());
app.use(session());
app.use(bodyParser());
app.use(validate());
app.use(gzip());

views('views/');

app.use(serve('public/'), {
  maxage: 60000 * 60 * 24 * 7
});

require('koa-qs')(app);
require('./routes')(router, jwt);
app.use(router.routes());

app.listen(3000);
