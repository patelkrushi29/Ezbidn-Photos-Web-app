"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _userController = _interopRequireDefault(require("../controllers/userController"));
var _adminController = _interopRequireDefault(require("../controllers/adminController"));
var _inmateController = _interopRequireDefault(require("../controllers/inmateController"));
var _authMiddleware = require("../middlewares/auth-middleware");
var _validationMiddleware = require("../middlewares/validation-middleware");
/* eslint-disable no-undef */

var routes = (0, _express.Router)();
routes.use('/user', _validationMiddleware.headerValidation, _authMiddleware.blockHtmlMiddleware, _authMiddleware.isBasicAuth, _userController["default"]);
routes.use('/admin', _validationMiddleware.headerValidation, _authMiddleware.blockHtmlMiddleware, _authMiddleware.isBasicAuth, _adminController["default"]);
routes.use('/inmate', _validationMiddleware.headerValidation, _authMiddleware.blockHtmlMiddleware, _authMiddleware.isBasicAuth, _inmateController["default"]);
var _default = exports["default"] = routes;