"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewProfileModel = exports.verifyPassOtpModel = exports.verifyOtpModel = exports.userById = exports.socialLoginModel = exports.resetPasswordModel = exports.resendOtpModel = exports.registerModel = exports.orderImagesByinmateId = exports.loginModel = exports.imagesByinmateId = exports.imagesByIds = exports.imageUploadModel = exports.imageByinmateId = exports.imageById = exports.guestLoginModel = exports.getOrderDetailsByIdModel = exports.getAllOrdersModel = exports.forgotPasswordModel = exports.editProfileModel = exports.deleteUploadedImageModel = exports.checkoutOrderModel = exports.checkPaymentStatusModel = exports.checkEmailExists = exports.changePasswordModel = exports.addContactUsFormModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _db = require("../db.js");
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _utils = require("../utils");
var _s3utils = _interopRequireDefault(require("../utils/s3utils.js"));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var stripe = require("stripe")(process.env.STRIPE_SECRET);
var deleteOTP = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(user_id) {
    var sqlUpdateQuery;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          sqlUpdateQuery = "UPDATE users set otp=? where id=?";
          _context.next = 3;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [null, user_id]);
        case 3:
          return _context.abrupt("return", true);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function deleteOTP(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Check if user id is exist or not
var userById = exports.userById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(userId) {
    var sqlQuery, _yield$mysql$prepared, _yield$mysql$prepared2, row;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          sqlQuery = "select * from users where id=?";
          _context2.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [userId]);
        case 3:
          _yield$mysql$prepared = _context2.sent;
          _yield$mysql$prepared2 = (0, _slicedToArray2["default"])(_yield$mysql$prepared, 1);
          row = _yield$mysql$prepared2[0];
          return _context2.abrupt("return", row);
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function userById(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Check if email id is already exist or not
var checkEmailExists = exports.checkEmailExists = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(email) {
    var sqlQuery, rows;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          sqlQuery = "select id, email from users where email=?";
          _context3.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [email]);
        case 3:
          rows = _context3.sent;
          return _context3.abrupt("return", [rows]);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function checkEmailExists(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var registerModel = exports.registerModel = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(userdata) {
    var customer, hashedPassword, sqlInsert, sqlQuery, _yield$mysql$query, _yield$mysql$query2, row, _hashedPassword, sqlUpdateQuery, _sqlQuery, _yield$mysql$query3, _yield$mysql$query4, _row;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (userdata.isGuestUser) {
            _context4.next = 18;
            break;
          }
          _context4.next = 3;
          return stripe.customers.create({
            description: "My customer Id for email " + userdata.email,
            email: userdata.email,
            name: userdata.name,
            metadata: {
              provider_id: userdata.email
            }
          });
        case 3:
          customer = _context4.sent;
          hashedPassword = _bcryptjs["default"].hashSync(userdata.password, 8);
          sqlInsert = "INSERT INTO users (name, email, password, otp, phone, device_token, device_type, provider,customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
          _context4.next = 8;
          return _db.mysql.preparedQuery(sqlInsert, [userdata.name, userdata.email, hashedPassword, userdata.otp, userdata.phone, userdata.uuid, userdata.devicetype, userdata.provider, customer.id]);
        case 8:
          sqlQuery = "SELECT * FROM users WHERE email = '".concat(userdata.email, "'");
          _context4.next = 11;
          return _db.mysql.query(sqlQuery);
        case 11:
          _yield$mysql$query = _context4.sent;
          _yield$mysql$query2 = (0, _slicedToArray2["default"])(_yield$mysql$query, 1);
          row = _yield$mysql$query2[0];
          setTimeout(function () {
            deleteOTP(row.id);
          }, 300000); // 5 Minutes expire time for OTP
          return _context4.abrupt("return", row);
        case 18:
          _hashedPassword = _bcryptjs["default"].hashSync(userdata.password, 8);
          sqlUpdateQuery = "UPDATE users set name=?,password=?,otp=?,phone=?,device_token=?,device_type=?,provider=?,role=? where email=?";
          _context4.next = 22;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [userdata.name, _hashedPassword, userdata.otp, userdata.phone, userdata.uuid, userdata.devicetype, userdata.provider, 'user', userdata.email]);
        case 22:
          _sqlQuery = "SELECT * FROM users WHERE email = '".concat(userdata.email, "'");
          _context4.next = 25;
          return _db.mysql.query(_sqlQuery);
        case 25:
          _yield$mysql$query3 = _context4.sent;
          _yield$mysql$query4 = (0, _slicedToArray2["default"])(_yield$mysql$query3, 1);
          _row = _yield$mysql$query4[0];
          setTimeout(function () {
            deleteOTP(_row.id);
          }, 300000); // 5 Minutes expire time for OTP
          return _context4.abrupt("return", _row);
        case 30:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function registerModel(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var loginModel = exports.loginModel = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(userdata) {
    var sqlQuery, _yield$mysql$prepared3, _yield$mysql$prepared4, row, result, sqlUpdateQuery, outputJSON, jwttoken;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          sqlQuery = "SELECT * from users where email=? AND provider=?";
          _context5.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [userdata.email, "email"]);
        case 3:
          _yield$mysql$prepared3 = _context5.sent;
          _yield$mysql$prepared4 = (0, _slicedToArray2["default"])(_yield$mysql$prepared3, 1);
          row = _yield$mysql$prepared4[0];
          if (!row) {
            _context5.next = 30;
            break;
          }
          if (!(row.role === 'guest')) {
            _context5.next = 11;
            break;
          }
          return _context5.abrupt("return", {
            validation: 5
          });
        case 11:
          _context5.next = 13;
          return _bcryptjs["default"].compare(userdata.password, row.password);
        case 13:
          result = _context5.sent;
          if (!(result === true)) {
            _context5.next = 27;
            break;
          }
          if (!(row.is_verified === 0)) {
            _context5.next = 19;
            break;
          }
          return _context5.abrupt("return", {
            validation: 2
          });
        case 19:
          sqlUpdateQuery = "UPDATE users set device_token=?,device_type=? where email=?";
          _context5.next = 22;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [userdata.uuid, userdata.devicetype, userdata.email]);
        case 22:
          outputJSON = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            profile_picture: row.profile_picture,
            role: row.role,
            provider: row.provider,
            customer_id: row.customer_id
          };
          jwttoken = (0, _utils.jwtToken)(outputJSON);
          return _context5.abrupt("return", {
            validation: 3,
            data: outputJSON,
            token: jwttoken
          });
        case 25:
          _context5.next = 28;
          break;
        case 27:
          return _context5.abrupt("return", {
            validation: 1
          });
        case 28:
          _context5.next = 31;
          break;
        case 30:
          return _context5.abrupt("return", {
            validation: 4
          });
        case 31:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function loginModel(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var socialLoginModel = exports.socialLoginModel = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(userdata) {
    var sqlQuery, _yield$mysql$query5, _yield$mysql$query6, row, sqlUpdateQuery, outputJSON, jwttoken, customer, sqlInsert, _yield$mysql$query7, _yield$mysql$query8, _row2, _outputJSON, _jwttoken;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          sqlQuery = "SELECT * FROM users WHERE email = '".concat(userdata.email, "'");
          _context6.next = 3;
          return _db.mysql.query(sqlQuery);
        case 3:
          _yield$mysql$query5 = _context6.sent;
          _yield$mysql$query6 = (0, _slicedToArray2["default"])(_yield$mysql$query5, 1);
          row = _yield$mysql$query6[0];
          if (!row) {
            _context6.next = 23;
            break;
          }
          if (!(row && row.provider === 'email' && row.is_verified === 1)) {
            _context6.next = 11;
            break;
          }
          return _context6.abrupt("return", {
            isFlag: 1
          });
        case 11:
          if (!(row && row.provider !== userdata.provider && row.is_verified === 1 && row.provider !== 'email')) {
            _context6.next = 15;
            break;
          }
          return _context6.abrupt("return", {
            isFlag: 2
          });
        case 15:
          sqlUpdateQuery = "UPDATE users set name=?,email=?,phone=?,profile_picture=?,device_token=?,device_type=?,is_verified=? where id=?";
          _context6.next = 18;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [userdata.name, userdata.email, userdata.phone, userdata.profile_picture, userdata.uuid, userdata.devicetype, 1, row.id]);
        case 18:
          outputJSON = {
            id: row.id,
            name: userdata.name,
            email: userdata.email,
            phone: userdata.phone,
            profile_picture: userdata.profile_picture,
            role: row.role,
            provider: row.provider,
            customer_id: row.customer_id
          };
          jwttoken = (0, _utils.jwtToken)(outputJSON);
          return _context6.abrupt("return", {
            isFlag: 0,
            data: outputJSON,
            token: jwttoken
          });
        case 21:
          _context6.next = 37;
          break;
        case 23:
          _context6.next = 25;
          return stripe.customers.create({
            description: "My customer Id for " + userdata.email + " of " + userdata.provider + " " + userdata.provider_id,
            email: userdata.email,
            name: userdata.name,
            metadata: {
              provider_id: userdata.provider_id
            }
          });
        case 25:
          customer = _context6.sent;
          sqlInsert = "INSERT INTO users (name, email, phone, provider, provider_id, device_token,device_type,profile_picture,is_verified,customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          _context6.next = 29;
          return _db.mysql.preparedQuery(sqlInsert, [userdata.name, userdata.email, userdata.phone, userdata.provider, userdata.provider_id, userdata.uuid, userdata.devicetype, userdata.profile_picture, 1, customer.id]);
        case 29:
          _context6.next = 31;
          return _db.mysql.query(sqlQuery);
        case 31:
          _yield$mysql$query7 = _context6.sent;
          _yield$mysql$query8 = (0, _slicedToArray2["default"])(_yield$mysql$query7, 1);
          _row2 = _yield$mysql$query8[0];
          _outputJSON = {
            id: _row2.id,
            name: _row2.name,
            email: _row2.email,
            phone: _row2.phone,
            profile_picture: _row2.profile_picture,
            role: _row2.role,
            provider: _row2.provider,
            customer_id: _row2.customer_id
          };
          _jwttoken = (0, _utils.jwtToken)(_outputJSON);
          return _context6.abrupt("return", {
            isFlag: 0,
            data: _outputJSON,
            token: _jwttoken
          });
        case 37:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function socialLoginModel(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var verifyOtpModel = exports.verifyOtpModel = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(email, otp) {
    var sqlQuery, _yield$mysql$prepared5, _yield$mysql$prepared6, rows, sqlUpdate;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          sqlQuery = "SELECT id from users WHERE otp=? AND email=?";
          _context7.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [otp, email]);
        case 3:
          _yield$mysql$prepared5 = _context7.sent;
          _yield$mysql$prepared6 = (0, _slicedToArray2["default"])(_yield$mysql$prepared5, 1);
          rows = _yield$mysql$prepared6[0];
          if (!rows) {
            _context7.next = 13;
            break;
          }
          sqlUpdate = "UPDATE users SET is_verified=1, otp=? WHERE email=?";
          _context7.next = 10;
          return _db.mysql.preparedQuery(sqlUpdate, [null, email]);
        case 10:
          return _context7.abrupt("return", true);
        case 13:
          return _context7.abrupt("return", false);
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function verifyOtpModel(_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();
var forgotPasswordModel = exports.forgotPasswordModel = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(email, otp) {
    var sqlQuery, _yield$mysql$prepared7, _yield$mysql$prepared8, row, uid, sqlUpdate, _sqlUpdate;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          sqlQuery = "SELECT id,name,is_verified,otp_count,TIMESTAMPDIFF(MINUTE, updated_at, NOW()) as time_minutes from users WHERE email=? AND provider=?";
          _context8.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [email, "email"]);
        case 3:
          _yield$mysql$prepared7 = _context8.sent;
          _yield$mysql$prepared8 = (0, _slicedToArray2["default"])(_yield$mysql$prepared7, 1);
          row = _yield$mysql$prepared8[0];
          if (!row) {
            _context8.next = 27;
            break;
          }
          uid = row.id;
          if (!(row.otp_count < 3)) {
            _context8.next = 16;
            break;
          }
          sqlUpdate = "UPDATE users SET otp=?,otp_count=? WHERE id=?";
          _context8.next = 12;
          return _db.mysql.preparedQuery(sqlUpdate, [otp, row.otp_count + 1, uid]);
        case 12:
          setTimeout(function () {
            deleteOTP(row.id);
          }, 300000); // 5 Minutes expire time for OTP
          return _context8.abrupt("return", {
            type: "otp_sent",
            name: row.name
          });
        case 16:
          if (!(row.time_minutes <= 15)) {
            _context8.next = 20;
            break;
          }
          return _context8.abrupt("return", {
            type: "limit_exceed"
          });
        case 20:
          _sqlUpdate = "UPDATE users SET otp=?,otp_count=? WHERE id=?";
          _context8.next = 23;
          return _db.mysql.preparedQuery(_sqlUpdate, [otp, 1, uid]);
        case 23:
          setTimeout(function () {
            deleteOTP(row.id);
          }, 300000); // 5 Minutes expire time for OTP
          return _context8.abrupt("return", {
            type: "otp_sent",
            name: row.name
          });
        case 25:
          _context8.next = 28;
          break;
        case 27:
          return _context8.abrupt("return", {
            type: "not_found"
          });
        case 28:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function forgotPasswordModel(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();
var resendOtpModel = exports.resendOtpModel = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(email, otp) {
    var sqlQuery, _yield$mysql$prepared9, _yield$mysql$prepared10, row, uid, sqlUpdate, _sqlUpdate2;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          sqlQuery = "SELECT id,name,otp_count,TIMESTAMPDIFF(MINUTE, updated_at, NOW()) as time_minutes from users WHERE email=? AND provider=?";
          _context9.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [email, "email"]);
        case 3:
          _yield$mysql$prepared9 = _context9.sent;
          _yield$mysql$prepared10 = (0, _slicedToArray2["default"])(_yield$mysql$prepared9, 1);
          row = _yield$mysql$prepared10[0];
          if (!row) {
            _context9.next = 27;
            break;
          }
          uid = row.id;
          if (!(row.otp_count < 3)) {
            _context9.next = 16;
            break;
          }
          sqlUpdate = "UPDATE users SET otp=?,otp_count=? WHERE id=?";
          _context9.next = 12;
          return _db.mysql.preparedQuery(sqlUpdate, [otp, row.otp_count + 1, uid]);
        case 12:
          setTimeout(function () {
            deleteOTP(row.id);
          }, 300000); // 5 Minutes expire time for OTP
          return _context9.abrupt("return", {
            type: "otp_sent",
            name: row.name
          });
        case 16:
          if (!(row.time_minutes <= 15)) {
            _context9.next = 20;
            break;
          }
          return _context9.abrupt("return", {
            type: "limit_exceed"
          });
        case 20:
          _sqlUpdate2 = "UPDATE users SET otp=?,otp_count=? WHERE id=?";
          _context9.next = 23;
          return _db.mysql.preparedQuery(_sqlUpdate2, [otp, 1, uid]);
        case 23:
          setTimeout(function () {
            deleteOTP(row.id);
          }, 300000); // 5 Minutes expire time for OTP
          return _context9.abrupt("return", {
            type: "otp_sent",
            name: row.name
          });
        case 25:
          _context9.next = 28;
          break;
        case 27:
          return _context9.abrupt("return", {
            type: "not_found"
          });
        case 28:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function resendOtpModel(_x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();
var verifyPassOtpModel = exports.verifyPassOtpModel = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(email, otp) {
    var sqlQuery, _yield$mysql$prepared11, _yield$mysql$prepared12, row, sqlUpdate;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          sqlQuery = "SELECT id, email from users WHERE otp=? AND email=?";
          _context10.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [otp, email]);
        case 3:
          _yield$mysql$prepared11 = _context10.sent;
          _yield$mysql$prepared12 = (0, _slicedToArray2["default"])(_yield$mysql$prepared11, 1);
          row = _yield$mysql$prepared12[0];
          if (!row) {
            _context10.next = 13;
            break;
          }
          sqlUpdate = "UPDATE users SET is_verified=1, otp=? WHERE email=?";
          _context10.next = 10;
          return _db.mysql.preparedQuery(sqlUpdate, [null, email]);
        case 10:
          return _context10.abrupt("return", {
            type: "otp_verify",
            user_id: row.id,
            email: row.email
          });
        case 13:
          return _context10.abrupt("return", false);
        case 14:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function verifyPassOtpModel(_x13, _x14) {
    return _ref10.apply(this, arguments);
  };
}();
var resetPasswordModel = exports.resetPasswordModel = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11(verificationId, email, newpassword) {
    var sqlQuery, _yield$mysql$prepared13, _yield$mysql$prepared14, row, hashedPassword, sqlUpdate;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          sqlQuery = "SELECT name,id,email from users WHERE id=? and email=?";
          _context11.next = 4;
          return _db.mysql.preparedQuery(sqlQuery, [verificationId, email]);
        case 4:
          _yield$mysql$prepared13 = _context11.sent;
          _yield$mysql$prepared14 = (0, _slicedToArray2["default"])(_yield$mysql$prepared13, 1);
          row = _yield$mysql$prepared14[0];
          if (!row) {
            _context11.next = 15;
            break;
          }
          hashedPassword = _bcryptjs["default"].hashSync(newpassword, 8);
          sqlUpdate = "UPDATE users SET password=? WHERE id=? and email=?";
          _context11.next = 12;
          return _db.mysql.preparedQuery(sqlUpdate, [hashedPassword, verificationId, email]);
        case 12:
          return _context11.abrupt("return", "updated");
        case 15:
          return _context11.abrupt("return", "not_found");
        case 16:
          _context11.next = 22;
          break;
        case 18:
          _context11.prev = 18;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          throw _context11.t0;
        case 22:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 18]]);
  }));
  return function resetPasswordModel(_x15, _x16, _x17) {
    return _ref11.apply(this, arguments);
  };
}();
var viewProfileModel = exports.viewProfileModel = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12(userId) {
    var sqlQuery, _yield$mysql$prepared15, _yield$mysql$prepared16, row, outputJSON;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          sqlQuery = "SELECT * from users where id=?";
          _context12.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [userId]);
        case 3:
          _yield$mysql$prepared15 = _context12.sent;
          _yield$mysql$prepared16 = (0, _slicedToArray2["default"])(_yield$mysql$prepared15, 1);
          row = _yield$mysql$prepared16[0];
          if (!row) {
            _context12.next = 11;
            break;
          }
          outputJSON = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            provider: row.provider,
            profile_picture: row.profile_picture,
            role: row.role
          };
          return _context12.abrupt("return", {
            data: outputJSON
          });
        case 11:
          return _context12.abrupt("return", false);
        case 12:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function viewProfileModel(_x18) {
    return _ref12.apply(this, arguments);
  };
}();
var editProfileModel = exports.editProfileModel = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13(inputJson) {
    var sqlQuery, _yield$mysql$prepared17, _yield$mysql$prepared18, row, sqlUpdateQuery;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          sqlQuery = "SELECT * from users where id=?";
          _context13.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inputJson.id]);
        case 3:
          _yield$mysql$prepared17 = _context13.sent;
          _yield$mysql$prepared18 = (0, _slicedToArray2["default"])(_yield$mysql$prepared17, 1);
          row = _yield$mysql$prepared18[0];
          if (!row) {
            _context13.next = 13;
            break;
          }
          sqlUpdateQuery = "UPDATE users set name=?, phone=? where id=?";
          _context13.next = 10;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [inputJson.name, inputJson.phone, inputJson.id]);
        case 10:
          return _context13.abrupt("return", true);
        case 13:
          return _context13.abrupt("return", false);
        case 14:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function editProfileModel(_x19) {
    return _ref13.apply(this, arguments);
  };
}();
var changePasswordModel = exports.changePasswordModel = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14(id, oldPassword, newPassword) {
    var sqlQuery, _yield$mysql$prepared19, _yield$mysql$prepared20, row, result, hashedPassword, sqlUpdate;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          sqlQuery = "SELECT * from users where id=?";
          _context14.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [id]);
        case 3:
          _yield$mysql$prepared19 = _context14.sent;
          _yield$mysql$prepared20 = (0, _slicedToArray2["default"])(_yield$mysql$prepared19, 1);
          row = _yield$mysql$prepared20[0];
          if (!row) {
            _context14.next = 21;
            break;
          }
          _context14.next = 9;
          return _bcryptjs["default"].compare(oldPassword, row.password);
        case 9:
          result = _context14.sent;
          if (!(result === true)) {
            _context14.next = 18;
            break;
          }
          hashedPassword = _bcryptjs["default"].hashSync(newPassword, 8);
          sqlUpdate = "UPDATE users SET password=? WHERE id=?";
          _context14.next = 15;
          return _db.mysql.preparedQuery(sqlUpdate, [hashedPassword, id]);
        case 15:
          return _context14.abrupt("return", "updated");
        case 18:
          return _context14.abrupt("return", "wrong_pass");
        case 19:
          _context14.next = 22;
          break;
        case 21:
          return _context14.abrupt("return", "not_found");
        case 22:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return function changePasswordModel(_x20, _x21, _x22) {
    return _ref14.apply(this, arguments);
  };
}();
var addContactUsFormModel = exports.addContactUsFormModel = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15(inputJson) {
    var sqlInsert;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          sqlInsert = "INSERT INTO contact_us( email, description, device_type) VALUES(?,?,?)";
          _context15.next = 3;
          return _db.mysql.preparedQuery(sqlInsert, [inputJson.email, inputJson.description, inputJson.device_type]);
        case 3:
          return _context15.abrupt("return", true);
        case 4:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return function addContactUsFormModel(_x23) {
    return _ref15.apply(this, arguments);
  };
}();
function generateGuestUsernameFromEmail(email) {
  if (!email || typeof email !== 'string') return 'guest_user';
  var _email$toLowerCase$sp = email.toLowerCase().split('@'),
    _email$toLowerCase$sp2 = (0, _slicedToArray2["default"])(_email$toLowerCase$sp, 1),
    localPart = _email$toLowerCase$sp2[0];
  var processed = localPart.replace(/[^a-z._-]/g, '') // Keep only letters, dot, dash, underscore
  .replace(/[.\-_]+/g, '_') // Convert all separators to single underscore
  .replace(/^_+|_+$/g, '') // Trim leading/trailing underscores
  .replace(/__+/g, '_'); // Collapse multiple underscores
  var name = processed || 'user';
  return "guest_".concat(name);
}
var guestLoginModel = exports.guestLoginModel = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16(userdata) {
    var sqlQuery, _yield$mysql$query9, _yield$mysql$query10, row, sqlUpdateQuery, outputJSON, jwttoken, guestName, customer, sqlInsert, _yield$mysql$query11, _yield$mysql$query12, _row3, _outputJSON2, _jwttoken2;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          sqlQuery = "SELECT * FROM users WHERE email = '".concat(userdata.email, "'");
          _context16.next = 3;
          return _db.mysql.query(sqlQuery);
        case 3:
          _yield$mysql$query9 = _context16.sent;
          _yield$mysql$query10 = (0, _slicedToArray2["default"])(_yield$mysql$query9, 1);
          row = _yield$mysql$query10[0];
          if (!row) {
            _context16.next = 19;
            break;
          }
          if (!(row.is_verified === 0 || row.provider !== 'email')) {
            _context16.next = 16;
            break;
          }
          sqlUpdateQuery = "UPDATE users set device_token=?,device_type=? where id=?";
          _context16.next = 11;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [userdata.uuid, userdata.devicetype, row.id]);
        case 11:
          outputJSON = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            profile_picture: row.profile_picture,
            role: row.role,
            provider: row.provider,
            customer_id: row.customer_id
          };
          jwttoken = (0, _utils.jwtToken)(outputJSON);
          return _context16.abrupt("return", {
            isSuccess: true,
            data: outputJSON,
            token: jwttoken
          });
        case 16:
          return _context16.abrupt("return", {
            isSuccess: false
          });
        case 17:
          _context16.next = 34;
          break;
        case 19:
          guestName = generateGuestUsernameFromEmail(userdata.email);
          _context16.next = 22;
          return stripe.customers.create({
            description: "My customer Id for email " + userdata.email,
            email: userdata.email,
            name: guestName,
            metadata: {
              guest_user: userdata.email
            }
          });
        case 22:
          customer = _context16.sent;
          sqlInsert = "INSERT INTO users (name, email, role, provider, device_token, device_type,customer_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
          _context16.next = 26;
          return _db.mysql.preparedQuery(sqlInsert, [guestName, userdata.email, userdata.role, userdata.provider, userdata.uuid, userdata.devicetype, customer.id]);
        case 26:
          _context16.next = 28;
          return _db.mysql.query(sqlQuery);
        case 28:
          _yield$mysql$query11 = _context16.sent;
          _yield$mysql$query12 = (0, _slicedToArray2["default"])(_yield$mysql$query11, 1);
          _row3 = _yield$mysql$query12[0];
          _outputJSON2 = {
            id: _row3.id,
            name: _row3.name,
            email: _row3.email,
            phone: _row3.phone,
            profile_picture: _row3.profile_picture,
            role: _row3.role,
            provider: _row3.provider,
            customer_id: _row3.customer_id
          };
          _jwttoken2 = (0, _utils.jwtToken)(_outputJSON2);
          return _context16.abrupt("return", {
            isSuccess: true,
            data: _outputJSON2,
            token: _jwttoken2
          });
        case 34:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return function guestLoginModel(_x24) {
    return _ref16.apply(this, arguments);
  };
}();
var imageUploadModel = exports.imageUploadModel = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17(inputJson) {
    var sqlInsert, row;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          sqlInsert = "INSERT INTO images( user_id, inmate_id, image_type, image) VALUES(?,?,?,?)";
          _context17.next = 3;
          return _db.mysql.preparedQuery(sqlInsert, [inputJson.user_id, inputJson.inmate_id, inputJson.image_type, inputJson.image]);
        case 3:
          row = _context17.sent;
          return _context17.abrupt("return", {
            id: row.insertId
          });
        case 5:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return function imageUploadModel(_x25) {
    return _ref17.apply(this, arguments);
  };
}();

// Image data using by id
var imageById = exports.imageById = /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18(id) {
    var sqlQuery, _yield$mysql$prepared21, _yield$mysql$prepared22, row;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          sqlQuery = "select * from images where id=?";
          _context18.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [id]);
        case 3:
          _yield$mysql$prepared21 = _context18.sent;
          _yield$mysql$prepared22 = (0, _slicedToArray2["default"])(_yield$mysql$prepared21, 1);
          row = _yield$mysql$prepared22[0];
          return _context18.abrupt("return", row);
        case 7:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  }));
  return function imageById(_x26) {
    return _ref18.apply(this, arguments);
  };
}();

// Image data using by inmate id
var imageByinmateId = exports.imageByinmateId = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19(inmateid) {
    var sqlQuery, _yield$mysql$prepared23, _yield$mysql$prepared24, row;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          sqlQuery = "select * from images where inmate_id=?";
          _context19.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inmateid]);
        case 3:
          _yield$mysql$prepared23 = _context19.sent;
          _yield$mysql$prepared24 = (0, _slicedToArray2["default"])(_yield$mysql$prepared23, 1);
          row = _yield$mysql$prepared24[0];
          return _context19.abrupt("return", row);
        case 7:
        case "end":
          return _context19.stop();
      }
    }, _callee19);
  }));
  return function imageByinmateId(_x27) {
    return _ref19.apply(this, arguments);
  };
}();

// Images  using by inmate id where no order avaialble
var imagesByinmateId = exports.imagesByinmateId = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20(inmateid, userid) {
    var sqlQuery, rows, _iterator, _step, _step$value, index, val, s3ImageURL;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          sqlQuery = "select * from images where inmate_id=? AND user_id=? AND order_id IS NULL";
          _context20.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inmateid, userid]);
        case 3:
          rows = _context20.sent;
          _iterator = _createForOfIteratorHelper(rows.entries());
          _context20.prev = 5;
          _iterator.s();
        case 7:
          if ((_step = _iterator.n()).done) {
            _context20.next = 21;
            break;
          }
          _step$value = (0, _slicedToArray2["default"])(_step.value, 2), index = _step$value[0], val = _step$value[1];
          if (!(val.image_type === 'local')) {
            _context20.next = 19;
            break;
          }
          if (!val.image) {
            _context20.next = 16;
            break;
          }
          _context20.next = 13;
          return _s3utils["default"].gets3URLDirect(val.image);
        case 13:
          _context20.t0 = _context20.sent;
          _context20.next = 17;
          break;
        case 16:
          _context20.t0 = '';
        case 17:
          s3ImageURL = _context20.t0;
          rows[index].image = s3ImageURL;
        case 19:
          _context20.next = 7;
          break;
        case 21:
          _context20.next = 26;
          break;
        case 23:
          _context20.prev = 23;
          _context20.t1 = _context20["catch"](5);
          _iterator.e(_context20.t1);
        case 26:
          _context20.prev = 26;
          _iterator.f();
          return _context20.finish(26);
        case 29:
          return _context20.abrupt("return", rows);
        case 30:
        case "end":
          return _context20.stop();
      }
    }, _callee20, null, [[5, 23, 26, 29]]);
  }));
  return function imagesByinmateId(_x28, _x29) {
    return _ref20.apply(this, arguments);
  };
}();

// Images  using by inmate id where order avaialble
var orderImagesByinmateId = exports.orderImagesByinmateId = /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21(inmateid, userid) {
    var sqlQuery, rows, _iterator2, _step2, _step2$value, index, val, s3ImageURL;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          sqlQuery = "select * from images where inmate_id=? AND user_id=? AND order_id IS NOT NULL";
          _context21.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inmateid, userid]);
        case 3:
          rows = _context21.sent;
          _iterator2 = _createForOfIteratorHelper(rows.entries());
          _context21.prev = 5;
          _iterator2.s();
        case 7:
          if ((_step2 = _iterator2.n()).done) {
            _context21.next = 21;
            break;
          }
          _step2$value = (0, _slicedToArray2["default"])(_step2.value, 2), index = _step2$value[0], val = _step2$value[1];
          if (!(val.image_type === 'local')) {
            _context21.next = 19;
            break;
          }
          if (!val.image) {
            _context21.next = 16;
            break;
          }
          _context21.next = 13;
          return _s3utils["default"].gets3URLDirect(val.image);
        case 13:
          _context21.t0 = _context21.sent;
          _context21.next = 17;
          break;
        case 16:
          _context21.t0 = '';
        case 17:
          s3ImageURL = _context21.t0;
          rows[index].image = s3ImageURL;
        case 19:
          _context21.next = 7;
          break;
        case 21:
          _context21.next = 26;
          break;
        case 23:
          _context21.prev = 23;
          _context21.t1 = _context21["catch"](5);
          _iterator2.e(_context21.t1);
        case 26:
          _context21.prev = 26;
          _iterator2.f();
          return _context21.finish(26);
        case 29:
          return _context21.abrupt("return", rows);
        case 30:
        case "end":
          return _context21.stop();
      }
    }, _callee21, null, [[5, 23, 26, 29]]);
  }));
  return function orderImagesByinmateId(_x30, _x31) {
    return _ref21.apply(this, arguments);
  };
}();

// Delete Image data using by id
var deleteUploadedImageModel = exports.deleteUploadedImageModel = /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22(data) {
    var sqlQuery, row;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          sqlQuery = "DELETE FROM images where id=?";
          _context22.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [data.id]);
        case 3:
          row = _context22.sent;
          if (!(data.image_type === 'local' && data.image && data.image.length > 1)) {
            _context22.next = 7;
            break;
          }
          _context22.next = 7;
          return _s3utils["default"].deleteObjectS3([{
            Key: data.image
          }]);
        case 7:
          return _context22.abrupt("return", row && row.affectedRows != 0 ? true : false);
        case 8:
        case "end":
          return _context22.stop();
      }
    }, _callee22);
  }));
  return function deleteUploadedImageModel(_x32) {
    return _ref22.apply(this, arguments);
  };
}();

// Images by array of ids 
var imagesByIds = exports.imagesByIds = /*#__PURE__*/function () {
  var _ref23 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee23(ids, userid, inmate_id) {
    var placeholders, sqlQuery, values, rows;
    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) switch (_context23.prev = _context23.next) {
        case 0:
          placeholders = ids.map(function () {
            return '?';
          }).join(', ');
          sqlQuery = "select * from images where inmate_id=? AND user_id=? AND order_id IS NULL AND id IN (".concat(placeholders, ")");
          values = [inmate_id, userid].concat((0, _toConsumableArray2["default"])(ids));
          _context23.next = 5;
          return _db.mysql.preparedQuery(sqlQuery, values);
        case 5:
          rows = _context23.sent;
          return _context23.abrupt("return", rows);
        case 7:
        case "end":
          return _context23.stop();
      }
    }, _callee23);
  }));
  return function imagesByIds(_x33, _x34, _x35) {
    return _ref23.apply(this, arguments);
  };
}();

// Images by array of ids 
var checkoutOrderModel = exports.checkoutOrderModel = /*#__PURE__*/function () {
  var _ref24 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee24(inputJson, tierData, imageData) {
    var session, sqlInsert, row, placeholders, sqlUpdateQuery, values;
    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) switch (_context24.prev = _context24.next) {
        case 0:
          _context24.next = 2;
          return stripe.checkout.sessions.create({
            payment_method_configuration: 'pmc_1R3xhqL1W3FcBtVaX6YWR8bv',
            line_items: [{
              price_data: {
                currency: 'usd',
                product_data: {
                  name: "Image Pack: ".concat(tierData.label)
                },
                unit_amount: tierData.price_cents
              },
              quantity: 1
            }],
            mode: 'payment',
            success_url: 'https://dev.ezbidn.com/user/account/order-confirmed',
            cancel_url: 'https://dev.ezbidn.com/user/account/order-failed'
          });
        case 2:
          session = _context24.sent;
          sqlInsert = "INSERT INTO orders (user_id, inmate_id, customer_id, pricing_tier_id, payment_checkout_id,payment_status,images, device_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
          _context24.next = 6;
          return _db.mysql.preparedQuery(sqlInsert, [inputJson.user_id, inputJson.inmate_id, inputJson.customer_id, inputJson.pricing_tier_id, session.id, session.payment_status, JSON.stringify(inputJson.images), inputJson.devicetype]);
        case 6:
          row = _context24.sent;
          placeholders = inputJson.images.map(function () {
            return '?';
          }).join(', ');
          sqlUpdateQuery = "UPDATE images SET order_id =".concat(row.insertId, " where id IN (").concat(placeholders, ")");
          values = (0, _toConsumableArray2["default"])(inputJson.images);
          _context24.next = 12;
          return _db.mysql.preparedQuery(sqlUpdateQuery, values);
        case 12:
          return _context24.abrupt("return", session);
        case 13:
        case "end":
          return _context24.stop();
      }
    }, _callee24);
  }));
  return function checkoutOrderModel(_x36, _x37, _x38) {
    return _ref24.apply(this, arguments);
  };
}();

// Orders
var getAllOrdersModel = exports.getAllOrdersModel = /*#__PURE__*/function () {
  var _ref25 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee25(id) {
    var sqlQuery, rows, _iterator3, _step3, _step3$value, index, val, placeholders, sqlImageQuery, values, rowsImage, _iterator4, _step4, _step4$value, indexImage, valImage, s3ImageURL, session;
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) switch (_context25.prev = _context25.next) {
        case 0:
          sqlQuery = "SELECT \n  o.id AS order_id,\n  o.customer_id,\n  o.payment_checkout_id,\n  o.created_at,\n  o.images,\n  o.user_id,\n  o.shipment_status,\n  u.name AS user_name,\n  u.email AS user_email,\n  u.role AS user_role,\n  u.provider AS user_provider,\n  o.inmate_id AS id,\n  i.nameFirst AS inmate_nameFirst,\n  i.nameMiddle AS inmate_nameMiddle,\n  i.nameLast AS inmate_nameLast,\n  i.faclName AS inmate_faclName,\n  i.faclCode AS inmate_faclCode,\n  o.pricing_tier_id,\n  pt.label AS pricing_label,\n  pt.min_images AS pricing_min_images,\n  pt.max_images AS pricing_max_images,\n  pt.description AS pricing_description\nFROM orders o\nLEFT JOIN users u ON o.user_id = u.id\nLEFT JOIN inmates i ON o.inmate_id = i.id\nLEFT JOIN pricing_tiers pt ON o.pricing_tier_id = pt.id\nWHERE o.user_id = ".concat(id, "\nORDER BY o.created_at DESC;\n");
          _context25.next = 3;
          return _db.mysql.query(sqlQuery);
        case 3:
          rows = _context25.sent;
          _iterator3 = _createForOfIteratorHelper(rows.entries());
          _context25.prev = 5;
          _iterator3.s();
        case 7:
          if ((_step3 = _iterator3.n()).done) {
            _context25.next = 50;
            break;
          }
          _step3$value = (0, _slicedToArray2["default"])(_step3.value, 2), index = _step3$value[0], val = _step3$value[1];
          placeholders = val.images.map(function () {
            return '?';
          }).join(', ');
          sqlImageQuery = "select * from images where order_id=? AND id IN (".concat(placeholders, ")");
          values = [val.order_id].concat((0, _toConsumableArray2["default"])(val.images));
          _context25.next = 14;
          return _db.mysql.preparedQuery(sqlImageQuery, values);
        case 14:
          rowsImage = _context25.sent;
          _iterator4 = _createForOfIteratorHelper(rowsImage.entries());
          _context25.prev = 16;
          _iterator4.s();
        case 18:
          if ((_step4 = _iterator4.n()).done) {
            _context25.next = 32;
            break;
          }
          _step4$value = (0, _slicedToArray2["default"])(_step4.value, 2), indexImage = _step4$value[0], valImage = _step4$value[1];
          if (!(valImage.image_type === 'local')) {
            _context25.next = 30;
            break;
          }
          if (!valImage.image) {
            _context25.next = 27;
            break;
          }
          _context25.next = 24;
          return _s3utils["default"].gets3URLDirect(valImage.image);
        case 24:
          _context25.t0 = _context25.sent;
          _context25.next = 28;
          break;
        case 27:
          _context25.t0 = '';
        case 28:
          s3ImageURL = _context25.t0;
          rowsImage[indexImage].image = s3ImageURL;
        case 30:
          _context25.next = 18;
          break;
        case 32:
          _context25.next = 37;
          break;
        case 34:
          _context25.prev = 34;
          _context25.t1 = _context25["catch"](16);
          _iterator4.e(_context25.t1);
        case 37:
          _context25.prev = 37;
          _iterator4.f();
          return _context25.finish(37);
        case 40:
          rows[index].images = rowsImage;
          _context25.next = 43;
          return stripe.checkout.sessions.retrieve(val.payment_checkout_id);
        case 43:
          session = _context25.sent;
          rows[index].amount_total = session.amount_total;
          rows[index].transaction_id = session.id;
          rows[index].payment_status = session.payment_status;
          rows[index].payment_email = session.email;
        case 48:
          _context25.next = 7;
          break;
        case 50:
          _context25.next = 55;
          break;
        case 52:
          _context25.prev = 52;
          _context25.t2 = _context25["catch"](5);
          _iterator3.e(_context25.t2);
        case 55:
          _context25.prev = 55;
          _iterator3.f();
          return _context25.finish(55);
        case 58:
          return _context25.abrupt("return", rows);
        case 59:
        case "end":
          return _context25.stop();
      }
    }, _callee25, null, [[5, 52, 55, 58], [16, 34, 37, 40]]);
  }));
  return function getAllOrdersModel(_x39) {
    return _ref25.apply(this, arguments);
  };
}();

// Get Order Details By Id
var getOrderDetailsByIdModel = exports.getOrderDetailsByIdModel = /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee26(id, userId) {
    var sqlQuery, _yield$mysql$query13, _yield$mysql$query14, row, placeholders, sqlImageQuery, values, rows, _iterator5, _step5, _step5$value, index, val, s3ImageURL, session;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) switch (_context26.prev = _context26.next) {
        case 0:
          _context26.prev = 0;
          sqlQuery = "SELECT \n     o.id,\n     o.customer_id,\n     o.payment_checkout_id,\n     o.created_at,\n     o.images,\n     o.user_id,\n     o.shipment_status,\n     u.name AS user_name,\n     u.email AS user_email,\n     u.role AS user_role,\n     u.provider AS user_provider,\n     o.inmate_id,\n     i.inmateNum AS inmate_inmateNum,\n     i.nameFirst AS inmate_nameFirst,\n     i.nameMiddle AS inmate_nameMiddle,\n     i.nameLast AS inmate_nameLast,\n     i.faclName AS inmate_faclName,\n     i.faclCode AS inmate_faclCode,\n     o.pricing_tier_id,\n     pt.label AS pricing_label,\n     pt.min_images AS pricing_min_images,\n     pt.max_images AS pricing_max_images,\n     pt.description AS pricing_description\n      FROM orders o\n      LEFT JOIN users u ON o.user_id = u.id\n      LEFT JOIN inmates i ON o.inmate_id = i.id\n      LEFT JOIN pricing_tiers pt ON o.pricing_tier_id = pt.id\n      WHERE o.id = ".concat(id, " AND o.user_id=").concat(userId);
          _context26.next = 4;
          return _db.mysql.query(sqlQuery);
        case 4:
          _yield$mysql$query13 = _context26.sent;
          _yield$mysql$query14 = (0, _slicedToArray2["default"])(_yield$mysql$query13, 1);
          row = _yield$mysql$query14[0];
          if (!row) {
            _context26.next = 47;
            break;
          }
          placeholders = row.images.map(function () {
            return '?';
          }).join(', ');
          sqlImageQuery = "select * from images where order_id=? AND id IN (".concat(placeholders, ")");
          values = [id].concat((0, _toConsumableArray2["default"])(row.images));
          _context26.next = 13;
          return _db.mysql.preparedQuery(sqlImageQuery, values);
        case 13:
          rows = _context26.sent;
          _iterator5 = _createForOfIteratorHelper(rows.entries());
          _context26.prev = 15;
          _iterator5.s();
        case 17:
          if ((_step5 = _iterator5.n()).done) {
            _context26.next = 31;
            break;
          }
          _step5$value = (0, _slicedToArray2["default"])(_step5.value, 2), index = _step5$value[0], val = _step5$value[1];
          if (!(val.image_type === 'local')) {
            _context26.next = 29;
            break;
          }
          if (!val.image) {
            _context26.next = 26;
            break;
          }
          _context26.next = 23;
          return _s3utils["default"].gets3URLDirect(val.image);
        case 23:
          _context26.t0 = _context26.sent;
          _context26.next = 27;
          break;
        case 26:
          _context26.t0 = '';
        case 27:
          s3ImageURL = _context26.t0;
          rows[index].image = s3ImageURL;
        case 29:
          _context26.next = 17;
          break;
        case 31:
          _context26.next = 36;
          break;
        case 33:
          _context26.prev = 33;
          _context26.t1 = _context26["catch"](15);
          _iterator5.e(_context26.t1);
        case 36:
          _context26.prev = 36;
          _iterator5.f();
          return _context26.finish(36);
        case 39:
          row.images = rows;
          _context26.next = 42;
          return stripe.checkout.sessions.retrieve(row.payment_checkout_id);
        case 42:
          session = _context26.sent;
          row.amount_total = session.amount_total;
          row.transaction_id = session.id;
          row.payment_status = session.payment_status;
          row.payment_email = session.email;
        case 47:
          return _context26.abrupt("return", row);
        case 50:
          _context26.prev = 50;
          _context26.t2 = _context26["catch"](0);
          console.log(_context26.t2);
          throw _context26.t2;
        case 54:
        case "end":
          return _context26.stop();
      }
    }, _callee26, null, [[0, 50], [15, 33, 36, 39]]);
  }));
  return function getOrderDetailsByIdModel(_x40, _x41) {
    return _ref26.apply(this, arguments);
  };
}();

// Checkout payment status
var checkPaymentStatusModel = exports.checkPaymentStatusModel = /*#__PURE__*/function () {
  var _ref27 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee27(id) {
    var session;
    return _regenerator["default"].wrap(function _callee27$(_context27) {
      while (1) switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return stripe.checkout.sessions.retrieve(id);
        case 2:
          session = _context27.sent;
          return _context27.abrupt("return", session);
        case 4:
        case "end":
          return _context27.stop();
      }
    }, _callee27);
  }));
  return function checkPaymentStatusModel(_x42) {
    return _ref27.apply(this, arguments);
  };
}();