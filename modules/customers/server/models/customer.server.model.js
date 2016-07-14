'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  Fname: {
    type: String,
    default: '',
    required: 'Please fill Customer name',
    trim: true
  },
    Sname: {
        type: String,
        default: '',
        required: 'Please fill Customer name',
        trim: true
    },
    phone: {
        type: String,
        default: '',
        required: 'Please fill Customer phone',
        trim: true
    },
    sa: {
        type: String,
        default: ''

    },
    city: {
        type: String,
        default: ''

    },
    state: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
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

mongoose.model('Customer', CustomerSchema);
