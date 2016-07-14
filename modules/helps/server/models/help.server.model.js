'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Help Schema
 */
var HelpSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Help name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Help', HelpSchema);
