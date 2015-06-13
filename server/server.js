var bodyParser = require("koa-bodyparser");
var bunyan     = require("koa-bunyan");
var json       = require("koa-json");
var koa        = require("koa");
var logger     = require("./logger.js");
var parse      = require("co-body");
var route      = require("koa-route");
var serve      = require("koa-static");
var session    = require("koa-session");
var validate   = require("koa-validate");
var views      = require("co-views");

var app        = module.exports = koa();

app.use(bunyan(logger, {
    level: "info",
    timeLimit: 250
}));

app.use(json());
app.use(session());
app.use(bodyParser());
app.use(validate());

var render = views("views/");

app.use(serve("public/"));

require("koa-qs")(app);

app.use(route.get("/", function*() {
    this.redirect("/index.html");
}));

var users = [];
app.use(route.post("/login", function*() {
    this.checkBody('username').notEmpty();
    this.checkBody('password').notEmpty();
    if (this.errors) {
        this.status = 400;
        this.body = this.errors;
        return;
    }

    var login = this.request.body;
    var username = login.username;
    var matchingUsers = users.filter(function(element) { return element.username === username });
    if (matchingUsers.length === 0 || matchingUsers[0].password !== login.password) {
        this.status = 401;
        this.body = 'Unauthorized';
        return;
    }

    this.status = 200;
    this.body = 'success';
}));

app.use(route.post("/signup", function*() {
    var signup = this.request.body;
    this.checkBody('username').notEmpty();
    this.checkBody('email').isEmail();
    this.checkBody('password1').notEmpty().len(6);
    this.checkBody('password2').notEmpty().eq(signup.password1, 'Passwords must match');

    if (isUsernameTaken(signup.username)) {
        if (!this.errors) {
            this.errors = [];
        }
        this.errors.push({ username: 'Username is taken' });
    }

    if (this.errors) {
        this.status = 400;
        this.body = this.errors;
        return;
    }

    users.push({ username: signup.username, email: signup.email, password: signup.password1 });
    this.body = 'success';

    function isUsernameTaken(username) {
        var matchingUsers = users.filter(function(element) { return element.username === username; });
        return matchingUsers.length > 0;
    }
}));

app.listen(3000);
