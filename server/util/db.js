var aws = require('aws-sdk');
var config = require('../config');

aws.config.update({
  region: config.aws.region,
  endpoint: config.aws.ddbEndpoint
});

var db = new aws.DynamoDB.DocumentClient();
var contact = require('../dao/contact')(db);
var event = require('../dao/event')(db);
var discipline = require('../dao/discipline')(db);
var project = require('../dao/project')(db);
var portfolio = require('../dao/portfolio')(db);
var user = require('../dao/user')(db);

module.exports = {
  // Contacts
  assignBetaToken: contact.assignBetaToken,
  createContact: contact.createContact,
  getContacts: contact.getContacts,
  getContact: contact.getContact,

  // Disciplines
  addDiscipline: discipline.addDiscipline,
  addDisciplines: discipline.addDisciplines,
  getAllDisciplines: discipline.getAllDisciplines,

  // Events
  addEvent: event.addEvent,
  getEvents: event.getEvents,

  // Portfolios
  addItemToPortfolio: portfolio.addItemToPortfolio,
  createPortfolio: portfolio.createPortfolio,
  deleteItemFromPortfolio: portfolio.deleteItemFromPortfolio,
  getPortfolioItems: portfolio.getPortfolioItems,
  getUserPortfolios: portfolio.getUserPortfolios,

  // Projects
  addProject: project.addProject,
  deleteProject: project.deleteProject,
  getProject: project.getProject,
  getProjectsForUser: project.getProjectsForUser,
  searchProjects: project.searchProjects,

  // Users
  addDisciplinesForUser: user.addDisciplinesForUser,
  addUser: user.addUser,
  getAllUsers: user.getAllUsers,
  getUser: user.getUserByUsernameOrEmail,
  searchUsers: user.searchUsers
};
