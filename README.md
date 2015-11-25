Generated using the [Yeoman](http://yeoman.io/) generator [koa-angular](https://github.com/prekolna/generator-koa-angular), which Yodel sponsors.  Most infrastructure changes should be contributed to the generator.

# Prerequisites
You must install:
* the most recent version of [node.js](https://nodejs.org)
* [gulp](http://gulpjs.com) (npm install -g gulp gulp-cli)
* [bower](bower.io) (npm install -g bower)

To keep up with the most recent version of node, you should install n, our recommended node version manager:

    sudo npm install -g n
    sudo n latest

If you want to perform a release, you'll need to perform release testing, so you'll definitely need n, and you may also want to install pm2, which is what we use to run the node process in prod:

    npm install -g pm2


If you want to continuously run the tests while developing, you may also want:
* [karma](http://karma-runner.github.io/0.8/index.html) (npm install -g karma karma-cli)
* [protractor](http://angular.github.io/protractor/#/) (npm install -g protractor)
* [mocha](http://mochajs.org/) (npm install -g mocha)

If you want to generate the docs, use the gulp task:

    gulp docs

The server and the logs expect a sibling directory, yodel-persistent, to exist and contain a child directory named logs (to prevent the logs from being deleted during deployments), so you may need to create one.

    mkdir -p ./yodel-persistent/logs

# Starting the server

    npm install
    gulp

then navigate to localhost:3000 in your favorite browser.  If you want to follow the logs, you'll likely want to format them from their current json format into a more human-readable format.  To do that, use the [Bunyan](https://www.npmjs.com/package/bunyan) cli:

    npm install -g bunyan
    gulp | bunyan

# Running the tests

To run the unit tests, you may need to reload the test data into staging.  [Download it](http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.zip) and extract it somewhere (I use ~/bin/dynamodb).  Once you've started it, you'll want to create the tables and load the test data:

    load-test-data staging.yodel.is

Then you'll also need to download the Selenium webdriver:

    npm install
    gulp webdriver_update
    gulp webdriver_standalone

Compile the application and install the dependencies:

    bower install
    gulp compile

And then run the tests:

    gulp test

Note that to end the mocha and test tasks, you have to manually interrupt the selenium standalone process  (ctrl + c)

# Relase testing & Releasing
Since our testing strategy is to test the second time we work on a component, there is still a fair bit of manual release testing that needs to be done.

It's important to run a `sudo n 4.2.2` before conducting release testing, since prod and staging are pinned on 4.2.2.  The images problem has some historical eccentricities, so the deploy still copies a magical folder called `images` at the root of the project into public, which is included in the deployment tarball.  A release should be as simple as:

    sudo n 4.2.2
    gulp clean
    gulp compile-prod
    pm2 start ./build/server.js
    # Manual testing goes here
    pm2 stop ./build/server.js
    ./scripts/deploy.sh -c /path/to/creds.pem -e prod

# Contributing

Currently, all style rules are enforced by our linter, [eslint](http://eslint.org/).  You can check its config, in .eslintrc, for style details, but if it builds, it's stylistically correct.  Features should be unit and end-to-end tested according to the Boy Scout Rule, which means that the second time we touch them (the first time we change the feature after it's launched in prod) should include tests.  Features that aren't fully ready to run in prod may be merged into master as part of a iterative design process, but should be feature blocked by putting it behind a feature flag.  Feature flags can be used in the markup by using an `ng-if`, or by checking `FEATURE.isEnabled(feature)`:

View:

    <div class="my-feature" ng-if="isFeatureEnabled">
      <my-feature ng-repeat="myFeature in myFeatures" info="myFeature"></my-feature>
    </div>

View controller:

    function ViewCtrl($scope, $http, FEATURE) {
      $scope.isFeatureEnabled = FEATURE.isEnabled(FEATURE.MY_FEATURE);
      if (FEATURE.isEnabled(FEATURE.MY_FEATURE)) {
        $http.get('/my/feature', function(response) { $scope.myFeatures = response.data });
      }
    }

Feature config:

    yodelApp.constant('FEATURE', {
      ...
      'MY_FEATURE': 12345678 // Random 8 digit number
    }

# Dev Ops
There are a number of scripts for running various common dev ops tasks in /scripts.  You may have to make them executable before you use them, since git doesn't perpetuate file permissions:

    chmod +x ./scripts/*

If you decide to add more scripts, great!  Please write them as a portable shell script (make sure they work with bash and zsh at least) or as a JavaScript.  If you write them as a JavaScript, make sure to add your dependencies as dev dependencies, unless you mean to have them executed regularly on the server, in which case add them as normal dependencies.  Furthermore, although linting isn't required (it won't break the build, at least), please try to follow the standard style since linting extensions to IDEs and text editors still throw warnings for scripts, and to improve readability and correctness.
