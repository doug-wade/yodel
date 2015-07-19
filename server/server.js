var bodyParser = require("koa-bodyparser");
var bunyan     = require("koa-bunyan");
var config     = require("./config/config.js");
var fs         = require("fs");
var json       = require("koa-json");
var jwt        = require("koa-jwt");
var koa        = require("koa");
var logger     = require("./logger.js");
var parse      = require("co-body");
var multiparse = require("co-busboy");
var route      = require("koa-route");
var s3stream   = require('s3-upload-stream');
var serve      = require("koa-static");
var session    = require("koa-session");
var validate   = require("koa-validate");
var views      = require("co-views");
var aws        = require("aws-sdk");

var app        = module.exports = koa();

app.use(bunyan(logger, {
    level: "info",
    timeLimit: 250
}));

aws.config.region = config.aws.region;
var s3UploadStream = s3stream(new aws.S3());

app.use(jwt({secret: config.jwtAuthSecret}).unless({ path : [
    /^\/$/,
    /^\/favico\.ico/,
    /^\/css/,
    /^\/images/,
    /^\/js/,
    /^\/login/,
    /^\/public/,
    /^\/scripts/,
    /^\/signup/,
    /^\/vendor/,
    /^\/resource/
]}));

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
var users = {
    'noel': {
        username: 'noel',
        email: 'noel@yodel.to',
        password: 'testtest',
    },
    'ivan': {
        username: 'ivan',
        email: 'ivan@yodel.to',
        password: 'testtest',
    }
};
var userDetails = {
    'noel': {
        fullName: 'Noel Sardana',
        artistType: 'Hipster Coder',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        banner: 'noel/banner.jpg'
    },
    'ivan': {
        fullName: 'Ivan Melyakov',
        artistType: 'Coder Bro',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        banner: 'ivan/banner.png',
        profilePic: 'ivan/profile.jpg'
    }
};
var userPortfolios = {
    'noel': [
        {
            imageUrl: 'noel/spring.jpg',
            title: 'Spring Collection',
            date: Date.now(),
            description: 'Flowers, trees, and bees'
        },
        {
            imageUrl: 'noel/winter.jpg',
            title: 'Winter Collection',
            date: Date.now(),
            description: 'Hot cocoa and snow angels'
        }
    ],
    'ivan': [
        {
            imageUrl: 'ivan/seattle.jpg',
            title: 'Sounds of Seattle',
            date: Date.now(),
            description: 'There ain\'t no riot here...'
        }
    ]
};
var userPortfolioItems = {
    'noel': {
        'Spring Collection': [
            {
                resourceUrl: 'someUrl',
                resourceType: 'picture',
                caption: 'pink rose',
                likes: 2,
                comments: 2
            },
            {
                resourceUrl: 'someOtherUrl',
                resourceType: 'picture',
                caption: 'a raven',
                likes: 20,
                comments: 500
            }
        ],
        'Winter Collection': []
    },
    'ivan': {
        'Sounds of Seattle': [
            {
                resourceUrl: 'someThirdUrl',
                resourceType: 'lyric',
                caption: 'edibles',
                likes: 1000000,
                comments: 0
            }
        ]
    }
};

var disciplines =
    [
        { "text" : "Artist", "checked" : false, "types" : [{"text" : "Studio Art", "checked" : false}, {"text" : "Hipster Art", "checked" : false}] },
        { "text" : "Musician", "checked" : false, "types" : [{"text" : "Folk Music", "checked" : false}, {"text" : "Thrash Metal", "checked" : false}] },
        { "text" : "Dancer", "checked" : false, "types" : [{"text" : "Ballet", "checked" : false}, {"text" : "Breakdance", "checked" : false}] },
        { "text" : "Actor", "checked" : false, "types" : [{"text" : "Theatre", "checked" : false}, {"text" : "Movie", "checked" : false}] },
        { "text" : "Sculptor", "checked" : false, "types" : [{"text" : "Bronze", "checked" : false}, {"text" : "Wood", "checked" : false}] },
        { "text" : "Singer", "checked" : false, "types" : [{"text" : "Opera", "checked" : false}, {"text" : "Yodeling", "checked" : false}] },
        { "text" : "Coder", "checked" : false, "types" : [{"text" : "C++", "checked" : false}, {"text" : "Javascript", "checked" : false}] },
        { "text" : "Acrobat", "checked" : false, "types" : [{"text" : "Circus", "checked" : false}, {"text" : "Kamasutra", "checked" : false}]},
        { "text" : "Pantomime", "checked" : false, "types" : [{"text" : "French Guy", "checked" : false}, {"text" : "Hipster Mime", "checked" : false}] },
        { "text" : "Poet", "checked" : false, "types" : [{"text" : "Postmodern", "checked" : false}, {"text" : "Slam Poetry", "checked" : false}] },
        { "text" : "Model", "checked" : false, "types" : [{"text" : "Hand", "checked" : false}, {"text" : "Full Body", "checked" : false}] },
        { "text" : "Photographer", "checked" : false, "types" : [{"text" : "War", "checked" : false}, {"text" : "Guerrila", "checked" : false}] }
    ];

// ===========================
// Routes
// ===========================

app.use(route.get("/", function*() {
    this.redirect("/index.html");
}));

app.use(route.post("/login", function*() {
    // basic login validation
    this.checkBody('username').notEmpty();
    this.checkBody('password').notEmpty();
    if (this.errors) {
        this.status = 400;
        this.body = this.errors;
        return;
    }

    var login = this.request.body;
    var user = getUser(login.username);
    if (isInvalidPassword(user, login.password)) {
        this.status = 401;
        this.body = 'Unauthorized';
        return;
    }

    this.body = {
        username: user.username,
        token: jwt.sign(constructProfile(user), config.jwtAuthSecret, { expiresInMinutes: 60 })
    };

    function getUser(/* String */ username) {
        return users[username];
    }

    function isInvalidPassword(/* Object */ user, /* String */ password) {
        return user === undefined || user.password !== password;
    }
}));

function constructProfile(/* Object */ user) {
    return {
        username: user.username,
        email: user.email
    };
}

app.use(route.post("/signup", function*() {
    // basic signup validation
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

    users[signup.username] = { username: signup.username, email: signup.email, password: signup.password1 };

    this.body = {
        username: signup.username,
        token: jwt.sign(constructProfile(signup), config.jwtAuthSecret, { expiresInMinutes: 60 })
    };

    function isUsernameTaken(/* String */ username) {
        return users[username] !== undefined;
    }
}));

app.use(route.get("/user/:username", function*(username) {
    // TODO check authorization (access control)

    this.body = [];
    if (userDetails[username]) {
        this.body = userDetails[username];
    }
}));

app.use(route.get("/user/:username/portfolio", function*(username) {
    // TODO check authorization (access control)

    this.body = [];
    if (userPortfolios[username]) {
        this.body = userPortfolios[username];
    }
}));

app.use(route.get("/user/:username/portfolio/:portfolio", function*(username, portfolio) {
    // TODO check authorization (access control)

    this.body = [];
    if (userPortfolioItems[username] && userPortfolioItems[username][portfolio]) {
        this.body = userPortfolioItems[username][portfolio];
    }
}));

app.use(route.post("/user/:username/portfolio", function*(username) {
    // TODO check authorization (access control)

    if (!this.request.is('multipart/*')) {
        return yield next;
    }

    var parts = multiparse(this);
    var part;
    var createParams;
    var context = {};
    var uploadKey = username + '/' + (Date.now());
    var upload = getUploadWriteStream(uploadKey);

    while (part = yield parts) {
        if (part.length && part[0] === 'createParams') {
            createParams = JSON.parse(part[1]);
            checkParams('title').notEmpty();
            checkParams('date').isDate();

            if (context.errors) {
                this.status = 400;
                this.body = context.errors;
                return;
            }
        } else {
            part.pipe(upload);
        }
    }

    if (!userPortfolios[username]) {
        userPortfolios[username] = [];
    }
    userPortfolios[username].push({
        imageUrl: uploadKey,
        title: createParams.title,
        date: createParams.date,
        description: createParams.description
    });

    this.body = 'success';

    function checkParams(key) {
        return new validate.Validator(context, key, createParams[key], key in createParams, createParams);
    }

    function getUploadWriteStream(key) {
        var root = __dirname + '/../' + config.aws.yodelS3Bucket;

        try {
            fs.lstatSync(root + '/' + username);
        } catch (e) {
            fs.mkdir(root + '/' + username);
        }

        var stream = fs.createWriteStream(__dirname + '/../' + config.aws.yodelS3Bucket + '/' + key);
        stream.on('error', function(error) { logger.error(error); });
        return fs.createWriteStream('./' + config.aws.yodelS3Bucket + '/' + key);
    }

    // TODO uncomment to enable s3 uploading strategy
//    function getUploadWriteStream(key) {
//        var upload = s3UploadStream.upload({ 'Bucket': config.aws.yodelS3Bucket, 'Key': uploadKey });
//        upload.on('error', function (error) { logger.error(error); });
//        return upload;
//    }
}));

app.use(route.get("/resource/:username/:resourceId", function*(username, resourceId) {
    // TODO how to determine the proper type
    this.body = fs.createReadStream(__dirname + '/../' + config.aws.yodelS3Bucket + '/' + username + '/' + resourceId);

    // TODO uncomment to serve from s3
//    var params = { Bucket: config.aws.yodelS3bucket, Key: username + '/' + resourceId };
//    this.body = s3.getObject(params).createReadStream();
}));

//app.use(route.put("/put/:resourceId/:resource", function*(resourceId, resource){
//   //TODO: read post body not the /:resource string, this is a test
//   var params = {Key: resourceId, Body: resource};
//    s3.upload(params, function(err, data) {
//    if (err) {
//      this.status = 400;
//      this.body = "Error uploading data: " + err;
//    } else {
//      this.status = 200;
//      this.body = "Successfully uploaded data to " + s3bucket;
//    }
//  });
//}));

app.use(route.get("/user/:username/disciplines", function*(username){
    logger.info("getting disciplines for " + username);
    this.body = disciplines;
}));

app.use(route.post("/user/:username/disciplines", function*(username){
    logger.info(this.request.body);
    this.status = 200;
    /* TODO : Store these disciplines in association with a particular username here */
    users[username]['disciplines'] = this.body;
    this.body = "'Success'";
}));

app.listen(3000);
