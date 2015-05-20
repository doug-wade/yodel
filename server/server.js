var bodyParser = require("koa-bodyparser");
var bunyan     = require("koa-bunyan");
var json       = require("koa-json");
var koa        = require("koa");
var logger     = require("./logger.js");
var parse      = require("co-body");
var route      = require("koa-route");
var serve      = require("koa-static");
var session    = require("koa-session");
var views      = require("co-views");

var app        = module.exports = koa();

app.use(bunyan(logger, {
  level: "info",
  timeLimit: 250
}));

app.use(json());
app.use(session());
app.use(bodyParser());

var render = views("views/");

app.use(serve("public/"));

require("koa-qs")(app);

app.use(route.get("/", function*() {
  this.redirect("/index.html");
}));

app.listen(3000);
