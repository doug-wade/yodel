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

var users = [];
app.use(route.post("/login", function*() {
    var login = this.request.body;

    this.status = 400;
    if (!login) {
        this.body = 'Must provide a username';
    } else if (!login.username) {
        this.body = 'Must provide a username';
    } else if (!login.password) {
        this.body = 'Must provide a password';
    } else {
        this.status = 401;
        var username = login.username;
        var matchingUsers = users.filter(function(element) { return element.username === username });
        if (matchingUsers.length === 0) {
            this.body = 'Unauthorized';
        } else if (matchingUsers[0].password !== login.password) {
            this.body = 'Unauthorized';
        } else {
            this.status = 200;
            this.body = 'success';
        }
    }
}));

app.use(route.post("/signup", function*() {
    var signup = this.request.body;

    // signup validation
    this.status = 400;
    if (!signup) {
        this.body = 'Must provide a username'
    } else if (!signup.username) {
        this.body = 'Must provide a username';
    } else if (!signup.email) {
        this.body = 'Must provide an email';
    } else if (!signup.password1) {
        this.body = 'Must provide a password';
    } else if (!signup.password2) {
        this.body = 'Must confirm password';
    } else if (signup.password1.length < 6) {
        this.body = 'Password must be at least 6 characters long';
    } else if (signup.password1 !== signup.password2) {
        this.body = 'Passwords must match';
    } else if (isUsernameTaken(signup.username)) {
        this.body = 'Username is in use';
    } else {
        users.push({ username: signup.username, email: signup.email, password: signup.password1 });
        this.body = 'success';
        this.status = 200;
    }

    function isUsernameTaken(username) {
        var matchingUsers = users.filter(function(element) { return element.username === username; });
        return matchingUsers.length > 0;
    }
}));

app.listen(3000);
