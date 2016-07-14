'use strict';

/**
 * Module dependencies
 */
var helpsPolicy = require('../policies/helps.server.policy'),
  helps = require('../controllers/helps.server.controller');

module.exports = function(app) {
  // Helps Routes
  app.route('/api/helps').all(helpsPolicy.isAllowed)
    .get(helps.list)
    .post(helps.create);

  app.route('/api/helps/:helpId').all(helpsPolicy.isAllowed)
    .get(helps.read)
    .put(helps.update)
    .delete(helps.delete);

  // Finish by binding the Help middleware
  app.param('helpId', helps.helpByID);
};
