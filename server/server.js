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

// ===========================
// Test data
// ===========================
var users = [
    {
        username: 'noel',
        email: 'noel@yodel.to',
        password: 'test'
    },
    {
        username: 'ivan',
        email: 'ivan@yodel.to',
        password: 'test'
    }
];
var userDetails = {
    'noel': {
        fullName: 'Noel Sardana',
        artistType: 'Hipster Coder',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    'ivan': {
        fullName: 'Ivan Melyakov',
        artistType: 'Coder Bro',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
};
var userPortfolios = {
    'noel': [
        {
            imageUrl: 'images/jon-snow.jpg',
            title: 'Spring Collection',
            caption: 'Flowers, trees, and bees'
        },
        {
            imageUrl: 'images/sansa.jpg',
            title: 'Winter Collection',
            caption: 'Hot cocoa and snow angels'
        }
    ],
    'ivan': [
        {
            imageUrl: 'images/tyrion.jpg',
            title: 'Sounds of Seattle',
            caption: 'There ain\'t no riot here...'
        }
    ]
};

// ===========================
// Routes
// ===========================

app.use(route.get("/", function*() {
    this.redirect("/index.html");
}));

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

app.use(route.get("/user/:username", function*(username) {
    // TODO check authorization

    this.body = [];
    if (userDetails[username]) {
        this.body = userDetails[username];
    }
}));

app.use(route.get("/user/:username/portfolio", function*(username) {
    // TODO check authorizatoin

    this.body = [];
    if (userPortfolios[username]) {
        this.body = userPortfolios[username];
    }
}));

app.listen(3000);
