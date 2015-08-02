var testData = require('../config/test-data.js');
var fs = require('fs');
var logger = require('../logger.js');
var uuid   = require('node-uuid');
var Loki = require('lokijs');

var databaseFile, db, disciplines, portfolios, projects, userDetails, users;

function loadSchema() {
  logger.info('Loading schema...');
  disciplines = db.addCollection('disciplines', {
    indices: [ 'id' ],
    clone: true
  });
  portfolios = db.addCollection('portfolios', {
    indices: [ 'username', 'id' ],
    clone: true
  });
  projects = db.addCollection('projects', {
    indices: [ 'username', 'id' ],
    clone: true
  });
  userDetails = db.addCollection('userDetails', {
    indices: [ 'username', 'id' ],
    clone: true
  });
  users = db.addCollection('users', {
    indices: [ 'username' ],
    clone: true
  });
}

function loadTestData() {
  logger.info('Loading testData...');
  // Doug 2015/7/26 TODO: don't reload test data in prod
  users.insert(testData.users.ivan);
  users.insert(testData.users.noel);
  users.ensureUniqueIndex('username');

  userDetails.insert(testData.userDetails.ivan);
  userDetails.insert(testData.userDetails.noel);
  userDetails.ensureUniqueIndex('username');

  testData.projects.forEach(function (project) {
    projects.insert(project);
  });

  testData.disciplines.forEach(function (discipline) {
    disciplines.insert(discipline);
  });

  db.saveDatabase();
}

function addDiscipline(discpline) {
  disciplines.insert(discpline);
}

function updateDisciplinesForUser(username, disciplinesToAdd) {
  logger.info('username: ' + username);
  users.ensureUniqueIndex('username');
  var toUpdate = users.by('username', username);
  toUpdate.disciplines = disciplinesToAdd;
  // Resync the indexes of the collection
  users.update(toUpdate);
}

function addUser(/* Object */ details) {
  var userId = uuid.v4();
  var newUser = {
    username: details.username,
    id: userId,
    email: details.email,
    password: details.password,
    projects: []
  };

  logger.info('Created new user: ' + JSON.stringify(newUser));
  users.insert(newUser);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();

  return newUser;
}

function getAllDisciplines() {
  // TODO: I'm not sure why I keep returning an empty list.
  // return disciplines.where(function(){ return true; });
  return testData.disciplines;
}

function getUserByUsername(/* String */ username) {
  users.ensureUniqueIndex('username');
  return users.by('username', username);
}

function getUserById(/* UUID */ id) {
  return users.get(id);
}

function getUserDetails(/* String */ username) {
  return userDetails.by('username', username);
}

function getUserPortfolios(/* String */ username) {
  return portfolios.find({ 'username': username });
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
      caption: caption,
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
    index = testData.userPortfolioItems[username][portfolio].findIndex(function(elem) {
      return elem.itemId === itemId;
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
  logger.info('Inserting project into db', project);
  projects.insert(project);
  db.saveDatabase();
}

function getProject(projectId) {
  return projects.get(projectId);
}

function getProjectsForUser(username) {
  return projects.find({ 'username': username });
}

function deleteProject(projectId) {
  projects.remove(projectId);
}

function initialize() {
  databaseFile = 'build/yodel-db.json';
  logger.info('Creating database, to be saved to file ' + databaseFile);
  db = new Loki(databaseFile);
  fs.access(databaseFile, fs.W_OK, function(err) {
    if (err) {
      loadSchema();
      loadTestData();
    } else {
      db.loadDatabase();
      loadSchema();
    }
  });
}

initialize();

module.exports = {
  addDiscipline: addDiscipline,
  addUser: addUser,
  getAllDisciplines: getAllDisciplines,
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
  deleteProject: deleteProject,
  updateDisciplinesForUser: updateDisciplinesForUser
};
