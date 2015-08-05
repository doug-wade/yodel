var testData = require('../config/test-data.js');
var fs = require('fs');
var logger = require('../logger.js');
var uuid   = require('node-uuid');
var Loki = require('lokijs');

var databaseFile, db, disciplines, hasRun, portfolios, projects, userDetails, users;

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

function addDiscipline(/* Object */ discipline) {
  disciplines.insert(discipline);
}

function addDisciplinesForUser(/* String */ username, /* Object[] */ disciplinesToAdd) {
  logger.info('username: ' + username);
  var toUpdate = users.by('username', username);
  toUpdate.disciplines.concat(disciplinesToAdd);
  // Resync the indexes of the collection
  users.update(toUpdate);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();
}

function addUser(/* Object */ details) {
  var userId = uuid.v4();
  var newUser = {
    username: details.username,
    id: userId,
    email: details.email,
    password: details.password,
    disciplines: []
  };

  logger.info('Created new user: ' + JSON.stringify(newUser));
  users.insert(newUser);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();

  return newUser;
}

function getAllDisciplines() {
  // TODO: Doug 2015/8/2 I'm not sure why I keep returning an empty list when I don't override the
  // discipline object, but it's bad practice and we should refactor it out.
  var disciplines = db.getCollection('disciplines');
  var toReturn = disciplines.where(() => { return true;  });
  return toReturn;
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

function getPortfolioItems( /* String */ username, /* Object */ portfolio, /* int */ offset) {
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
  var projects = db.getCollection('projects');
  projects.insert(project);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();
}

function getProject(projectId) {
  return projects.get(projectId);
}

function getProjectsForUser(username) {
  var projects = db.getCollection('projects');
  return projects.find({ 'username': username });
}

function deleteProject(projectId) {
  projects.remove(projectId);
}

function initialize() {
  if (!hasRun){
    hasRun = true;
    databaseFile = 'yodel88/yodel-db.json';
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
  } else {
    logger.info('database already initialized; skipping');
  }
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
  addDisciplinesForUser: addDisciplinesForUser
};
