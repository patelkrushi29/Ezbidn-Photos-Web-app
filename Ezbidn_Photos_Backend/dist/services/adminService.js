"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePricingTier = exports.updateOrder = exports.updateContactUsFlag = exports.listUsers = exports.listPricingTier = exports.listOrders = exports.listContactUsers = exports.getPricingTierById = exports.getOrderDetailsById = exports.addNewPricingTier = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _adminModel = require("../models/adminModel");
var _utils = require("../utils");
var _HttpStatus = _interopRequireDefault(require("../utils/HttpStatus"));
var _en = _interopRequireDefault(require("../utils/en.json"));
// User List with pagination
var listUsers = exports.listUsers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var _req$params, pageNo, limit, searchText, role, userdata;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$params = req.params, pageNo = _req$params.pageNo, limit = _req$params.limit, searchText = _req$params.searchText;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 5:
          _context.next = 7;
          return (0, _adminModel.listUsersModel)(pageNo, limit, searchText);
        case 7:
          userdata = _context.sent;
          return _context.abrupt("return", res.status(_HttpStatus["default"].success).json({
            'customcode': _HttpStatus["default"].success,
            'message': _en["default"].SUCCESS,
            'status': "success",
            'page': pageNo,
            'limit': limit,
            'total': userdata.totalCount,
            'users': userdata.data
          }));
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log("User List Error---------" + _context.t0);
          return _context.abrupt("return", (0, _utils.serverError)(res, _context.t0));
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return function listUsers(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Add New tier for the pricing
var addNewPricingTier = exports.addNewPricingTier = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$body, min_images, max_images, label, price_cents, description, role, isTierExist, inputJson, newPriceTier;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, min_images = _req$body.min_images, max_images = _req$body.max_images, label = _req$body.label, price_cents = _req$body.price_cents, description = _req$body.description;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 5:
          _context2.next = 7;
          return (0, _adminModel.pricingTier)(min_images, max_images);
        case 7:
          isTierExist = _context2.sent;
          if (!isTierExist) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", (0, _utils.alreadyExist)(res, _en["default"].TIER_EXIST));
        case 10:
          inputJson = {
            min_images: min_images,
            max_images: max_images,
            label: label,
            price_cents: price_cents,
            description: description || null
          };
          _context2.next = 13;
          return (0, _adminModel.addNewPricingTierModel)(inputJson);
        case 13:
          newPriceTier = _context2.sent;
          if (!(newPriceTier && newPriceTier.id)) {
            _context2.next = 18;
            break;
          }
          return _context2.abrupt("return", (0, _utils.successRequest)(res, _en["default"].TIER_SAVED, newPriceTier));
        case 18:
          return _context2.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 19:
          _context2.next = 25;
          break;
        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.log("Pricing Tier Error---------" + _context2.t0);
          return _context2.abrupt("return", (0, _utils.serverError)(res, _context2.t0));
        case 25:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 21]]);
  }));
  return function addNewPricingTier(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

// List of pricing tiers
var listPricingTier = exports.listPricingTier = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var role, data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 4:
          _context3.next = 6;
          return (0, _adminModel.listPricingTierModel)();
        case 6:
          data = _context3.sent;
          if (!(data && data.length > 0)) {
            _context3.next = 11;
            break;
          }
          return _context3.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, data));
        case 11:
          return _context3.abrupt("return", (0, _utils.noRecordFound)(res));
        case 12:
          _context3.next = 18;
          break;
        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.log("User List Error---------" + _context3.t0);
          return _context3.abrupt("return", (0, _utils.serverError)(res, _context3.t0));
        case 18:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 14]]);
  }));
  return function listPricingTier(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

// Update tier for the pricing
var updatePricingTier = exports.updatePricingTier = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var _req$body2, min_images, max_images, label, price_cents, description, tierId, role, isTierExist, inputJson, updatePriceTier;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, min_images = _req$body2.min_images, max_images = _req$body2.max_images, label = _req$body2.label, price_cents = _req$body2.price_cents, description = _req$body2.description;
          tierId = req.params.tierId;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context4.next = 6;
            break;
          }
          return _context4.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 6:
          _context4.next = 8;
          return (0, _adminModel.pricingTierWithoutId)(tierId, min_images, max_images);
        case 8:
          isTierExist = _context4.sent;
          if (!isTierExist) {
            _context4.next = 11;
            break;
          }
          return _context4.abrupt("return", (0, _utils.alreadyExist)(res, _en["default"].TIER_EXIST));
        case 11:
          inputJson = {
            id: tierId,
            min_images: min_images,
            max_images: max_images,
            label: label,
            price_cents: price_cents,
            description: description || null
          };
          _context4.next = 14;
          return (0, _adminModel.updatePricingTierModel)(inputJson);
        case 14:
          updatePriceTier = _context4.sent;
          if (!updatePriceTier) {
            _context4.next = 19;
            break;
          }
          return _context4.abrupt("return", (0, _utils.successRequest)(res, _en["default"].TIER_UPDATE));
        case 19:
          return _context4.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 20:
          _context4.next = 26;
          break;
        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          console.log("Update Pricing Tier Error---------" + _context4.t0);
          return _context4.abrupt("return", (0, _utils.serverError)(res, _context4.t0));
        case 26:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 22]]);
  }));
  return function updatePricingTier(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

// Get pricing tier by id
var getPricingTierById = exports.getPricingTierById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var tierId, role, tierData;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          tierId = req.params.tierId;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context5.next = 5;
            break;
          }
          return _context5.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 5:
          _context5.next = 7;
          return (0, _adminModel.pricingTierById)(tierId);
        case 7:
          tierData = _context5.sent;
          if (!tierData) {
            _context5.next = 12;
            break;
          }
          return _context5.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, tierData));
        case 12:
          return _context5.abrupt("return", (0, _utils.noRecordFound)(res));
        case 13:
          _context5.next = 19;
          break;
        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.log("Update Pricing Tier Error---------" + _context5.t0);
          return _context5.abrupt("return", (0, _utils.serverError)(res, _context5.t0));
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 15]]);
  }));
  return function getPricingTierById(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

// User List with pagination
var listContactUsers = exports.listContactUsers = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _req$params2, pageNo, limit, searchText, role, userdata;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$params2 = req.params, pageNo = _req$params2.pageNo, limit = _req$params2.limit, searchText = _req$params2.searchText;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context6.next = 5;
            break;
          }
          return _context6.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 5:
          _context6.next = 7;
          return (0, _adminModel.listContactUsersModel)(pageNo, limit, searchText);
        case 7:
          userdata = _context6.sent;
          return _context6.abrupt("return", res.status(_HttpStatus["default"].success).json({
            'customcode': _HttpStatus["default"].success,
            'message': _en["default"].SUCCESS,
            'status': "success",
            'page': pageNo,
            'limit': limit,
            'total': userdata.totalCount,
            'users': userdata.data
          }));
        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          console.log("Contact Form User List Error---------" + _context6.t0);
          return _context6.abrupt("return", (0, _utils.serverError)(res, _context6.t0));
        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 11]]);
  }));
  return function listContactUsers(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

// Update Contact Us Flag replied yes/no
var updateContactUsFlag = exports.updateContactUsFlag = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var is_replied, id, role, inputJson, _updateContactUsFlag;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          is_replied = req.body.is_replied;
          id = req.params.id;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context7.next = 6;
            break;
          }
          return _context7.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 6:
          inputJson = {
            is_replied: is_replied,
            id: id
          };
          _context7.next = 9;
          return (0, _adminModel.updateContactUsFlagModel)(inputJson);
        case 9:
          _updateContactUsFlag = _context7.sent;
          if (!_updateContactUsFlag) {
            _context7.next = 14;
            break;
          }
          return _context7.abrupt("return", (0, _utils.successRequest)(res, _en["default"].REPLY_STATUS_UPDATE));
        case 14:
          return _context7.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 15:
          _context7.next = 21;
          break;
        case 17:
          _context7.prev = 17;
          _context7.t0 = _context7["catch"](0);
          console.log("Update Contact Us Flag Error---------" + _context7.t0);
          return _context7.abrupt("return", (0, _utils.serverError)(res, _context7.t0));
        case 21:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 17]]);
  }));
  return function updateContactUsFlag(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

// Order List based on userid if receiving in params
var listOrders = exports.listOrders = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var _req$params3, userId, pageNo, limit, searchText, role, userdata;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$params3 = req.params, userId = _req$params3.userId, pageNo = _req$params3.pageNo, limit = _req$params3.limit, searchText = _req$params3.searchText;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context8.next = 5;
            break;
          }
          return _context8.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 5:
          _context8.next = 7;
          return (0, _adminModel.listOrdersModel)(userId, pageNo, limit, searchText);
        case 7:
          userdata = _context8.sent;
          return _context8.abrupt("return", res.status(_HttpStatus["default"].success).json({
            'customcode': _HttpStatus["default"].success,
            'message': _en["default"].SUCCESS,
            'status': "success",
            'page': pageNo,
            'limit': limit,
            'total': userdata.totalCount,
            'data': userdata.data
          }));
        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          console.log("List Orders Error---------" + _context8.t0);
          return _context8.abrupt("return", (0, _utils.serverError)(res, _context8.t0));
        case 15:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 11]]);
  }));
  return function listOrders(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

// Get Order Details By Id
var getOrderDetailsById = exports.getOrderDetailsById = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var orderId, role, orderDetail;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          orderId = req.params.orderId;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context9.next = 5;
            break;
          }
          return _context9.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 5:
          _context9.next = 7;
          return (0, _adminModel.getOrderDetailsByIdModel)(orderId);
        case 7:
          orderDetail = _context9.sent;
          if (!orderDetail) {
            _context9.next = 12;
            break;
          }
          return _context9.abrupt("return", (0, _utils.successRequest)(res, _en["default"].SUCCESS, orderDetail));
        case 12:
          return _context9.abrupt("return", (0, _utils.noRecordFound)(res));
        case 13:
          _context9.next = 19;
          break;
        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](0);
          console.log("Get Order Details By Id---------" + _context9.t0);
          return _context9.abrupt("return", (0, _utils.serverError)(res, _context9.t0));
        case 19:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 15]]);
  }));
  return function getOrderDetailsById(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

// Update Contact Us Flag replied yes/no
var updateOrder = exports.updateOrder = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var _req$body3, shipment_status, comment, id, role, inputJson, isUpdateOrder;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _req$body3 = req.body, shipment_status = _req$body3.shipment_status, comment = _req$body3.comment;
          id = req.params.id;
          role = req.auth.role;
          if (!(_utils.userRoles['Admin'] != role)) {
            _context10.next = 6;
            break;
          }
          return _context10.abrupt("return", (0, _utils.unauthorizedAccess)(res, _en["default"].NOT_ADMIN));
        case 6:
          inputJson = {
            shipment_status: shipment_status,
            comment: comment ? comment : null,
            id: id
          };
          _context10.next = 9;
          return (0, _adminModel.updateOrderModel)(inputJson);
        case 9:
          isUpdateOrder = _context10.sent;
          if (!isUpdateOrder) {
            _context10.next = 14;
            break;
          }
          return _context10.abrupt("return", (0, _utils.successRequest)(res, _en["default"].ORDER_UPDATE));
        case 14:
          return _context10.abrupt("return", (0, _utils.badRequest)(res, _en["default"].SERVER_ERROR));
        case 15:
          _context10.next = 21;
          break;
        case 17:
          _context10.prev = 17;
          _context10.t0 = _context10["catch"](0);
          console.log("Update Order Error---------" + _context10.t0);
          return _context10.abrupt("return", (0, _utils.serverError)(res, _context10.t0));
        case 21:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 17]]);
  }));
  return function updateOrder(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();