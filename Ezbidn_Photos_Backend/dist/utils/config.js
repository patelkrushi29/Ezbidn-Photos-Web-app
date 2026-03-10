"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEnvVar = exports.getDBDetails = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv["default"].config();
var incidentCredentials = {
  INCIDENT_ACCESS_TOKEN: process.env.INCIDENT_ACCESS_TOKEN,
  INCIDENT_ACCESS_TYPE: process.env.INCIDENT_ACCESS_TYPE
};

// Function to update environment variable
var updateEnvVar = exports.updateEnvVar = function updateEnvVar(data) {
  incidentCredentials.INCIDENT_ACCESS_TOKEN = data.access_token;
  incidentCredentials.INCIDENT_ACCESS_TYPE = data.token_type;
};
var getDBDetails = exports.getDBDetails = function getDBDetails() {
  return incidentCredentials;
};