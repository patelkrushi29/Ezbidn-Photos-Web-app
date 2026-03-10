"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var HttpStatus = {};
HttpStatus.success = 200;
HttpStatus.noContentFound = 204;
HttpStatus.existCode = 207;
HttpStatus.badRequest = 400;
HttpStatus.internalServerError = 500;
HttpStatus.contentDifferent = 210;
HttpStatus.unauthorized = 401;
HttpStatus.notFound = 404;
HttpStatus.unProcessable = 422;
HttpStatus.emailNotExistCode = 410;

// Custom Code
HttpStatus.OTPNotMatch = 206;
HttpStatus.noDataFoundCode = 213;

// Login User Codes
HttpStatus.alreadyRegisteredUserCode = 214;
HttpStatus.alreadyOtherSocialUserCode = 215;
var _default = exports["default"] = HttpStatus;