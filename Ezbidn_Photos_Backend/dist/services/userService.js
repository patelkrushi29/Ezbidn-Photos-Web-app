"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewProfile = exports.verifyPassOtp = exports.verifyOtp = exports.socialLogin = exports.resetPassword = exports.resendOtp = exports.register = exports.pricingTiers = exports.login = exports.imageUploadedList = exports.imageUpload = exports.guestLogin = exports.getOrderDetailsById = exports.getAllOrders = exports.forgotPassword = exports.editProfile = exports.deleteUploadedImage = exports.contactUsForm = exports.checkoutOrder = exports.checkPaymentStatus = exports.changePassword = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _userModel = require("../models/userModel");
var _adminModel = require("../models/adminModel");
var _inmateModel = require("../models/inmateModel");
var _utils = require("../utils");
var _HttpStatus = _interopRequireDefault(require("../utils/HttpStatus"));
var _en = _interopRequireDefault(require("../utils/en.json"));
var _s3utils = _interopRequireDefault(require("../utils/s3utils.js"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var sgMail = require('@sendgrid/mail');
var _dirname = _path["default"].resolve(_path["default"].dirname('../'));
var stripe = require("stripe")(process.env.STRIPE_SECRET);

// OTP send function for registered users
var OtpEmailTemplate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(email, mailBody, email_subject) {
    var mailOptions;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          _context.prev = 1;
          mailOptions = {
            from: {
              email: process.env.SENDER_EMAIL_MAIN,
              name: 'Project' // Add the sender's name here
            },
            to: email,
            subject: email_subject,
            html: mailBody
          };
          _context.next = 5;
          return sgMail.send(mailOptions);
        case 5:
          _context.next = 11;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          if (_context.t0.response) {
            console.error(_context.t0.response.body);
          }
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function OtpEmailTemplate(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var register = exports.register = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, name, email, password, phone, _req$headers, devicetype, uuid, isEmailExists, otp, temp, newUser, mailBody, _otp, _temp, _newUser, _mailBody;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phone = _req$body.phone;
          _req$headers = req.headers, devicetype = _req$headers.devicetype, uuid = _req$headers.uuid;
          _context2.next = 5;
          return (0, _userModel.checkEmailExists)(email);
        case 5:
          isEmailExists = _context2.sent;
          if (!(isEmailExists && isEmailExists.role !== 'guest')) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", (0, _utils.alreadyExist)(res, _en["default"].EMAIL_EXIST));
        case 10:
          if (!(isEmailExists && isEmailExists.role === 'guest')) {
            _context2.next = 23;
            break;
          }
          otp = (0, _utils.OTP)();
          temp = {
            name: name,
            email: email,
            password: password,
            phone: phone || null,
            otp: otp,
            devicetype: devicetype,
            uuid: uuid || null,
            provider: 'email',
            isGuestUser: true
          };
          _context2.next = 15;
          return (0, _userModel.registerModel)(temp);
        case 15:
          newUser = _context2.sent;
          mailBody = _fs["default"].readFileSync(_dirname + process.env.REGISTRATION_EMAIL_TEMPLATE).toString();
          mailBody = mailBody.replace(/{{name}}/g, newUser.name);
          mailBody = mailBody.replace(/{{otp}}/g, otp);
          OtpEmailTemplate(newUser.email, mailBody, _en["default"].OTP_SENT_EMAIL_SUBJECT);
          return _context2.abrupt("return", (0, _utils.successRequest)(res, _en["default"].REGISTER_SUCCESS, {}));
        case 23:
          _otp = (0, _utils.OTP)();
          _temp = {
            name: name,
            email: email,
            password: password,
            phone: phone || null,
            otp: _otp,
            devicetype: devicetype,
            uuid: uuid || null,
            provider: 'email',
            isGuestUser: false
          };
          _context2.next = 27;
          return (0, _userModel.registerModel)(_temp);
        case 27:
          _newUser = _context2.sent;
          _mailBody = _fs["default"].readFileSync(_dirname + process.env.REGISTRATION_EMAIL_TEMPLATE).toString();
          _mailBody = _mailBody.replace(/{{name}}/g, _newUser.name);
          _mailBody = _mailBody.replace(/{{otp}}/g, _otp);
          OtpEmailTemplate(_newUser.email, _mailBody, _en["default"].OTP_SENT_EMAIL_SUBJECT);
          return _context2.abrupt("return", (0, _utils.successRequest)(res, _en["default"].REGISTER_SUCCESS, {}));
        case 33:
          _context2.next = 39;
          break;
        case 35:
          _context2.prev = 35;
          _context2.t0 = _context2["catch"](0);
          console.log("Registration Error-------------", _context2.t0);
          return _context2.abrupt("return", (0, _utils.serverError)(res, _context2.t0));
        case 39:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 35]]);
  }));
  return function register(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var login = exports.login = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body2, email, password, _req$headers2, devicetype, uuid, temp, userLogin;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _req$headers2 = req.headers, devicetype = _req$headers2.devicetype, uuid = _req$headers2.uuid;
          temp = {
            email: email,
            password: password,
            devicetype: devicetype,
            uuid: uuid || null
          };
          _context3.next = 6;
          return (0, _userModel.loginModel)(temp);
        case 6:
          userLogin = _context3.sent;
          if (!userLogin) {
            _context3.next = 27;
            break;
          }
          if (!(userLogin.validation === 1)) {
            _context3.next = 12;
            break;
          }
          return _context3.abrupt("return", (0, _utils.badRequest)(res, _en["default"].INVALID_CREDENTIALS));
        case 12:
          if (!(userLogin.validation === 2)) {
            _context3.next = 16;
            break;
          }
          return _context3.abrupt("return", (0, _utils.notVerified)(res, _en["default"].NOT_VERIFIED_ACCOUNT));
        case 16:
          if (!(userLogin.validation === 4)) {
            _context3.next = 20;
            break;
          }
          return _context3.abrupt("return", (0, _utils.emailNotExist)(res));
        case 20:
          if (!(userLogin.validation === 5)) {
            _context3.next = 24;
            break;
          }
          return _context3.abrupt("return", (0, _utils.badRequest)(res, _en["default"].GUEST_LOGIN_REG));
        case 24:
          return _context3.abrupt("return", res.status(_HttpStatus["default"].success).json({
            customcode: _HttpStatus["default"].success,
            message: _en["default"].SUCCESS,
            status: true,
            data: userLogin.data,
            token: userLogin.token
          }));
        case 25:
          _context3.next = 28;
          break;
        case 27:
          return _context3.abrupt("return", (0, _utils.badRequest)(res, _en["default"].INVALID_CREDENTIALS));
        case 28:
          _context3.next = 34;
          break;
        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](0);
          console.log("Login Error-----------", _context3.t0);
          return _context3.abrupt("return", (0, _utils.serverError)(res, _context3.t0));
        case 34:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 30]]);
  }));
  return function login(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
var socialLogin = exports.socialLogin = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$body3, name, email, phone, provider, provider_id, profile_picture, _req$headers3, devicetype, uuid, temp, userLogin;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, phone = _req$body3.phone, provider = _req$body3.provider, provider_id = _req$body3.provider_id, profile_picture = _req$body3.profile_picture;
          _req$headers3 = req.headers, devicetype = _req$headers3.devicetype, uuid = _req$headers3.uuid;
          temp = {
            name: name,
            email: email,
            phone: phone || null,
            provider: provider,
            provider_id: provider_id,
            devicetype: devicetype,
            uuid: uuid || null,
            profile_picture: profile_picture || null
          };
          _context4.next = 6;
          return (0, _userModel.socialLoginModel)(temp);
        case 6:
          userLogin = _context4.sent;
          if (!(userLogin && userLogin.isFlag === 1)) {
            _context4.next = 11;
            break;
          }
          return _context4.abrupt("return", (0, _utils.alreadyRegisteredUser)(res));
        case 11:
          if (!(userLogin && userLogin.isFlag === 2)) {
            _context4.next = 15;
            break;
          }
          return _context4.abrupt("return", (0, _utils.alreadyOtherSocialUser)(res));
        case 15:
          return _context4.abrupt("return", res.status(_HttpStatus["default"].success).json({
            customcode: _HttpStatus["default"].success,
            message: _en["default"].SUCCESS,
            status: true,
            data: userLogin.data,
            token: userLogin.token
          }));
        case 16:
          _context4.next = 22;
          break;
        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.log("Social Login Error-----------", _context4.t0);
          return _context4.abrupt("return", (0, _utils.serverError)(res, _context4.t0));
        case 22:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 18]]);
  }));
  return function socialLogin(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();
var verifyOtp = exports.verifyOtp = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$body4, email, otp, isVerified;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$body4 = req.body, email = _req$body4.email, otp = _req$body4.otp;
          _context5.next = 4;
          return (0, _userModel.verifyOtpModel)(email, otp);
        case 4:
          isVerified = _context5.sent;
          isVerified ? (0, _utils.successRequest)(res, _en["default"].OTP_MATCHED, {}) : (0, _utils.badRequest)(res, _en["default"].OTP_NOT_MATCHED);
          _context5.next = 12;
          break;
        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log("Verify Otp error -------------", _context5.t0);
          return _context5.abrupt("return", (0, _utils.serverError)(res, _context5.t0));
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 8]]);
  }));
  return function verifyOtp(_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();
var forgotPassword = exports.forgotPassword = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var email, otp, result, mailBody;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          email = req.body.email;
          otp = (0, _utils.OTP)();
          _context6.next = 5;
          return (0, _userModel.forgotPasswordModel)(email, otp);
        case 5:
          result = _context6.sent;
          if (!(result.type == 'otp_sent' || result.type == 'not_verified')) {
            _context6.next = 14;
            break;
          }
          mailBody = _fs["default"].readFileSync(_dirname + process.env.FORGOT_PASSWORD_EMAIL_TEMPLATE).toString();
          mailBody = mailBody.replace(/{{name}}/g, result.name);
          mailBody = mailBody.replace(/{{otp}}/g, otp);
          OtpEmailTemplate(email, mailBody, _en["default"].FORGOT_PASSWORD_EMAIL_SUBJECT);
          return _context6.abrupt("return", (0, _utils.successRequest)(res, _en["default"].OTP_SENT, {}));
        case 14:
          if (!(result.type == 'limit_exceed')) {
            _context6.next = 18;
            break;
          }
          return _context6.abrupt("return", (0, _utils.badRequest)(res, _en["default"].OTP_ATTEMPTS));
        case 18:
          return _context6.abrupt("return", (0, _utils.emailNotExist)(res));
        case 19:
          _context6.next = 25;
          break;
        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](0);
          console.log("Forgot Password Error ----------", _context6.t0);
          return _context6.abrupt("return", (0, _utils.serverError)(res, _context6.t0));
        case 25:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 21]]);
  }));
  return function forgotPassword(_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();
var resendOtp = exports.resendOtp = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var email, otp, result, mailBody;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          email = req.body.email;
          otp = (0, _utils.OTP)();
          _context7.next = 5;
          return (0, _userModel.resendOtpModel)(email, otp);
        case 5:
          result = _context7.sent;
          if (!(result.type == 'otp_sent')) {
            _context7.next = 14;
            break;
          }
          mailBody = _fs["default"].readFileSync(_dirname + process.env.RESEND_OTP_EMAIL_TEMPLATE).toString();
          mailBody = mailBody.replace(/{{name}}/g, result.name);
          mailBody = mailBody.replace(/{{otp}}/g, otp);
          OtpEmailTemplate(email, mailBody, _en["default"].OTP_SENT_EMAIL_SUBJECT);
          return _context7.abrupt("return", (0, _utils.successRequest)(res, _en["default"].OTP_SENT, {}));
        case 14:
          if (!(result.type == 'limit_exceed')) {
            _context7.next = 18;
            break;
          }
          return _context7.abrupt("return", (0, _utils.badRequest)(res, _en["default"].OTP_ATTEMPTS));
        case 18:
          return _context7.abrupt("return", (0, _utils.emailNotExist)(res));
        case 19:
          _context7.next = 25;
          break;
        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](0);
          console.log("Resend OTP Error ----------", _context7.t0);
          return _context7.abrupt("return", (0, _utils.serverError)(res, _context7.t0));
        case 25:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 21]]);
  }));
  return function resendOtp(_x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}();
var verifyPassOtp = exports.verifyPassOtp = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _req$body5, email, otp, isVerified;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body5 = req.body, email = _req$body5.email, otp = _req$body5.otp;
          _context8.next = 4;
          return (0, _userModel.verifyPassOtpModel)(email, otp);
        case 4:
          isVerified = _context8.sent;
          if (!(isVerified.type == "otp_verify")) {
            _context8.next = 9;
            break;
          }
          return _context8.abrupt("return", (0, _utils.successRequest)(res, _en["default"].OTP_MATCHED, {
            verificationId: isVerified.user_id,
            email: isVerified.email
          }));
        case 9:
          return _context8.abrupt("return", (0, _utils.badRequest)(res, _en["default"].OTP_NOT_MATCHED));
        case 10:
          _context8.next = 16;
          break;
        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.log("Verify Otp error -------------", _context8.t0);
          return _context8.abrupt("return", (0, _utils.serverError)(res, _context8.t0));
        case 16:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 12]]);
  }));
  return function verifyPassOtp(_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();
var resetPassword = exports.resetPassword = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var _req$body6, verificationId, email, newpassword, result;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body6 = req.body, verificationId = _req$body6.verificationId, email = _req$body6.email, newpassword = _req$body6.newpassword;
          _context9.next = 4;
          return (0, _userModel.resetPasswordModel)(verificationId, email, newpassword);
        case 4:
          result = _context9.sent;
          if (!(result == 'updated')) {
            _context9.next = 9;
            break;
          }
          return _context9.abrupt("return", (0, _utils.successRequest)(res, _en["default"].UPDATE_PASSWORD_SUCCESS, {}));
        case 9:
          return _context9.abrupt("return", (0, _utils.badRequest)(res, _en["default"].OTP_NOT_MATCHED));
        case 10:
          _context9.next = 16;
          break;
        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          console.log("Reset Password Error--------------" + _context9.t0);
          return _context9.abrupt("return", (0, _utils.serverError)(res, _context9.t0));
        case 16:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 12]]);
  }));
  return function resetPassword(_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();
var viewProfile = exports.viewProfile = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var id, userData;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.auth.id;
          _context10.next = 4;
          return (0, _userModel.viewProfileModel)(id);
        case 4:
          userData = _context10.sent;
          if (!userData) {
            _context10.next = 9;
            break;
          }
          return _context10.abrupt("return", res.status(_HttpStatus["default"].success).json({
            customcode: _HttpStatus["default"].success,
            message: _en["default"].SUCCESS,
            status: true,
            data: userData.data
          }));
        case 9:
          return _context10.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 10:
          _context10.next = 16;
          break;
        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.log("View Profile Error-----------", _context10.t0);
          return _context10.abrupt("return", (0, _utils.serverError)(res, _context10.t0));
        case 16:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 12]]);
  }));
  return function viewProfile(_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();
var editProfile = exports.editProfile = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var id, _req$body7, name, phone, inputJson, userData;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          id = req.auth.id;
          _req$body7 = req.body, name = _req$body7.name, phone = _req$body7.phone;
          inputJson = {
            id: id,
            name: name,
            phone: phone
          };
          _context11.next = 6;
          return (0, _userModel.editProfileModel)(inputJson);
        case 6:
          userData = _context11.sent;
          if (!userData) {
            _context11.next = 11;
            break;
          }
          return _context11.abrupt("return", (0, _utils.successRequest)(res, _en["default"].PROFILE_UPDATE_SUCCESS, {}));
        case 11:
          return _context11.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 12:
          _context11.next = 18;
          break;
        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](0);
          console.log("Edit Profile Error-----------", _context11.t0);
          return _context11.abrupt("return", (0, _utils.serverError)(res, _context11.t0));
        case 18:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 14]]);
  }));
  return function editProfile(_x22, _x23, _x24) {
    return _ref11.apply(this, arguments);
  };
}();
var changePassword = exports.changePassword = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var _req$body8, oldPassword, newPassword, id, result;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _req$body8 = req.body, oldPassword = _req$body8.oldPassword, newPassword = _req$body8.newPassword;
          id = req.auth.id;
          _context12.next = 5;
          return (0, _userModel.changePasswordModel)(id, oldPassword, newPassword);
        case 5:
          result = _context12.sent;
          if (!(result === 'updated')) {
            _context12.next = 10;
            break;
          }
          return _context12.abrupt("return", (0, _utils.successRequest)(res, _en["default"].UPDATE_PASSWORD_SUCCESS, {}));
        case 10:
          if (!(result === 'wrong_pass')) {
            _context12.next = 14;
            break;
          }
          return _context12.abrupt("return", (0, _utils.badRequest)(res, _en["default"].UPDATE_PASSWORD_ERROR));
        case 14:
          return _context12.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 15:
          _context12.next = 21;
          break;
        case 17:
          _context12.prev = 17;
          _context12.t0 = _context12["catch"](0);
          console.log("Change Password Error--------------" + _context12.t0);
          return _context12.abrupt("return", (0, _utils.serverError)(res, _context12.t0));
        case 21:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 17]]);
  }));
  return function changePassword(_x25, _x26, _x27) {
    return _ref12.apply(this, arguments);
  };
}();
var contactUsForm = exports.contactUsForm = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var _req$body9, email, description, devicetype, temp, isAdded, mailBody;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _req$body9 = req.body, email = _req$body9.email, description = _req$body9.description;
          devicetype = req.headers.devicetype;
          temp = {
            email: email,
            description: description,
            device_type: devicetype
          };
          _context13.next = 6;
          return (0, _userModel.addContactUsFormModel)(temp);
        case 6:
          isAdded = _context13.sent;
          if (!isAdded) {
            _context13.next = 14;
            break;
          }
          mailBody = _fs["default"].readFileSync(_dirname + process.env.CONTACT_US_EMAIL_TEMPLATE).toString();
          mailBody = mailBody.replace(/{{description}}/g, description);
          OtpEmailTemplate(email, mailBody, _en["default"].CONTACT_US_EMAIL_SUBJECT);
          return _context13.abrupt("return", (0, _utils.successRequest)(res, _en["default"].CONTACT_US_SUBMISSION_SUCCSESS));
        case 14:
          return _context13.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 15:
          _context13.next = 21;
          break;
        case 17:
          _context13.prev = 17;
          _context13.t0 = _context13["catch"](0);
          console.log("contactUsForm Error-------------", _context13.t0);
          return _context13.abrupt("return", (0, _utils.serverError)(res, _context13.t0));
        case 21:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 17]]);
  }));
  return function contactUsForm(_x28, _x29, _x30) {
    return _ref13.apply(this, arguments);
  };
}();

// List of pricing tiers
var pricingTiers = exports.pricingTiers = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var data;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return (0, _adminModel.listPricingTierModel)();
        case 3:
          data = _context14.sent;
          if (!(data && data.length > 0)) {
            _context14.next = 8;
            break;
          }
          return _context14.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, data));
        case 8:
          return _context14.abrupt("return", (0, _utils.noRecordFound)(res));
        case 9:
          _context14.next = 15;
          break;
        case 11:
          _context14.prev = 11;
          _context14.t0 = _context14["catch"](0);
          console.log("pricing Tiers List Error---------" + _context14.t0);
          return _context14.abrupt("return", (0, _utils.serverError)(res, _context14.t0));
        case 15:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 11]]);
  }));
  return function pricingTiers(_x31, _x32, _x33) {
    return _ref14.apply(this, arguments);
  };
}();
var guestLogin = exports.guestLogin = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    var email, _req$headers4, devicetype, uuid, temp, userLogin;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          email = req.body.email;
          _req$headers4 = req.headers, devicetype = _req$headers4.devicetype, uuid = _req$headers4.uuid;
          temp = {
            email: email,
            role: 'guest',
            provider: 'email',
            devicetype: devicetype,
            uuid: uuid || null
          };
          _context15.next = 6;
          return (0, _userModel.guestLoginModel)(temp);
        case 6:
          userLogin = _context15.sent;
          if (!(userLogin && userLogin.isSuccess)) {
            _context15.next = 11;
            break;
          }
          return _context15.abrupt("return", res.status(_HttpStatus["default"].success).json({
            customcode: _HttpStatus["default"].success,
            message: _en["default"].SUCCESS,
            status: true,
            data: userLogin.data,
            token: userLogin.token
          }));
        case 11:
          return _context15.abrupt("return", (0, _utils.alreadyRegisteredUser)(res));
        case 12:
          _context15.next = 18;
          break;
        case 14:
          _context15.prev = 14;
          _context15.t0 = _context15["catch"](0);
          console.log("Login Error-----------", _context15.t0);
          return _context15.abrupt("return", (0, _utils.serverError)(res, _context15.t0));
        case 18:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[0, 14]]);
  }));
  return function guestLogin(_x34, _x35) {
    return _ref15.apply(this, arguments);
  };
}();
var imageUpload = exports.imageUpload = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    var _req$body10, inmate_id, image_type, image, _req$auth, id, role, imageURL, isInmateExist, uploadedFile, fileExtension, imageFilename, s3ImageURL, inputJson, isimageUpload, imageAccessURL, outputData;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _req$body10 = req.body, inmate_id = _req$body10.inmate_id, image_type = _req$body10.image_type, image = _req$body10.image;
          _req$auth = req.auth, id = _req$auth.id, role = _req$auth.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context16.next = 5;
            break;
          }
          return _context16.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          imageURL = image;
          _context16.next = 8;
          return (0, _inmateModel.inmateById)(inmate_id, id);
        case 8:
          isInmateExist = _context16.sent;
          if (!isInmateExist) {
            _context16.next = 46;
            break;
          }
          if (!(image_type === 'local' && req.files && req.files.image)) {
            _context16.next = 24;
            break;
          }
          uploadedFile = req.files.image;
          if (!(uploadedFile.mimetype === "image/png" || uploadedFile.mimetype === "image/jpeg")) {
            _context16.next = 21;
            break;
          }
          fileExtension = uploadedFile.mimetype.split("/")[1];
          imageFilename = "".concat(process.env.BUCKET_FOLDER_NAME, "/inmate-images/").concat(Date.now(), ".").concat(fileExtension); // s3 path
          _context16.next = 17;
          return _s3utils["default"].uploadS3(req.files.image, imageFilename);
        case 17:
          s3ImageURL = _context16.sent;
          imageURL = s3ImageURL || "";
          _context16.next = 22;
          break;
        case 21:
          return _context16.abrupt("return", (0, _utils.validationError)(res, _en["default"].IMAGE_TYPE));
        case 22:
          _context16.next = 29;
          break;
        case 24:
          if (!(image_type !== 'local' && image)) {
            _context16.next = 28;
            break;
          }
          imageURL = image;
          _context16.next = 29;
          break;
        case 28:
          return _context16.abrupt("return", (0, _utils.validationError)(res, _en["default"].IMAGE));
        case 29:
          inputJson = {
            user_id: id,
            inmate_id: inmate_id,
            image_type: image_type,
            image: imageURL
          };
          _context16.next = 32;
          return (0, _userModel.imageUploadModel)(inputJson);
        case 32:
          isimageUpload = _context16.sent;
          if (!(isimageUpload && isimageUpload.id)) {
            _context16.next = 43;
            break;
          }
          imageAccessURL = imageURL;
          if (!(image_type === 'local')) {
            _context16.next = 39;
            break;
          }
          _context16.next = 38;
          return _s3utils["default"].gets3URLDirect(imageURL);
        case 38:
          imageAccessURL = _context16.sent;
        case 39:
          outputData = {
            id: isimageUpload.id,
            inmate_id: inmate_id,
            image_type: image_type,
            image: imageAccessURL
          };
          return _context16.abrupt("return", (0, _utils.successRequest)(res, _en["default"].IMAGE_SUCCESS, outputData));
        case 43:
          return _context16.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 44:
          _context16.next = 47;
          break;
        case 46:
          return _context16.abrupt("return", (0, _utils.badRequest)(res, _en["default"].NO_INMATE_EXIST));
        case 47:
          _context16.next = 53;
          break;
        case 49:
          _context16.prev = 49;
          _context16.t0 = _context16["catch"](0);
          console.log("Image Upload Error---------" + _context16.t0);
          return _context16.abrupt("return", (0, _utils.serverError)(res, _context16.t0));
        case 53:
        case "end":
          return _context16.stop();
      }
    }, _callee16, null, [[0, 49]]);
  }));
  return function imageUpload(_x36, _x37, _x38) {
    return _ref16.apply(this, arguments);
  };
}();
var deleteUploadedImage = exports.deleteUploadedImage = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    var _req$auth2, id, role, imageId, imageData, isDeleted;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _req$auth2 = req.auth, id = _req$auth2.id, role = _req$auth2.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context17.next = 4;
            break;
          }
          return _context17.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 4:
          imageId = req.params.imageId;
          _context17.next = 7;
          return (0, _userModel.imageById)(imageId);
        case 7:
          imageData = _context17.sent;
          if (!imageData) {
            _context17.next = 23;
            break;
          }
          if (!(imageData.user_id === id)) {
            _context17.next = 20;
            break;
          }
          _context17.next = 12;
          return (0, _userModel.deleteUploadedImageModel)(imageData);
        case 12:
          isDeleted = _context17.sent;
          if (!isDeleted) {
            _context17.next = 17;
            break;
          }
          return _context17.abrupt("return", (0, _utils.successRequest)(res, _en["default"].IMAGE_DELETE_SUCCESS));
        case 17:
          return _context17.abrupt("return", (0, _utils.badRequest)(res, _en["default"].NOT_OWNER_USER));
        case 18:
          _context17.next = 21;
          break;
        case 20:
          return _context17.abrupt("return", (0, _utils.badRequest)(res, _en["default"].NOT_OWNER_USER));
        case 21:
          _context17.next = 24;
          break;
        case 23:
          return _context17.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 24:
          _context17.next = 30;
          break;
        case 26:
          _context17.prev = 26;
          _context17.t0 = _context17["catch"](0);
          console.log("Delete Uploaded Image-----------", _context17.t0);
          return _context17.abrupt("return", (0, _utils.serverError)(res, _context17.t0));
        case 30:
        case "end":
          return _context17.stop();
      }
    }, _callee17, null, [[0, 26]]);
  }));
  return function deleteUploadedImage(_x39, _x40, _x41) {
    return _ref17.apply(this, arguments);
  };
}();
var imageUploadedList = exports.imageUploadedList = /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
    var inmateId, _req$auth3, id, role, data;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          inmateId = req.params.inmateId;
          _req$auth3 = req.auth, id = _req$auth3.id, role = _req$auth3.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context18.next = 5;
            break;
          }
          return _context18.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          _context18.next = 7;
          return (0, _userModel.imagesByinmateId)(inmateId, id);
        case 7:
          data = _context18.sent;
          if (!(data && data.length > 0)) {
            _context18.next = 12;
            break;
          }
          return _context18.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, data));
        case 12:
          return _context18.abrupt("return", (0, _utils.noRecordFound)(res));
        case 13:
          _context18.next = 19;
          break;
        case 15:
          _context18.prev = 15;
          _context18.t0 = _context18["catch"](0);
          console.log("Image Uploaded List Error---------" + _context18.t0);
          return _context18.abrupt("return", (0, _utils.serverError)(res, _context18.t0));
        case 19:
        case "end":
          return _context18.stop();
      }
    }, _callee18, null, [[0, 15]]);
  }));
  return function imageUploadedList(_x42, _x43, _x44) {
    return _ref18.apply(this, arguments);
  };
}();
var checkoutOrder = exports.checkoutOrder = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res, next) {
    var _req$body11, inmate_id, customer_id, pricing_tier_id, images, devicetype, _req$auth4, id, role, isInmateExist, tierData, imageArray, inputJson, data;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _req$body11 = req.body, inmate_id = _req$body11.inmate_id, customer_id = _req$body11.customer_id, pricing_tier_id = _req$body11.pricing_tier_id, images = _req$body11.images;
          devicetype = req.headers.devicetype;
          _req$auth4 = req.auth, id = _req$auth4.id, role = _req$auth4.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context19.next = 6;
            break;
          }
          return _context19.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 6:
          _context19.next = 8;
          return (0, _inmateModel.inmateById)(inmate_id, id);
        case 8:
          isInmateExist = _context19.sent;
          if (isInmateExist) {
            _context19.next = 11;
            break;
          }
          return _context19.abrupt("return", (0, _utils.badRequest)(res, _en["default"].NO_INMATE_EXIST));
        case 11:
          _context19.next = 13;
          return (0, _adminModel.pricingTierById)(pricing_tier_id);
        case 13:
          tierData = _context19.sent;
          if (tierData) {
            _context19.next = 16;
            break;
          }
          return _context19.abrupt("return", (0, _utils.badRequest)(res, _en["default"].NO_PRICE_TIER_EXIST));
        case 16:
          _context19.next = 18;
          return (0, _userModel.imagesByIds)(images, id, inmate_id);
        case 18:
          imageArray = _context19.sent;
          if (!(imageArray && imageArray.length === 0)) {
            _context19.next = 21;
            break;
          }
          return _context19.abrupt("return", (0, _utils.badRequest)(res, _en["default"].NO_IMAGE_EXIST));
        case 21:
          if (imageArray.length >= tierData.min_images && imageArray.length <= tierData.max_images) {
            _context19.next = 23;
            break;
          }
          return _context19.abrupt("return", (0, _utils.badRequest)(res, imageArray.length < tierData.min_images ? _en["default"].MINIMAGE_AND_PLAN : _en["default"].MAXIMAGE_AND_PLAN));
        case 23:
          inputJson = {
            user_id: id,
            inmate_id: inmate_id,
            customer_id: customer_id,
            pricing_tier_id: pricing_tier_id,
            images: images,
            devicetype: devicetype
          };
          _context19.next = 26;
          return (0, _userModel.checkoutOrderModel)(inputJson, tierData, imageArray);
        case 26:
          data = _context19.sent;
          return _context19.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, {
            id: data.id,
            url: data.url
          }));
        case 30:
          _context19.prev = 30;
          _context19.t0 = _context19["catch"](0);
          console.log("Checkout Order Error---------" + _context19.t0);
          return _context19.abrupt("return", (0, _utils.serverError)(res, _context19.t0));
        case 34:
        case "end":
          return _context19.stop();
      }
    }, _callee19, null, [[0, 30]]);
  }));
  return function checkoutOrder(_x45, _x46, _x47) {
    return _ref19.apply(this, arguments);
  };
}();
var getAllOrders = exports.getAllOrders = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20(req, res, next) {
    var _req$auth5, id, role, data;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _req$auth5 = req.auth, id = _req$auth5.id, role = _req$auth5.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context20.next = 4;
            break;
          }
          return _context20.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 4:
          _context20.next = 6;
          return (0, _userModel.getAllOrdersModel)(id);
        case 6:
          data = _context20.sent;
          if (!(data && data.length > 0)) {
            _context20.next = 11;
            break;
          }
          return _context20.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, data));
        case 11:
          return _context20.abrupt("return", (0, _utils.noRecordFound)(res));
        case 12:
          _context20.next = 18;
          break;
        case 14:
          _context20.prev = 14;
          _context20.t0 = _context20["catch"](0);
          console.log("Get All Orders Error---------" + _context20.t0);
          return _context20.abrupt("return", (0, _utils.serverError)(res, _context20.t0));
        case 18:
        case "end":
          return _context20.stop();
      }
    }, _callee20, null, [[0, 14]]);
  }));
  return function getAllOrders(_x48, _x49, _x50) {
    return _ref20.apply(this, arguments);
  };
}();
var checkPaymentStatus = exports.checkPaymentStatus = /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res, next) {
    var checkOutId, _req$auth6, id, role, data;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          checkOutId = req.body.checkOutId;
          _req$auth6 = req.auth, id = _req$auth6.id, role = _req$auth6.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context21.next = 5;
            break;
          }
          return _context21.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          _context21.next = 7;
          return (0, _userModel.checkPaymentStatusModel)(checkOutId);
        case 7:
          data = _context21.sent;
          if (!data) {
            _context21.next = 12;
            break;
          }
          return _context21.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, data));
        case 12:
          return _context21.abrupt("return", (0, _utils.noRecordFound)(res));
        case 13:
          _context21.next = 19;
          break;
        case 15:
          _context21.prev = 15;
          _context21.t0 = _context21["catch"](0);
          console.log("Check Payment Status Error---------" + _context21.t0);
          return _context21.abrupt("return", (0, _utils.serverError)(res, _context21.t0));
        case 19:
        case "end":
          return _context21.stop();
      }
    }, _callee21, null, [[0, 15]]);
  }));
  return function checkPaymentStatus(_x51, _x52, _x53) {
    return _ref21.apply(this, arguments);
  };
}();

// Get Order Details By Id
var getOrderDetailsById = exports.getOrderDetailsById = /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22(req, res, next) {
    var orderId, _req$auth7, role, id, orderDetail;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          orderId = req.params.orderId;
          _req$auth7 = req.auth, role = _req$auth7.role, id = _req$auth7.id;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context22.next = 5;
            break;
          }
          return _context22.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          _context22.next = 7;
          return (0, _userModel.getOrderDetailsByIdModel)(orderId, id);
        case 7:
          orderDetail = _context22.sent;
          if (!orderDetail) {
            _context22.next = 12;
            break;
          }
          return _context22.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, orderDetail));
        case 12:
          return _context22.abrupt("return", (0, _utils.noRecordFound)(res));
        case 13:
          _context22.next = 19;
          break;
        case 15:
          _context22.prev = 15;
          _context22.t0 = _context22["catch"](0);
          console.log("Get Order Details By Id---------" + _context22.t0);
          return _context22.abrupt("return", (0, _utils.serverError)(res, _context22.t0));
        case 19:
        case "end":
          return _context22.stop();
      }
    }, _callee22, null, [[0, 15]]);
  }));
  return function getOrderDetailsById(_x54, _x55, _x56) {
    return _ref22.apply(this, arguments);
  };
}();