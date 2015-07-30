var testData = require('../config/test-data.js');
var logger = require('../logger.js');
var uuid   = require('node-uuid');
var Loki = require('lokijs');

var databaseFile = 'yodel-db.json';
var db = new Loki(databaseFile);
// db.loadDatabase();

var disciplines = db.addCollection('disciplines', {
  indices: [ 'id' ],
  clone: true
});
var users = db.addCollection('users', {
  indices: [ 'username' ],
  clone: true
});

var userDetails = db.addCollection('userDetails', {
  indices: [ 'username', 'id' ],
  clone: true
});
var projects = db.addCollection('projects', {
  indices: [ 'username', 'id' ],
  clone: true
});
var portfolios = db.addCollection('portfolios', {
  indices: [ 'username', 'id' ],
  clone: true
});

// Doug 2015/7/26 TODO: don't reload test data in prod
users.insert(testData.users.ivan);
users.insert(testData.users.noel);

function addUser(/* Object */ userDetails) {
  var userId = uuid.v4();
  var newUser = {
    username: userDetails.username,
    id: userId,
    email: userDetails.email,
    password: userDetails.password,
    projects: []
  };

  logger.info('Created new user: ' + JSON.stringify(newUser));
  users.insert(newUser);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();

  return newUser;
}

function getUserByUsername(/* String */ username) {
  return users.by('username', username);
}

function getUserById(/* UUID */ id) {
  return users.get(id);
}

function getUserDetails(/* String */ username) {
  return userDetails.by('username', username);
}

function getUserPortfolios(/* String */ username) {
  return portfolios.by('username', username);
}

function getPortfolioItems(username, portfolio, offset) {
  // TODO rather than returning a next token, can't we just return a generator and yield data to the browser!?!?
  var maxItemsToReturn = 2;
  var portfolioItems = { items: [] };

  if (testData.userPortfolioItems[username] && testData.userPortfolioItems[username][portfolio]) {
    portfolioItems.items = testData.userPortfolioItems[username][portfolio].slice(offset, offset + maxItemsToReturn);
    if (offset + maxItemsToReturn < testData.userPortfolioItems[username][portfolio].length) {
      portfolioItems.nextToken = offset + maxItemsToReturn;
    }
  }

  return portfolioItems;
}

function addItemToPortfolio(/* String */ username, /* String */ portfolio, /* String */ uploadKey, /* String */ caption) {
  if (!testData.userPortfolioItems[username]) {
    testData.userPortfolioItems[username] = {};
  }
  if (!testData.userPortfolioItems[username][portfolio]) {
    testData.userPortfolioItems[username][portfolio] = [];
  }

  var portfolioArr = testData.userPortfolioItems[username][portfolio];
  var newIndex = testData.portfolioArr[portfolioArr.length - 1].itemId + 1;

  var newItem = {
      itemId: newIndex,
      resourceUrl: uploadKey,
      resourceType: 'picture',
      caption: addItemParams.caption,
      likes: 0,
      comments: 0
  };
  portfolioArr.push(newItem);
  return newItem;
}

function deleteItemFromPortfolio(/* String */ username, /* String */ portfolio, /* Int */ itemId) {
  itemId = +itemId || -1;
  var index = -1;

  if (testData.userPortfolioItems[username] && testData.userPortfolioItems[username][portfolio]) {
    index = testData.userPortfolioItems[username][portfolio].findIndex(function(ele) {
      return ele.itemId === itemId;
    });
  }

  if (index >= 0) {
    testData.userPortfolioItems[username][portfolio].splice(index, 1);
  }
}

function createPortfolio(
    /* String */ username,
    /* String */ portfolioTitle,
    /* Date */ createDate,
    /* String */ description,
    /* String */ uploadKey) {
  var portfolio = {
    imageUrl: uploadKey,
    title: portfolioTitle,
    date: createDate,
    description: description
  };
  portfolios.add(portfolio);
}

function addProject(project) {
  projects.add(project);
}

function getProject(projectId) {
  return projects.get(projectId);
}

function getProjectsForUser(username) {
  return projects.by('username', username);
}

function deleteProject(projectId) {
  projects.remove(projectId);
}

module.exports = {
  addUser: addUser,
  // Doug 2015/7/28 TODO: Switch this to by id.
  getUser: getUserByUsername,
  getUserById: getUserById,
  getUserDetails: getUserDetails,
  getUserPortfolios: getUserPortfolios,
  getPortfolioItems: getPortfolioItems,
  addItemToPortfolio: addItemToPortfolio,
  deleteItemFromPortfolio: deleteItemFromPortfolio,
  createPortfolio: createPortfolio,
  addProject: addProject,
  getProject: getProject,
  getProjectsForUser: getProjectsForUser,
  deleteProject: deleteProject
};
