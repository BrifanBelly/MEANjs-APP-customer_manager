'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Help = mongoose.model('Help'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Help
 */
exports.create = function(req, res) {
  var help = new Help(req.body);
  help.user = req.user;

  help.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(help);
    }
  });
};

/**
 * Show the current Help
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var help = req.help ? req.help.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  help.isCurrentUserOwner = req.user && help.user && help.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(help);
};

/**
 * Update a Help
 */
exports.update = function(req, res) {
  var help = req.help ;

  help = _.extend(help , req.body);

  help.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(help);
    }
  });
};

/**
 * Delete an Help
 */
exports.delete = function(req, res) {
  var help = req.help ;

  help.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(help);
    }
  });
};

/**
 * List of Helps
 */
exports.list = function(req, res) { 
  Help.find().sort('-created').populate('user', 'displayName').exec(function(err, helps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(helps);
    }
  });
};

/**
 * Help middleware
 */
exports.helpByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Help is invalid'
    });
  }

  Help.findById(id).populate('user', 'displayName').exec(function (err, help) {
    if (err) {
      return next(err);
    } else if (!help) {
      return res.status(404).send({
        message: 'No Help with that identifier has been found'
      });
    }
    req.help = help;
    next();
  });
};
