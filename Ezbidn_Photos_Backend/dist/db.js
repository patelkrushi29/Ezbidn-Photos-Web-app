"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
require("dotenv").config();
var mysql = require("mysql2");
var MySqlClient = /*#__PURE__*/function () {
  function MySqlClient() {
    (0, _classCallCheck2["default"])(this, MySqlClient);
    this.pool = null;
    this.connect();
  }
  return (0, _createClass2["default"])(MySqlClient, [{
    key: "connect",
    value: function () {
      var _connect = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var dbConfig;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              dbConfig = {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                multipleStatements: true,
                charset: process.env.CHAR_SET,
                dateStrings: true,
                connectionLimit: 100,
                "pool": {
                  "max": 10,
                  "min": 0,
                  "acquire": 30000,
                  "idle": 10000
                }
              };
              this.pool = mysql.createPool(dbConfig);
              _context.next = 9;
              break;
            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](0);
              console.error('Error in AWS db', _context.t0);
              throw _context.t0;
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 5]]);
      }));
      function connect() {
        return _connect.apply(this, arguments);
      }
      return connect;
    }()
  }, {
    key: "query",
    value: function query(sql) {
      var _this = this;
      if (!this.pool) {
        throw new Error('MySQL connection pool not initialized');
      }
      return new Promise(function (resolve, reject) {
        _this.pool.getConnection(function (err, connection) {
          if (err) {
            console.error(err);
            reject(new Error("".concat(err.message, " - Unable to execute query")));
            return;
          }
          connection.config.dateStrings = true;
          connection.query(sql, function (error, rows) {
            connection.release();
            if (error) {
              console.log('SQL WITH ERROR ==>');
              console.log(sql);
              console.log(error);
              reject(error);
            } else {
              resolve(rows);
            }
          });
        });
      });
    }
  }, {
    key: "preparedQuery",
    value: function preparedQuery(sql, params) {
      var _this2 = this;
      if (!this.pool) {
        throw new Error('MySQL connection pool not initialized');
      }
      return new Promise(function (resolve, reject) {
        _this2.pool.getConnection(function (err, connection) {
          if (err) {
            console.error(err);
            reject(new Error('Unable to execute query'));
            return;
          }
          connection.config.namedPlaceholders = true;
          connection.execute(sql, params || [], function (error, rows) {
            connection.release();
            if (error) {
              console.log(error);
              reject(error);
            } else {
              resolve(rows);
            }
          });
        });
      });
    }
  }, {
    key: "formatQuery",
    value: function formatQuery(sql, params) {
      var _this3 = this;
      if (!this.pool) {
        throw new Error('MySQL connection pool not initialized');
      }
      return new Promise(function (resolve, reject) {
        _this3.pool.getConnection(function (err, connection) {
          if (err) {
            console.error(err);
            reject(new Error('Unable to execute query'));
            return;
          }
          resolve(connection.format(sql, params));
        });
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.pool) {
        try {
          this.pool.end();
          console.log("DB: DB Connection Closed");
        } catch (e) {
          console.log("DB: ERR: DB Connection Close ", e);
        }
      }
    }
  }]);
}();
module.exports.mysql = new MySqlClient();