var testData = require("../config/test-data.js");
var logger = require("../logger.js")

function getOnlyElement(/* Array */ arr) {
  if (arr.length === 0) {
    logger.error("Tried to get element from empty array.");
    return undefined;
  }
  if (arr.length > 1) {
    logger.error("Got only element from array with more than one element.");
    return undefined;
  }
  return arr[0];
}

function addUser(/* Object */ userDetails) {
  var newUser = {
    username: userDetails.username,
    email: userDetails.email,
    password: userDetails.password
  };

  testData.users[userDetails.username] = newUser;
}

function getUserByUsername(/* String */ username) {
  return testData.users[username];
}

function getUserDetails(/* String */ username) {
  return testData.userDetails[username];
}

function getUserPortfolios(/* String */ username) {
  return testData.userPortfolios[username];
}

function getPortfolioItems(username, portfolio, offset) {
  // TODO rather than returning a next token, can't we just return a generator and yield data to the browser!?!?
  var maxItemsToReturn = 2;
  var portfolioItems = { items: [] };

  if (testData.userPortfolioItems[username] && testData.userPortfolioItems[username][portfolio]) {
    portfolioItems['items'] = testData.userPortfolioItems[username][portfolio].slice(offset, offset + maxItemsToReturn);
    if (offset + maxItemsToReturn < testData.userPortfolioItems[username][portfolio].length) {
      portfolioItems['nextToken'] = offset + maxItemsToReturn;
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
  var newIndex = testData.portfolioArr[portfolioArr.length-1].itemId + 1;

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
  var itemId = +itemId || -1;
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
  if (!testData.userPortfolios[username]) {
    testData.userPortfolios[username] = [];
  }
  testData.userPortfolios[username].push({
    imageUrl: uploadKey,
    title: portfolioTitle,
    date: createDate,
    description: description
  });
}

function addProject(username, project) {
  testData.users[username].projects.push(project);
}

function getProject(username, projectid) {
  return getOnlyElement(testData.users[username].projects.filter(function (project) {
    return project.id === projectid;
  }));
}

function getProjectsForUser(username) {
  return testData.users[username].projects;
}

function deleteProject(username, projectid) {
  testData.users[username].projects = testData.users[username].projects.filter(function(project) {
    return project.id !== projectid;
  });
}

module.exports = {
  addUser: addUser,
  getUser: getUserByUsername,
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