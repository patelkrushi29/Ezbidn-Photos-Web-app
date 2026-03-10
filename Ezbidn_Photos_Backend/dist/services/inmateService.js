"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveInmate = exports.removeInmate = exports.inmateLocation = exports.inmateList = exports.getInmateDetailById = exports.findFederalInmate = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("../utils");
var _en = _interopRequireDefault(require("../utils/en.json"));
var _inmateModel = require("../models/inmateModel");
var _userModel = require("../models/userModel");
var findFederalInmate = exports.findFederalInmate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var inmateId, data, dataLocation, inmateDetail;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          inmateId = req.params.inmateId;
          _context.next = 4;
          return globalThis.fetch("".concat(process.env.FIND_INMATE_API_BY_ID).concat(inmateId), {
            method: _utils.getMethod,
            headers: _utils.headers,
            agent: _utils.agent
          }).then(function (res) {
            return res.json();
          });
        case 4:
          data = _context.sent;
          if (!(data && data.InmateLocator.length > 0)) {
            _context.next = 17;
            break;
          }
          _context.next = 8;
          return globalThis.fetch("".concat(process.env.INMATE_LOCATION_API_BY_FACL_CODE).concat(data.InmateLocator[0].faclCode), {
            method: _utils.getMethod,
            headers: _utils.headers,
            agent: _utils.agent
          }).then(function (res) {
            return res.json();
          });
        case 8:
          dataLocation = _context.sent;
          if (!(dataLocation && dataLocation.Locations.length > 0)) {
            _context.next = 14;
            break;
          }
          inmateDetail = {
            inamteProfile: data.InmateLocator[0],
            inmateLocation: dataLocation.Locations[0]
          };
          return _context.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, inmateDetail));
        case 14:
          return _context.abrupt("return", (0, _utils.noRecordFound)(res));
        case 15:
          _context.next = 18;
          break;
        case 17:
          return _context.abrupt("return", (0, _utils.noRecordFound)(res));
        case 18:
          _context.next = 24;
          break;
        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.log("Error Occured: " + _context.t0);
          return _context.abrupt("return", (0, _utils.serverError)(res, _context.t0));
        case 24:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 20]]);
  }));
  return function findFederalInmate(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// This location api is not using for now
var inmateLocation = exports.inmateLocation = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var faclCode, role, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          faclCode = req.params.faclCode;
          role = req.auth.role;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          _context2.next = 7;
          return globalThis.fetch("".concat(process.env.INMATE_LOCATION_API_BY_FACL_CODE).concat(faclCode), {
            method: _utils.getMethod,
            headers: _utils.headers,
            agent: _utils.agent
          }).then(function (res) {
            return res.json();
          });
        case 7:
          data = _context2.sent;
          if (!(data && data.Locations.length > 0)) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, data.Locations));
        case 12:
          return _context2.abrupt("return", (0, _utils.noRecordFound)(res));
        case 13:
          _context2.next = 19;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.log("Error Occured: " + _context2.t0);
          return _context2.abrupt("return", (0, _utils.serverError)(res, _context2.t0));
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 15]]);
  }));
  return function inmateLocation(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var saveInmate = exports.saveInmate = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body, nameFirst, nameMiddle, nameLast, sex, race, age, inmateNum, faclCode, faclName, faclType, faclURL, releaseCode, projRelDate, actRelDate, _req$auth, role, id, isInmateExist, inputJson, newInmate;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, nameFirst = _req$body.nameFirst, nameMiddle = _req$body.nameMiddle, nameLast = _req$body.nameLast, sex = _req$body.sex, race = _req$body.race, age = _req$body.age, inmateNum = _req$body.inmateNum, faclCode = _req$body.faclCode, faclName = _req$body.faclName, faclType = _req$body.faclType, faclURL = _req$body.faclURL, releaseCode = _req$body.releaseCode, projRelDate = _req$body.projRelDate, actRelDate = _req$body.actRelDate;
          _req$auth = req.auth, role = _req$auth.role, id = _req$auth.id;
          _context3.next = 5;
          return (0, _inmateModel.inmateByNumberAndUser)(inmateNum, id);
        case 5:
          isInmateExist = _context3.sent;
          if (!isInmateExist) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", (0, _utils.alreadyExist)(res, _en["default"].INMATE_EXIST, {
            id: isInmateExist.id
          }));
        case 8:
          inputJson = {
            user_id: id,
            nameFirst: nameFirst,
            nameMiddle: nameMiddle || null,
            nameLast: nameLast || null,
            sex: sex || null,
            race: race || null,
            age: age || null,
            inmateNum: inmateNum,
            faclCode: faclCode,
            faclName: faclName,
            faclType: faclType,
            faclURL: faclURL || null,
            releaseCode: releaseCode || null,
            projRelDate: projRelDate || null,
            actRelDate: actRelDate || null
          };
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context3.next = 11;
            break;
          }
          return _context3.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 11:
          _context3.next = 13;
          return (0, _inmateModel.saveInmateModel)(inputJson);
        case 13:
          newInmate = _context3.sent;
          if (!(newInmate && newInmate.id)) {
            _context3.next = 18;
            break;
          }
          return _context3.abrupt("return", (0, _utils.successRequest)(res, _en["default"].INMATE_SAVED, newInmate));
        case 18:
          return _context3.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 19:
          _context3.next = 25;
          break;
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.log("Error Occured: " + _context3.t0);
          return _context3.abrupt("return", (0, _utils.serverError)(res, _context3.t0));
        case 25:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 21]]);
  }));
  return function saveInmate(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var inmateList = exports.inmateList = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var _req$auth2, role, id, _inmateList;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$auth2 = req.auth, role = _req$auth2.role, id = _req$auth2.id;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 4:
          _context4.next = 6;
          return (0, _inmateModel.inmateListModel)(id);
        case 6:
          _inmateList = _context4.sent;
          if (!(_inmateList && _inmateList.length > 0)) {
            _context4.next = 11;
            break;
          }
          return _context4.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, _inmateList));
        case 11:
          return _context4.abrupt("return", (0, _utils.noRecordFound)(res));
        case 12:
          _context4.next = 18;
          break;
        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.log("Error Occured: " + _context4.t0);
          return _context4.abrupt("return", (0, _utils.serverError)(res, _context4.t0));
        case 18:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 14]]);
  }));
  return function inmateList(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
var getInmateDetailById = exports.getInmateDetailById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var inmateId, _req$auth3, role, id, isInmateExist, dataLocation, inmateDetail;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          inmateId = req.params.inmateId;
          _req$auth3 = req.auth, role = _req$auth3.role, id = _req$auth3.id;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context5.next = 5;
            break;
          }
          return _context5.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          _context5.next = 7;
          return (0, _inmateModel.inmateById)(inmateId, id);
        case 7:
          isInmateExist = _context5.sent;
          if (isInmateExist) {
            _context5.next = 12;
            break;
          }
          return _context5.abrupt("return", (0, _utils.noRecordFound)(res));
        case 12:
          _context5.next = 14;
          return globalThis.fetch("".concat(process.env.INMATE_LOCATION_API_BY_FACL_CODE).concat(isInmateExist.faclCode), {
            method: _utils.getMethod,
            headers: _utils.headers,
            agent: _utils.agent
          }).then(function (res) {
            return res.json();
          });
        case 14:
          dataLocation = _context5.sent;
          if (!(dataLocation && dataLocation.Locations.length > 0)) {
            _context5.next = 20;
            break;
          }
          inmateDetail = {
            inamteProfile: isInmateExist,
            inmateLocation: dataLocation.Locations[0]
          };
          return _context5.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, inmateDetail));
        case 20:
          return _context5.abrupt("return", (0, _utils.noRecordFound)(res));
        case 21:
          _context5.next = 27;
          break;
        case 23:
          _context5.prev = 23;
          _context5.t0 = _context5["catch"](0);
          console.log("Error Occured: " + _context5.t0);
          return _context5.abrupt("return", (0, _utils.serverError)(res, _context5.t0));
        case 27:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 23]]);
  }));
  return function getInmateDetailById(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var removeInmate = exports.removeInmate = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var inmateId, _req$auth4, role, id, data, isInmateDeleted;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          inmateId = req.params.inmateId;
          _req$auth4 = req.auth, role = _req$auth4.role, id = _req$auth4.id;
          if (!(role !== _utils.userRoles['User'] && role !== _utils.userRoles['Guest'])) {
            _context6.next = 5;
            break;
          }
          return _context6.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_USER));
        case 5:
          _context6.next = 7;
          return (0, _userModel.orderImagesByinmateId)(inmateId, id);
        case 7:
          data = _context6.sent;
          if (!(data && data.length > 0)) {
            _context6.next = 10;
            break;
          }
          return _context6.abrupt("return", (0, _utils.badRequest)(res, _en["default"].INMATE_DELETE_ERROR));
        case 10:
          _context6.next = 12;
          return (0, _inmateModel.removeInmateModel)(inmateId, id);
        case 12:
          isInmateDeleted = _context6.sent;
          if (!isInmateDeleted) {
            _context6.next = 17;
            break;
          }
          return _context6.abrupt("return", (0, _utils.successRequest)(res, _en["default"].INMATE_DELETE_SUCCESS, {}));
        case 17:
          return _context6.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 18:
          _context6.next = 24;
          break;
        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          console.log("Error Occured: " + _context6.t0);
          return _context6.abrupt("return", (0, _utils.serverError)(res, _context6.t0));
        case 24:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 20]]);
  }));
  return function removeInmate(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();