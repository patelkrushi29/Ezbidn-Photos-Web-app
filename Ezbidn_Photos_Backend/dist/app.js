"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _path = _interopRequireDefault(require("path"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _index = _interopRequireDefault(require("./routes/index"));
/* eslint-disable */

var fileUpload = require('express-fileupload');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('../swagger.json');
var options = {
  displayRequestDuration: true,
  explorer: true
};
var corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://dev.ezbidn.com'],
  credentials: true
};
_dotenv["default"].config();
var app = (0, _express["default"])();
app.use(function (req, res, next) {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Origin-Agent-Cluster", "?0");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(_bodyParser["default"].json({
  limit: '150mb'
}));
app.use(fileUpload({
  createParentPath: true
}));
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cors["default"])(corsOptions));
app.use(_express["default"]["static"]('public'));
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public')));
(0, _index["default"])(app);
app.use(_bodyParser["default"].urlencoded({
  limit: '150mb',
  extended: true,
  parameterLimit: 50000
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/api-docs', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/swagger-ui-dist')));
app.listen(process.env.PORT, function () {
  console.log("lisetining on ".concat(process.env.PORT));
});