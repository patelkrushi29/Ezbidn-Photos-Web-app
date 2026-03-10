"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _user = _interopRequireDefault(require("./user"));
var _default = exports["default"] = function _default(app) {
  app.get("/", function (req, res) {
    res.send("V-1.13.0 => Project server is running...");
  });
  app.use('/api/v1', _user["default"]);
};