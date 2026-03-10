"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePricingTierModel = exports.updateOrderModel = exports.updateContactUsFlagModel = exports.pricingTierWithoutId = exports.pricingTierById = exports.pricingTier = exports.listUsersModel = exports.listPricingTierModel = exports.listOrdersModel = exports.listContactUsersModel = exports.getOrderDetailsByIdModel = exports.addNewPricingTierModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _db = require("../db.js");
var _s3utils = _interopRequireDefault(require("../utils/s3utils.js"));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var stripe = require("stripe")(process.env.STRIPE_SECRET);
var listUsersModel = exports.listUsersModel = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(pageNo, limit, searchText) {
    var limitCount, pageCount, conditionalWhere, sqlCount, _yield$mysql$query, _yield$mysql$query2, totalCount, sqlData, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          limitCount = limit || 10;
          pageCount = pageNo || 1;
          conditionalWhere = "";
          if (searchText != "null") {
            conditionalWhere = " AND (email LIKE '%".concat(searchText, "%' OR name LIKE '%").concat(searchText, "%')");
          }
          sqlCount = "SELECT count(*) as total FROM users WHERE role IN ('user', 'guest') ".concat(conditionalWhere);
          _context.next = 8;
          return _db.mysql.query(sqlCount);
        case 8:
          _yield$mysql$query = _context.sent;
          _yield$mysql$query2 = (0, _slicedToArray2["default"])(_yield$mysql$query, 1);
          totalCount = _yield$mysql$query2[0];
          sqlData = "SELECT id,name,email,profile_picture,phone,provider,provider_id,customer_id,role,is_verified,created_at,updated_at FROM users WHERE role IN ('user', 'guest')".concat(conditionalWhere, "\n            order by updated_at desc \n            LIMIT ").concat((pageCount - 1) * limitCount, ",").concat(limitCount);
          _context.next = 14;
          return _db.mysql.query(sqlData);
        case 14:
          data = _context.sent;
          return _context.abrupt("return", {
            data: data,
            page: pageCount,
            limit: limitCount,
            totalCount: totalCount.total
          });
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 18]]);
  }));
  return function listUsersModel(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Check if pricing tier is already exist
var pricingTier = exports.pricingTier = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(min_images, max_images) {
    var sqlQuery, _yield$mysql$prepared, _yield$mysql$prepared2, row;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          sqlQuery = "SELECT * from pricing_tiers where min_images=? OR max_images=?";
          _context2.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [min_images, max_images]);
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
  return function pricingTier(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

// Check if pricing tier is already exist without id
var pricingTierWithoutId = exports.pricingTierWithoutId = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id, min_images, max_images) {
    var sqlQuery, _yield$mysql$prepared3, _yield$mysql$prepared4, row;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          sqlQuery = "SELECT * FROM pricing_tiers WHERE id != ? AND (min_images = ? OR max_images = ?)";
          _context3.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [id, min_images, max_images]);
        case 3:
          _yield$mysql$prepared3 = _context3.sent;
          _yield$mysql$prepared4 = (0, _slicedToArray2["default"])(_yield$mysql$prepared3, 1);
          row = _yield$mysql$prepared4[0];
          return _context3.abrupt("return", row);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function pricingTierWithoutId(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

// pricing tier by id
var pricingTierById = exports.pricingTierById = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
    var sqlQuery, _yield$mysql$prepared5, _yield$mysql$prepared6, row;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          sqlQuery = "SELECT * FROM pricing_tiers WHERE id = ?";
          _context4.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [id]);
        case 3:
          _yield$mysql$prepared5 = _context4.sent;
          _yield$mysql$prepared6 = (0, _slicedToArray2["default"])(_yield$mysql$prepared5, 1);
          row = _yield$mysql$prepared6[0];
          return _context4.abrupt("return", row);
        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function pricingTierById(_x9) {
    return _ref4.apply(this, arguments);
  };
}();
var addNewPricingTierModel = exports.addNewPricingTierModel = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(inputJson) {
    var sqlInsert, row;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          sqlInsert = "INSERT INTO pricing_tiers( min_images, max_images, label, description,price_cents) VALUES(?,?,?,?,?)";
          _context5.next = 3;
          return _db.mysql.preparedQuery(sqlInsert, [inputJson.min_images, inputJson.max_images, inputJson.label, inputJson.description, inputJson.price_cents]);
        case 3:
          row = _context5.sent;
          return _context5.abrupt("return", {
            id: row.insertId
          });
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function addNewPricingTierModel(_x10) {
    return _ref5.apply(this, arguments);
  };
}();
var listPricingTierModel = exports.listPricingTierModel = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(user_id) {
    var sqlQuery, rows;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          sqlQuery = "select * from pricing_tiers ORDER BY min_images ASC";
          _context6.next = 3;
          return _db.mysql.query(sqlQuery);
        case 3:
          rows = _context6.sent;
          return _context6.abrupt("return", rows);
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function listPricingTierModel(_x11) {
    return _ref6.apply(this, arguments);
  };
}();
var updatePricingTierModel = exports.updatePricingTierModel = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(inputJson) {
    var sqlQuery, _yield$mysql$prepared7, _yield$mysql$prepared8, row, sqlUpdateQuery;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          sqlQuery = "SELECT * from pricing_tiers where id=?";
          _context7.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inputJson.id]);
        case 3:
          _yield$mysql$prepared7 = _context7.sent;
          _yield$mysql$prepared8 = (0, _slicedToArray2["default"])(_yield$mysql$prepared7, 1);
          row = _yield$mysql$prepared8[0];
          if (!row) {
            _context7.next = 13;
            break;
          }
          sqlUpdateQuery = "UPDATE pricing_tiers set min_images=?, max_images=?, label=?, description=?, price_cents=? where id=?";
          _context7.next = 10;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [inputJson.min_images, inputJson.max_images, inputJson.label, inputJson.description, inputJson.price_cents, inputJson.id]);
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
  return function updatePricingTierModel(_x12) {
    return _ref7.apply(this, arguments);
  };
}();
var listContactUsersModel = exports.listContactUsersModel = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(pageNo, limit, searchText) {
    var limitCount, pageCount, conditionalWhere, sqlCount, _yield$mysql$query3, _yield$mysql$query4, totalCount, sqlData, data;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          limitCount = limit || 10;
          pageCount = pageNo || 1;
          conditionalWhere = "";
          if (searchText != "null") {
            conditionalWhere = " WHERE email LIKE '%".concat(searchText, "%' OR description LIKE '%").concat(searchText, "%'");
          }
          sqlCount = "SELECT count(*) as total FROM contact_us ".concat(conditionalWhere);
          _context8.next = 8;
          return _db.mysql.query(sqlCount);
        case 8:
          _yield$mysql$query3 = _context8.sent;
          _yield$mysql$query4 = (0, _slicedToArray2["default"])(_yield$mysql$query3, 1);
          totalCount = _yield$mysql$query4[0];
          sqlData = "SELECT * FROM contact_us ".concat(conditionalWhere, "\n            order by updated_at desc \n            LIMIT ").concat((pageCount - 1) * limitCount, ",").concat(limitCount);
          _context8.next = 14;
          return _db.mysql.query(sqlData);
        case 14:
          data = _context8.sent;
          return _context8.abrupt("return", {
            data: data,
            page: pageCount,
            limit: limitCount,
            totalCount: totalCount.total
          });
        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          throw _context8.t0;
        case 22:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 18]]);
  }));
  return function listContactUsersModel(_x13, _x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}();
var listOrdersModel = exports.listOrdersModel = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(userId, pageNo, limit, searchText) {
    var limitCount, pageCount, conditionalWhere, conditionalDataWhere, sqlCount, _yield$mysql$query5, _yield$mysql$query6, totalCount, sqlData, data;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          limitCount = limit || 10;
          pageCount = pageNo || 1;
          conditionalWhere = "";
          conditionalDataWhere = "";
          if (userId != "null") {
            conditionalWhere = "WHERE user_id=".concat(userId);
            conditionalDataWhere = "WHERE o.user_id=".concat(userId);
          }
          if (searchText != "null") {
            conditionalWhere = conditionalWhere + " AND customer_id LIKE '%".concat(searchText, "%'");
            conditionalDataWhere = conditionalDataWhere + " AND o.customer_id LIKE '%".concat(searchText, "%'");
          }
          sqlCount = "SELECT count(*) as total FROM orders ".concat(conditionalWhere);
          _context9.next = 10;
          return _db.mysql.query(sqlCount);
        case 10:
          _yield$mysql$query5 = _context9.sent;
          _yield$mysql$query6 = (0, _slicedToArray2["default"])(_yield$mysql$query5, 1);
          totalCount = _yield$mysql$query6[0];
          sqlData = "SELECT o.id,\n                    o.customer_id,o.payment_checkout_id,o.created_at,o.images,o.user_id,o.comment,o.shipment_status,\n                    u.name AS user_name,u.email AS user_email,u.role AS user_role,u.provider AS user_provider,\n                    o.inmate_id,i.nameFirst AS inmate_nameFirst,i.nameMiddle AS inmate_nameMiddle,i.nameLast AS inmate_nameLast,i.inmateNum AS inmate_Num,i.faclName AS inmate_faclName,\n                    i.faclCode AS inmate_faclCode,o.pricing_tier_id,pt.label AS pricing_label,pt.min_images AS pricing_min_images,\n                    pt.max_images AS pricing_max_images,pt.description AS pricing_description FROM orders o\n                    LEFT JOIN users u ON o.user_id = u.id\n                    LEFT JOIN inmates i ON o.inmate_id = i.id\n                    LEFT JOIN pricing_tiers pt ON o.pricing_tier_id = pt.id\n                    ".concat(conditionalDataWhere, "\n                    ORDER BY o.created_at DESC\n                    LIMIT ").concat((pageCount - 1) * limitCount, ", ").concat(limitCount, ";\n                    ");
          _context9.next = 16;
          return _db.mysql.query(sqlData);
        case 16:
          data = _context9.sent;
          return _context9.abrupt("return", {
            data: data,
            page: pageCount,
            limit: limitCount,
            totalCount: totalCount.total
          });
        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          throw _context9.t0;
        case 24:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 20]]);
  }));
  return function listOrdersModel(_x16, _x17, _x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();

// Get Order Details By Id
var getOrderDetailsByIdModel = exports.getOrderDetailsByIdModel = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(id) {
    var sqlQuery, _yield$mysql$query7, _yield$mysql$query8, row, placeholders, sqlImageQuery, values, rows, _iterator, _step, _step$value, index, val, s3ImageURL, session;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          sqlQuery = "SELECT \n     o.id,\n     o.customer_id,\n     o.payment_checkout_id,\n     o.created_at,\n     o.images,\n     o.user_id,\n     o.comment,\n     o.shipment_status,\n     u.name AS user_name,\n     u.email AS user_email,\n     u.role AS user_role,\n     u.provider AS user_provider,\n     o.inmate_id,\n     i.inmateNum AS inmate_inmateNum,\n     i.nameFirst AS inmate_nameFirst,\n     i.nameMiddle AS inmate_nameMiddle,\n     i.nameLast AS inmate_nameLast,\n     i.faclName AS inmate_faclName,\n     i.faclCode AS inmate_faclCode,\n     o.pricing_tier_id,\n     pt.label AS pricing_label,\n     pt.min_images AS pricing_min_images,\n     pt.max_images AS pricing_max_images,\n     pt.description AS pricing_description\n      FROM orders o\n      LEFT JOIN users u ON o.user_id = u.id\n      LEFT JOIN inmates i ON o.inmate_id = i.id\n      LEFT JOIN pricing_tiers pt ON o.pricing_tier_id = pt.id\n      WHERE o.id = ".concat(id);
          _context10.next = 4;
          return _db.mysql.query(sqlQuery);
        case 4:
          _yield$mysql$query7 = _context10.sent;
          _yield$mysql$query8 = (0, _slicedToArray2["default"])(_yield$mysql$query7, 1);
          row = _yield$mysql$query8[0];
          if (!row) {
            _context10.next = 47;
            break;
          }
          placeholders = row.images.map(function () {
            return '?';
          }).join(', ');
          sqlImageQuery = "select * from images where order_id=? AND id IN (".concat(placeholders, ")");
          values = [id].concat((0, _toConsumableArray2["default"])(row.images));
          _context10.next = 13;
          return _db.mysql.preparedQuery(sqlImageQuery, values);
        case 13:
          rows = _context10.sent;
          _iterator = _createForOfIteratorHelper(rows.entries());
          _context10.prev = 15;
          _iterator.s();
        case 17:
          if ((_step = _iterator.n()).done) {
            _context10.next = 31;
            break;
          }
          _step$value = (0, _slicedToArray2["default"])(_step.value, 2), index = _step$value[0], val = _step$value[1];
          if (!(val.image_type === 'local')) {
            _context10.next = 29;
            break;
          }
          if (!val.image) {
            _context10.next = 26;
            break;
          }
          _context10.next = 23;
          return _s3utils["default"].gets3URLDirect(val.image);
        case 23:
          _context10.t0 = _context10.sent;
          _context10.next = 27;
          break;
        case 26:
          _context10.t0 = '';
        case 27:
          s3ImageURL = _context10.t0;
          rows[index].image = s3ImageURL;
        case 29:
          _context10.next = 17;
          break;
        case 31:
          _context10.next = 36;
          break;
        case 33:
          _context10.prev = 33;
          _context10.t1 = _context10["catch"](15);
          _iterator.e(_context10.t1);
        case 36:
          _context10.prev = 36;
          _iterator.f();
          return _context10.finish(36);
        case 39:
          row.images = rows;
          _context10.next = 42;
          return stripe.checkout.sessions.retrieve(row.payment_checkout_id);
        case 42:
          session = _context10.sent;
          row.amount_total = session.amount_total;
          row.transaction_id = session.id;
          row.payment_status = session.payment_status;
          row.payment_email = session.email;
        case 47:
          return _context10.abrupt("return", row);
        case 50:
          _context10.prev = 50;
          _context10.t2 = _context10["catch"](0);
          console.log(_context10.t2);
          throw _context10.t2;
        case 54:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 50], [15, 33, 36, 39]]);
  }));
  return function getOrderDetailsByIdModel(_x20) {
    return _ref10.apply(this, arguments);
  };
}();
var updateContactUsFlagModel = exports.updateContactUsFlagModel = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11(inputJson) {
    var sqlQuery, _yield$mysql$prepared9, _yield$mysql$prepared10, row, sqlUpdateQuery;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          sqlQuery = "SELECT * from contact_us where id=?";
          _context11.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inputJson.id]);
        case 3:
          _yield$mysql$prepared9 = _context11.sent;
          _yield$mysql$prepared10 = (0, _slicedToArray2["default"])(_yield$mysql$prepared9, 1);
          row = _yield$mysql$prepared10[0];
          if (!row) {
            _context11.next = 13;
            break;
          }
          sqlUpdateQuery = "UPDATE contact_us set is_replied=? where id=?";
          _context11.next = 10;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [inputJson.is_replied, inputJson.id]);
        case 10:
          return _context11.abrupt("return", true);
        case 13:
          return _context11.abrupt("return", false);
        case 14:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function updateContactUsFlagModel(_x21) {
    return _ref11.apply(this, arguments);
  };
}();
var updateOrderModel = exports.updateOrderModel = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12(inputJson) {
    var sqlQuery, _yield$mysql$prepared11, _yield$mysql$prepared12, row, sqlUpdateQuery;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          sqlQuery = "SELECT * from orders where id=?";
          _context12.next = 3;
          return _db.mysql.preparedQuery(sqlQuery, [inputJson.id]);
        case 3:
          _yield$mysql$prepared11 = _context12.sent;
          _yield$mysql$prepared12 = (0, _slicedToArray2["default"])(_yield$mysql$prepared11, 1);
          row = _yield$mysql$prepared12[0];
          if (!row) {
            _context12.next = 13;
            break;
          }
          sqlUpdateQuery = "UPDATE orders set shipment_status=?, comment=? where id=?";
          _context12.next = 10;
          return _db.mysql.preparedQuery(sqlUpdateQuery, [inputJson.shipment_status, inputJson.comment, inputJson.id]);
        case 10:
          return _context12.abrupt("return", true);
        case 13:
          return _context12.abrupt("return", false);
        case 14:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function updateOrderModel(_x22) {
    return _ref12.apply(this, arguments);
  };
}();