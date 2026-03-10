"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoles = exports.unauthorizedAccess = exports.successRequest = exports.serverError = exports.repliyFlag = exports.putMethod = exports.providerTypes = exports.postMethod = exports.orderStatus = exports.notVerified = exports.noRecordFound = exports.jwtToken = exports.imageTypes = exports.headers = exports.getMethod = exports.emailNotExist = exports.deviceTypes = exports.deleteMethod = exports.badRequest = exports.alreadyRegisteredUser = exports.alreadyOtherSocialUser = exports.alreadyExist = exports.agent = exports.OTP = void 0;
exports.validationError = validationError;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _HttpStatus = _interopRequireDefault(require("./HttpStatus"));
var _en = _interopRequireDefault(require("./en.json"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function validationError(res, err) {
  var message = err || _en["default"].VALIDATION_ERROR;
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].badRequest,
    message: message,
    status: false
  });
}
var alreadyExist = exports.alreadyExist = function alreadyExist(res, msg, data) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].existCode,
    message: msg,
    status: false,
    data: data
  });
};
var serverError = exports.serverError = function serverError(res, err) {
  var message = _en["default"].SERVER_ERROR;
  if ((err === null || err === void 0 ? void 0 : err.code) == "ER_DATA_TOO_LONG") {
    var msgArr = err.sqlMessage.split(/'/);
    var fieldName = msgArr[1] ? " for ".concat(msgArr[1].split("_").join(" ")) : "";
    message = _en["default"].DATA_LONG_ERROR + fieldName;
  } else if ((err === null || err === void 0 ? void 0 : err.code) == "ER_BAD_NULL_ERROR") {
    message = err.sqlMessage;
  } else if ((err === null || err === void 0 ? void 0 : err.code) == "ER_NO_REFERENCED_ROW_2") {
    message = _en["default"].REFERENCE_ERROR;
  } else if ((err === null || err === void 0 ? void 0 : err.code) == "ENOTFOUND") {
    message = _en["default"].SERVER_ERROR;
  } else if (err !== null && err !== void 0 && err.message) {
    message = err.message;
  }
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].internalServerError,
    message: message,
    status: false
  });
};
var notVerified = exports.notVerified = function notVerified(res, msg) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].contentDifferent,
    message: msg,
    status: false
  });
};
var successRequest = exports.successRequest = function successRequest(res, msg, data) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].success,
    message: msg,
    status: true,
    data: data
  });
};
var badRequest = exports.badRequest = function badRequest(res, msg) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].badRequest,
    message: msg,
    status: false
  });
};
var emailNotExist = exports.emailNotExist = function emailNotExist(res) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].emailNotExistCode,
    message: _en["default"].EMAIL_NOT_EXIST,
    status: false
  });
};
var unauthorizedAccess = exports.unauthorizedAccess = function unauthorizedAccess(res, msg) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].unauthorized,
    message: msg,
    status: false
  });
};
var noRecordFound = exports.noRecordFound = function noRecordFound(res) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].noDataFoundCode,
    message: _en["default"].NO_RECORD_FOUND,
    status: "fail"
  });
};
var alreadyRegisteredUser = exports.alreadyRegisteredUser = function alreadyRegisteredUser(res) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].alreadyRegisteredUserCode,
    message: _en["default"].REGISTERED_USER_EXIST,
    status: false
  });
};
var alreadyOtherSocialUser = exports.alreadyOtherSocialUser = function alreadyOtherSocialUser(res) {
  return res.status(_HttpStatus["default"].success).json({
    customcode: _HttpStatus["default"].alreadyOtherSocialUserCode,
    message: _en["default"].SOCIAL_USER_EXIST,
    status: false
  });
};

// Other Functions

var jwtToken = exports.jwtToken = function jwtToken(row) {
  return _jsonwebtoken["default"].sign({
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    data: _objectSpread({}, row)
  }, process.env.SECRET);
};
var OTP = exports.OTP = function OTP() {
  return Math.floor(100000 + Math.random() * 900000);
};
var deviceTypes = exports.deviceTypes = ["web", "ios", "android"];
var providerTypes = exports.providerTypes = ["google", "facebook"];
var userRoles = exports.userRoles = {
  Admin: "admin",
  User: "user",
  Guest: "guest"
};
var imageTypes = exports.imageTypes = ["local", "google", "facebook", "instagram"];
var repliyFlag = exports.repliyFlag = [0, 1, "0", "1"];
var orderStatus = exports.orderStatus = ['processing', 'shipped', 'completed'];
var getMethod = exports.getMethod = "GET";
var postMethod = exports.postMethod = "POST";
var putMethod = exports.putMethod = "PUT";
var deleteMethod = exports.deleteMethod = "DELETE";
var agent = exports.agent = "";
var headers = exports.headers = {
  "User-Agent": "application/json",
  "Content-Type": "application/json"
};