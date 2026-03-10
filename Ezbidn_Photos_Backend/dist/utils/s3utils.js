"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
// const AWS = require('aws-sdk')
// const dbHandle = require('../db.js').mysql;

var _require = require("@aws-sdk/client-s3"),
  S3Client = _require.S3Client,
  PutObjectCommand = _require.PutObjectCommand,
  DeleteObjectsCommand = _require.DeleteObjectsCommand,
  GetObjectCommand = _require.GetObjectCommand;
var _require2 = require("@aws-sdk/s3-request-presigner"),
  getSignedUrl = _require2.getSignedUrl;
var client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  }
});

// const S3 = new AWS.S3({
//   region: process.env.REGION,
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_KEY
// })
var s3Controller = {};

// To Upload file on s3
// s3Controller.uploadS3 = async (file, filename) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${filename}`,
//       Body: file.data,
//       ContentType: `${file.mimetype}`,
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.upload(params, (error, data) => {
//         if (error) {
//           reject(error)
//           // console.log("error", error)
//         } else {
//         //   console.log('success', data)
//           resolve(data.Key)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     return false
//   }
// }

// // Delete multiple files

// s3Controller.deleteObjectS3 = async (keyArray) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Delete: { Objects: [...keyArray] },
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.deleteObjects(params, (error, data) => {
//         if (error) {
//           reject(error)
//           // console.log("error", error)
//         } else {
//           console.log('success delete file', data)
//           resolve(data.Location)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     return false
//   }
// }

// // Get s3 url from private bucket and push url in db for local image path
// s3Controller.gets3URL = async (keyName) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`,
//       Expires: 60*60*24
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.getSignedUrl('getObject', params, async(error, data) => {
//         if (error) {
//           reject(error)
//         } else {
//           let imageName =  keyName.split('/');
//           let keyValueName = imageName && imageName.length > 1 ? imageName[imageName.length - 1] : keyName;
//           const shortUrl =  await generateShortUrl(data, keyValueName);
//           resolve(shortUrl)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     // console.log('errerrerr', err, keyName)
//     return ''
//   }
// }

// const generateShortUrl = async (longUrl, keyName) => {
//   let sqlInsertOrUpdate = `INSERT INTO s3filepath (keyname, s3url,created_at) VALUES ('${keyName}','${longUrl}',CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE keyname='${keyName}',s3url = '${longUrl}',
//   created_at = CURRENT_TIMESTAMP`;
//   await dbHandle.query(sqlInsertOrUpdate);
//   const shortUrl = process.env.SERVER_API_URL +'/api/v1/app/fileUrl/'+ keyName;
//   return shortUrl;
// };

// // Get s3 url from private bucket and send it as reponse without saving url in db
// s3Controller.gets3URLDirect = async (keyName) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`,
//       Expires: 60*60*24
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.getSignedUrl('getObject', params, async(error, data) => {
//         if (error) {
//           reject(error)
//         } else {
//           resolve(data)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     return ''
//   }
// }

// s3Controller.gets3Data = async (keyName) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`
//     }
//     const s3Response = await S3.getObject(params).promise();
//     const resData = s3Response.Body.toString('utf-8');
//     return resData
//   } catch (err) {
//     return ''
//   }
// }

/*888888888888888888888888888888888888888888888888 New S3 Code 888888888888888888888888888888888*/
s3Controller.uploadS3 = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(file, filename) {
    var params, command;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          params = {
            Bucket: process.env.BUCKET_NAME,
            Key: "".concat(filename),
            Body: file.data,
            ContentType: "".concat(file.mimetype)
          };
          command = new PutObjectCommand(params);
          _context.next = 5;
          return client.send(command);
        case 5:
          return _context.abrupt("return", filename);
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", false);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// s3Controller.gets3URL = async (keyName) => {
//   // Get s3 url from private bucket
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`,
//       Expires: 60*60*24
//     }
//     const command = new GetObjectCommand(params);
//     const signedUrl = await getSignedUrl(client, command, {expiresIn:60*60*24});
//     let imageName =  keyName.split('/');
//     let keyValueName = imageName && imageName.length > 1 ? imageName[imageName.length - 1] : keyName;
//     const shortUrl =  await generateShortUrl(signedUrl, keyValueName);
//     return shortUrl;
//   } catch (err) {
//     return ''
//   }
// }

// const generateShortUrl = async (longUrl, keyName) => {
//   let sqlInsertOrUpdate = `INSERT INTO s3filepath (keyname, s3url,created_at) VALUES ('${keyName}','${longUrl}',CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE keyname='${keyName}',s3url = '${longUrl}',
//   created_at = CURRENT_TIMESTAMP`;
//   await dbHandle.query(sqlInsertOrUpdate);
//   const shortUrl = process.env.SERVER_API_URL +'/api/v1/app/fileUrl/'+ keyName;
//   return shortUrl;
// };

// Get s3 url from private bucket and send it as reponse without saving url in db
s3Controller.gets3URLDirect = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(keyName) {
    var params, command, signedUrl;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          params = {
            Bucket: process.env.BUCKET_NAME,
            Key: "".concat(keyName),
            Expires: 60 * 60 * 24
          };
          command = new GetObjectCommand(params);
          _context2.next = 5;
          return getSignedUrl(client, command, {
            expiresIn: 60 * 60 * 24
          });
        case 5:
          signedUrl = _context2.sent;
          return _context2.abrupt("return", signedUrl);
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", '');
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();
s3Controller.deleteObjectS3 = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(keyArray) {
    var params, command;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          params = {
            Bucket: process.env.BUCKET_NAME,
            Delete: {
              Objects: (0, _toConsumableArray2["default"])(keyArray)
            }
          };
          command = new DeleteObjectsCommand(params);
          _context3.next = 5;
          return client.send(command);
        case 5:
          return _context3.abrupt("return", true);
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", false);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}();
module.exports = s3Controller;