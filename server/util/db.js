var testData = require('../test-data.js');
var fs = require('fs');
var logger = require('../logger.js');
var uuid   = require('node-uuid');
var Loki = require('lokijs');

var databaseFile, db, hasRun, schema;

schema = {
  disciplines: 'disciplines',
  portfolios: 'portfolios',
  projects: 'projects',
  users: 'users',
  userDetails: 'userDetails'
};

function loadSchema() {
  logger.info('Loading schema...');
  db.addCollection(schema.disciplines, {
    indices: [ 'id' ]
  });
  db.addCollection(schema.portfolios, {
    indices: [ 'username', 'id' ]
  });
  db.addCollection(schema.projects, {
    indices: [ 'username', 'id' ]
  });
  db.addCollection(schema.userDetails, {
    indices: [ 'username', 'id' ]
  });
  db.addCollection(schema.users, {
    indices: [ 'username' ]
  });
}

function loadTestData() {
  logger.info('Loading testData...');
  // Doug 2015/7/26 TODO: don't reload test data in prod
  var users = db.getCollection(schema.users);
  users.insert(testData.users.ivan);
  users.insert(testData.users.noel);
  users.ensureUniqueIndex('username');

  var userDetails = db.getCollection(schema.userDetails);
  userDetails.insert(testData.userDetails.ivan);
  userDetails.insert(testData.userDetails.noel);
  userDetails.ensureUniqueIndex('username');

  var projects = db.getCollection(schema.projects);
  testData.projects.forEach(function (project) {
    projects.insert(project);
  });

  testData.disciplines.forEach(function (discipline) {
    var disciplines = db.getCollection(schema.disciplines);
    disciplines.insert(discipline);
  });

  db.saveDatabase();
}

function addDisciplines(/* Object[] */ disciplinesToAdd) {
  var disciplines = db.getCollection(schema.disciplines);
  logger.info(disciplinesToAdd);
  disciplinesToAdd.forEach(function(discipline) {
    logger.info('Adding discipline to db: ', discipline);
    disciplines.insert(discipline);
  });

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();
}

function addDisciplinesForUser(/* String */ username, /* Object[] */ disciplinesToAdd) {
  var toUpdate, users;

  logger.info('Adding disciplines for user ' + username, disciplinesToAdd);
  users = db.getCollection(schema.users);
  toUpdate = users.find({ username: username })[0];

  toUpdate.disciplines = toUpdate.disciplines.concat(disciplinesToAdd);
  logger.info('Updating user ', toUpdate);
  // Resync the indexes of the collection
  users.update(toUpdate);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();
}

function addUser(/* Object */ details) {
  var newUser, userId;
  userId = uuid.v4();
  newUser = {
    username: details.username,
    id: userId,
    email: details.email,
    password: details.password,
    disciplines: []
  };
  var users = db.getCollection(schema.users);

  logger.info('Created new user: ' + JSON.stringify(newUser));
  users.insert(newUser);

  logger.info('Persisting database state to ' + databaseFile);
  db.saveDatabase();

  return newUser;
}

function getAllDisciplines() {
  var disciplines = db.getCollection(schema.disciplines);
  var toReturn = disciplines.where(() => { return true;  });
  return toReturn;
}

function getUserByUsername(/* String */ username) {
  var user, users;
  users = db.getCollection(schema.users);
  try {
    user = users.find({ username: username })[0];
    logger.info('user logged in: ', user);
    return user;
  } catch (e) {
    logger.error(e);
  }
}

function getUserById(/* UUID */ id) {
  var users = db.getCollection(schema.users);
  return users.get(id);
}

function getUserDetails(/* String */ username) {
  var userDetails = db.getCollection(schema.userDetails);
  return userDetails.find({ 'username': username });
}

function getUserPortfolios(/* String */ username) {
  var portfolios = db.getCollection(schema.portfolios);
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
  var portfolios = db.getCollection(schema.portfolios);
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
  var projects = db.getCollection(schema.projects);
  return projects.get(projectId);
}

function getProjectsForUser(username) {
  var projects = db.getCollection(schema.projects);
  return projects.find({ 'username': username });
}

function deleteProject(projectId) {
  var projects = db.getCollection(schema.projects);
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
  addDisciplines: addDisciplines,
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
