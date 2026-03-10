"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveInmateModel = exports.removeInmateModel = exports.inmateListModel = exports.inmateByNumberAndUser = exports.inmateByNumber = exports.inmateById = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _db = require("../db.js");
var _s3utils = _interopRequireDefault(require("../utils/s3utils.js"));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Check if inmate is exist or not
var inmateByNumber = exports.inmateByNumber = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(inmateNum) {
    var sqlQuery, _yield$mysql$prepared, _yield$mysql$prepared2, row;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          sqlQuery = "select * from inmates where inmateNum=?";
          _context.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inmateNum]);
        case 3:
          _yield$mysql$prepared = _context.sent;
          _yield$mysql$prepared2 = (0, _slicedToArray2["default"])(_yield$mysql$prepared, 1);
          row = _yield$mysql$prepared2[0];
          return _context.abrupt("return", row);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function inmateByNumber(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Check if inmate id is exist or not
var inmateById = exports.inmateById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, user_id) {
    var sqlQuery, _yield$mysql$prepared3, _yield$mysql$prepared4, row;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          sqlQuery = "SELECT * from inmates where id=? AND user_id=?";
          _context2.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [id, user_id]);
        case 3:
          _yield$mysql$prepared3 = _context2.sent;
          _yield$mysql$prepared4 = (0, _slicedToArray2["default"])(_yield$mysql$prepared3, 1);
          row = _yield$mysql$prepared4[0];
          return _context2.abrupt("return", row);
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function inmateById(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var inmateByNumberAndUser = exports.inmateByNumberAndUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(inmateNum, user_id) {
    var sqlQuery, _yield$mysql$prepared5, _yield$mysql$prepared6, row;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          sqlQuery = "select * from inmates where inmateNum=? AND user_id=?";
          _context3.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inmateNum, user_id]);
        case 3:
          _yield$mysql$prepared5 = _context3.sent;
          _yield$mysql$prepared6 = (0, _slicedToArray2["default"])(_yield$mysql$prepared5, 1);
          row = _yield$mysql$prepared6[0];
          return _context3.abrupt("return", row);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function inmateByNumberAndUser(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var saveInmateModel = exports.saveInmateModel = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(inputJson) {
    var sqlInsert, row;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          sqlInsert = "INSERT INTO inmates( user_id, nameFirst, nameMiddle, nameLast,sex,race,age, inmateNum, faclCode, faclName, faclType, faclURL, releaseCode, projRelDate, actRelDate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          _context4.next = 3;
          return _db.mysql.preparedQuery(sqlInsert, [inputJson.user_id, inputJson.nameFirst, inputJson.nameMiddle, inputJson.nameLast, inputJson.sex, inputJson.race, inputJson.age, inputJson.inmateNum, inputJson.faclCode, inputJson.faclName, inputJson.faclType, inputJson.faclURL, inputJson.releaseCode, inputJson.projRelDate, inputJson.actRelDate]);
        case 3:
          row = _context4.sent;
          return _context4.abrupt("return", {
            id: row.insertId
          });
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function saveInmateModel(_x6) {
    return _ref4.apply(this, arguments);
  };
}();
var inmateListModel = exports.inmateListModel = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(user_id) {
    var sqlQuery, rows;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          sqlQuery = "select * from inmates where user_id=? ORDER BY created_at DESC";
          _context5.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [user_id]);
        case 3:
          rows = _context5.sent;
          return _context5.abrupt("return", rows);
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function inmateListModel(_x7) {
    return _ref5.apply(this, arguments);
  };
}();
var removeInmateModel = exports.removeInmateModel = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(id, user_id) {
    var sqlImageDelete, rows, _iterator, _step, _step$value, index, val, sqlImageDeleteQuery, sqlDelete, row;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          sqlImageDelete = "select * from images where inmate_id=".concat(id, " AND user_id=").concat(user_id, " AND order_id IS NULL");
          _context6.next = 3;
          return _db.mysql.query(sqlImageDelete);
        case 3:
          rows = _context6.sent;
          _iterator = _createForOfIteratorHelper(rows.entries());
          _context6.prev = 5;
          _iterator.s();
        case 7:
          if ((_step = _iterator.n()).done) {
            _context6.next = 14;
            break;
          }
          _step$value = (0, _slicedToArray2["default"])(_step.value, 2), index = _step$value[0], val = _step$value[1];
          if (!(val.image_type === 'local' && val.image && val.image.length > 1)) {
            _context6.next = 12;
            break;
          }
          _context6.next = 12;
          return _s3utils["default"].deleteObjectS3([{
            Key: val.image
          }]);
        case 12:
          _context6.next = 7;
          break;
        case 14:
          _context6.next = 19;
          break;
        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](5);
          _iterator.e(_context6.t0);
        case 19:
          _context6.prev = 19;
          _iterator.f();
          return _context6.finish(19);
        case 22:
          sqlImageDeleteQuery = "DELETE FROM images where inmate_id=".concat(id, " AND user_id=").concat(user_id, " AND order_id IS NULL");
          _context6.next = 25;
          return _db.mysql.query(sqlImageDeleteQuery);
        case 25:
          sqlDelete = "DELETE FROM inmates WHERE id=".concat(id, " AND user_id=").concat(user_id);
          _context6.next = 28;
          return _db.mysql.query(sqlDelete);
        case 28:
          row = _context6.sent;
          return _context6.abrupt("return", row && row.affectedRows != 0 ? true : false);
        case 30:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[5, 16, 19, 22]]);
  }));
  return function removeInmateModel(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();