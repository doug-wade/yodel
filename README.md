Generated using the [Yeoman](http://yeoman.io/) generator [koa-angular](https://github.com/prekolna/generator-koa-angular) (still under development)

# Prerequisites
You must install:
* the most recent version of [node.js](https://nodejs.org)
* [gulp](http://gulpjs.com) (npm install -g gulp gulp-cli)
* [bower](bower.io) (npm install -g bower)

To keep up with the most recent version of node, you should install n, our recommended node version manager:

    sudo npm install -g n
    sudo n latest

If you want to perform a release, you'll need to perform release testing, so you'll definitely need n, and you may also want to install forever, which is what we use to run the node process in prod:

        npm install -g forever


If you want to continuously run the tests while developing, you may also want:
* [karma](http://karma-runner.github.io/0.8/index.html) (npm install -g karma karma-cli)
* [protractor](http://angular.github.io/protractor/#/) (npm install -g protractor)
* [mocha](http://mochajs.org/) (npm install -g mocha)

The server and the logs expect a sibling directory, yodel-persitent, to exist and contain a child directory name logs (to prevent the logs, db &c from being deleted during deployments), so you may need to create one.

    mkdir -p ./yodel-persistent/logs

# Starting the server
    npm install
    gulp

then navigate to localhost:3000 in your favorite browser.  If you want to follow the logs, you'll likely want to format them from their current json format into a more human-readable format.  To do that, use the [Bunyan](https://www.npmjs.com/package/bunyan) cli:
    npm install -g bunyan
    gulp | bunyan

# Running the tests

    npm install
    gulp webdriver_update
    gulp webdriver_standalone
    gulp compile
    gulp test

Note that to end the mocha and test tasks, you have to manually interrupt the selenium standalone process  (ctrl + c)

# Relase testing & Releasing
Since our testing strategy is to test the second time we work on a component, there is still a fair bit of manual release testing that needs to be done.

It's important to run a `sudo n latest` before conducting release testing, since the deploy script updates node to the most recent version.  The images problem is not entirely solved currently, so the deploy copies a magical folder called `images` at the root of the project into public, which is included in the deployment.  A release should be as simple as:

    sudo n latest
    gulp clean
    gulp compile-prod
    forever start ./build/server.js
    # Manual testing goes here
    forever stop ./build/server.js
    ./deploy.sh /path/to/creds.pem

# TODOs:
1.) Contact us - Google docs integration
2.) Fix Portfolios
3.) Fix multipart uploads
4.) Add image to project
5.) Update test data for ivan and noel so I can log in
6.) Attend events
7.) Projects -> Events
8.) Event Calendar
9.) User types
10.) HTTP2/SPDY support
11.) Sign-up organization
12.) Sign-up patron
13.) Event compact view
14.) Event button candybar
15.) Restyle sidebar
16.) Event "more details" rollover
17.) Buy tickets
18.) Project page
