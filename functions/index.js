const functions = require('firebase-functions');

var admin = require("firebase-admin");

admin.initializeApp();

exports.phone = require('./phone-verify');

exports.auth = require('./auth');

exports.db = require('./db-functions');

exports.mail = require('./mail');