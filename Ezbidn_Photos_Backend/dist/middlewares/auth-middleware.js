"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBasicAuth = exports.isAuth = exports.blockHtmlMiddleware = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _utils = require("../utils");
var _en = _interopRequireDefault(require("../utils/en.json"));
var _userModel = require("../models/userModel");
// This middleware function is used ot implement Basic Auth - 
var isBasicAuth = exports.isBasicAuth = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, auth, user, pass;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.header('authorization');
          if (token) {
            _context.next = 6;
            break;
          }
          (0, _utils.unauthorizedAccess)(res, _en["default"].ACCESS_DENIED);
          _context.next = 14;
          break;
        case 6:
          auth = new Buffer.from(token.split(' ')[1], 'base64').toString().split(':');
          user = auth[0];
          pass = auth[1];
          if (!(user == process.env.PUBLIC_ACCESS_USERNAME && pass == process.env.PUBLIC_ACCESS_PASS)) {
            _context.next = 13;
            break;
          }
          next();
          _context.next = 14;
          break;
        case 13:
          return _context.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].UNAUTHENTICATED));
        case 14:
          _context.next = 19;
          break;
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", utils.unauthorizedAccess(res, _context.t0.code === 'ERR_INVALID_ARG_TYPE' ? _en["default"].INVALID_TOKEN : _en["default"].UNAUTHORIZED));
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 16]]);
  }));
  return function isBasicAuth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// This middleware function is for all logedin users
var isAuth = exports.isAuth = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var token, decoded, userid, checkdata;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          token = req.header('x-auth-token');
          if (token) {
            _context2.next = 6;
            break;
          }
          (0, _utils.unauthorizedAccess)(res, _en["default"].ACCESS_DENIED);
          _context2.next = 21;
          break;
        case 6:
          decoded = _jsonwebtoken["default"].verify(token, process.env.SECRET);
          if (!decoded) {
            _context2.next = 20;
            break;
          }
          userid = decoded.data.id;
          _context2.next = 11;
          return (0, _userModel.userById)(userid);
        case 11:
          checkdata = _context2.sent;
          if (checkdata) {
            _context2.next = 16;
            break;
          }
          return _context2.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].UNAUTHORIZED));
        case 16:
          req.auth = decoded.data;
          next();
        case 18:
          _context2.next = 21;
          break;
        case 20:
          return _context2.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].UNAUTHORIZED));
        case 21:
          _context2.next = 26;
          break;
        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", (0, _utils.unauthorizedAccess)(res, _context2.t0.name === 'TokenExpiredError' ? _en["default"].TOKEN_EXPIRED : _en["default"].UNAUTHORIZED));
        case 26:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 23]]);
  }));
  return function isAuth(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var containsDangerousContent = function containsDangerousContent(input) {
  var htmlRegex = /<\/?[a-z][\s\S]*>/i; // Detects any HTML tags
  var scriptRegex = /<script.*?>.*?<\/script>/i; // Detects <script> tags
  return htmlRegex.test(input) || scriptRegex.test(input);
};
var validateInput = function validateInput(input) {
  return !(typeof input === 'string' && containsDangerousContent(input));
};

// This middleware function is to detect HTML tags or JavaScript code
var blockHtmlMiddleware = exports.blockHtmlMiddleware = function blockHtmlMiddleware(req, res, next) {
  var customMsg = _en["default"].INVALID_CONTENT;
  try {
    // Check query parameters
    for (var key in req.query) {
      if (!validateInput(req.query[key])) {
        return badRequest(res, customMsg);
      }
    }
    // Check body parameters
    for (var _key in req.body) {
      if (!validateInput(req.body[_key])) {
        return badRequest(res, customMsg);
      }
    }
    // Check headers
    for (var _key2 in req.headers) {
      if (!validateInput(req.headers[_key2])) {
        return badRequest(res, customMsg);
      }
    }
    next(); // Proceed if no dangerous content is found
  } catch (err) {
    console.log("aaaaaaaaaaaaaaa", err);
    return (0, _utils.serverError)(res, _en["default"].SERVER_ERROR);
  }
};