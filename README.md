Generated using the [Yeoman](http://yeoman.io/) generator [koa-angular](https://github.com/prekolna/generator-koa-angular) (still under development)

# Prerequisites
You must install:
* any version of [io.js](https://iojs.org/) OR [node.js](https://nodejs.org/) version 0.12 or higher
* [gulp](http://gulpjs.com) (npm install -g gulp gulp-cli)

If you want to continuously run the tests while developing, you may also want:
* [karma](http://karma-runner.github.io/0.8/index.html) (npm install -g karma karma-cli)
* [protractor](http://angular.github.io/protractor/#/) (npm install -g protractor)
* [mocha](http://mochajs.org/) (npm install -g mocha)

The server and the logs expect a sibling directory, yodel-persitent, to exist and contain a child directory name logs (to prevent the logs, db &c from being deleted during deployments), so you may need to create one.

# Starting the server
    npm install
    gulp

then navigate to localhost:3000 in your favorite browser.  If you want to follow the logs, you'll likely want to format them from their current json format into a more human-readable format.  To do that, use the [Bunyan](https://www.npmjs.com/package/bunyan) cli:
    npm install -g bunyan
    gulp | bunyan

# Running the tests

    npm install
    # Download the Selenium webdriver
    node_modules/protractor/bin/webdriver-manager update
    gulp compile
    gulp test

Note that to end the mocha and test tasks, you have to manually interrupt the selenium standalone process  (ctrl + c)

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

# Staged for release:
1.) Collaborators needed for project

### Note for Node.js
The gulp mocha target uses generators, which require the --harmony flag on Node.js.  So, to invoke the mocha task or the test task, gulp must be invoked using node, e.g.

    node --harmony `which gulp` test
    node --harmony `which gulp` mocha
