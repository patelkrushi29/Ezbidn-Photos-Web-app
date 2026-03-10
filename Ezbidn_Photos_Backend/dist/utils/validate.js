"use strict";

var Validator = require('validatorjs');
var validator = function validator(body, rules, customMessages, callback) {
  var validation = new Validator(body, rules, customMessages);
  validation.passes(function () {
    return callback(null, true);
  });
  validation.fails(function () {
    return callback(validation.errors, false);
  });
};
module.exports = validator;