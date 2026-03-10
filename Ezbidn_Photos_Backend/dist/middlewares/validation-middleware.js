"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyOtpValidation = exports.updateOrderValidation = exports.socialLoginValidation = exports.saveInmateValidation = exports.resetPasswordValidation = exports.registerValidation = exports.loginValidation = exports.listUsersValidation = exports.inmateLocationValidation = exports.inmateDetailIdValidation = exports.imageUploadValidation = exports.headerValidation = exports.federalInmateIdValidation = exports.emailValidation = exports.editProfileValidation = exports.contactUsFormValidation = exports.contactUsFlagValidation = exports.checkoutOrderValidation = exports.changePasswordValidation = exports.addNewPricingTierValidation = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _validate = _interopRequireDefault(require("../utils/validate"));
var _utils = require("../utils");
var headerValidation = exports.headerValidation = function headerValidation(req, res, next) {
  var validationRule = {
    "devicetype": ['required', {
      'in': (0, _toConsumableArray2["default"])(_utils.deviceTypes)
    }],
    "uuid": "required|string"
  };
  (0, _validate["default"])(req.headers, validationRule, {
    required: ':attribute value is missing in api headers'
  }, function (err, status) {
    if (!status) {
      var _err$errors, _err$errors2;
      var error = ((_err$errors = err.errors) === null || _err$errors === void 0 || (_err$errors = _err$errors.devicetype) === null || _err$errors === void 0 ? void 0 : _err$errors[0]) || ((_err$errors2 = err.errors) === null || _err$errors2 === void 0 || (_err$errors2 = _err$errors2.uuid) === null || _err$errors2 === void 0 ? void 0 : _err$errors2[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var registerValidation = exports.registerValidation = function registerValidation(req, res, next) {
  var validationRule = {
    name: "required|string",
    email: "required|email",
    password: "required|string",
    phone: "string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors3, _err$errors4, _err$errors5, _err$errors6;
      var error = ((_err$errors3 = err.errors) === null || _err$errors3 === void 0 || (_err$errors3 = _err$errors3.name) === null || _err$errors3 === void 0 ? void 0 : _err$errors3[0]) || ((_err$errors4 = err.errors) === null || _err$errors4 === void 0 || (_err$errors4 = _err$errors4.email) === null || _err$errors4 === void 0 ? void 0 : _err$errors4[0]) || ((_err$errors5 = err.errors) === null || _err$errors5 === void 0 || (_err$errors5 = _err$errors5.phone) === null || _err$errors5 === void 0 ? void 0 : _err$errors5[0]) || ((_err$errors6 = err.errors) === null || _err$errors6 === void 0 || (_err$errors6 = _err$errors6.password) === null || _err$errors6 === void 0 ? void 0 : _err$errors6[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var loginValidation = exports.loginValidation = function loginValidation(req, res, next) {
  var validationRule = {
    email: "required|email",
    password: "required|string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.email ? err.errors.email[0] : err.errors.password[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var socialLoginValidation = exports.socialLoginValidation = function socialLoginValidation(req, res, next) {
  var validationRule = {
    name: "required|string",
    email: "email|string",
    provider: ['required', {
      'in': (0, _toConsumableArray2["default"])(_utils.providerTypes)
    }],
    provider_id: "required|string",
    phone: "string",
    profile_picture: "string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors7, _err$errors8, _err$errors9;
      var error = ((_err$errors7 = err.errors) === null || _err$errors7 === void 0 || (_err$errors7 = _err$errors7.name) === null || _err$errors7 === void 0 ? void 0 : _err$errors7[0]) || ((_err$errors8 = err.errors) === null || _err$errors8 === void 0 || (_err$errors8 = _err$errors8.provider) === null || _err$errors8 === void 0 ? void 0 : _err$errors8[0]) || ((_err$errors9 = err.errors) === null || _err$errors9 === void 0 || (_err$errors9 = _err$errors9.provider_id) === null || _err$errors9 === void 0 ? void 0 : _err$errors9[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var verifyOtpValidation = exports.verifyOtpValidation = function verifyOtpValidation(req, res, next) {
  var validationRule = {
    email: "required|email",
    otp: "required|string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.email ? err.errors.email[0] : err.errors.otp[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var emailValidation = exports.emailValidation = function emailValidation(req, res, next) {
  var validationRule = {
    "email": "required|email"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors10;
      var error = (_err$errors10 = err.errors) === null || _err$errors10 === void 0 || (_err$errors10 = _err$errors10.email) === null || _err$errors10 === void 0 ? void 0 : _err$errors10[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var resetPasswordValidation = exports.resetPasswordValidation = function resetPasswordValidation(req, res, next) {
  var validationRule = {
    verificationId: "required",
    email: "required|email",
    newpassword: "required|string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors11, _err$errors12, _err$errors13;
      var error = ((_err$errors11 = err.errors) === null || _err$errors11 === void 0 || (_err$errors11 = _err$errors11.verificationId) === null || _err$errors11 === void 0 ? void 0 : _err$errors11[0]) || ((_err$errors12 = err.errors) === null || _err$errors12 === void 0 || (_err$errors12 = _err$errors12.email) === null || _err$errors12 === void 0 ? void 0 : _err$errors12[0]) || ((_err$errors13 = err.errors) === null || _err$errors13 === void 0 || (_err$errors13 = _err$errors13.newpassword) === null || _err$errors13 === void 0 ? void 0 : _err$errors13[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var editProfileValidation = exports.editProfileValidation = function editProfileValidation(req, res, next) {
  var validationRule = {
    name: "required|string",
    phone: "string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors14;
      var error = (_err$errors14 = err.errors) === null || _err$errors14 === void 0 || (_err$errors14 = _err$errors14.name) === null || _err$errors14 === void 0 ? void 0 : _err$errors14[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var changePasswordValidation = exports.changePasswordValidation = function changePasswordValidation(req, res, next) {
  var validationRule = {
    oldPassword: "required|string",
    newPassword: "required|string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.oldPassword ? err.errors.oldPassword[0] : err.errors.newPassword[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var contactUsFormValidation = exports.contactUsFormValidation = function contactUsFormValidation(req, res, next) {
  var validationRule = {
    email: "required|email",
    description: "required|string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors15, _err$errors16;
      var error = ((_err$errors15 = err.errors) === null || _err$errors15 === void 0 || (_err$errors15 = _err$errors15.email) === null || _err$errors15 === void 0 ? void 0 : _err$errors15[0]) || ((_err$errors16 = err.errors) === null || _err$errors16 === void 0 || (_err$errors16 = _err$errors16.description) === null || _err$errors16 === void 0 ? void 0 : _err$errors16[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var listUsersValidation = exports.listUsersValidation = function listUsersValidation(req, res, next) {
  var validationRule = {
    "pageNo": "required",
    "limit": "required"
  };
  (0, _validate["default"])(req.params, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.pageNo && err.errors.pageNo[0] || err.errors.limit && err.errors.limit[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var federalInmateIdValidation = exports.federalInmateIdValidation = function federalInmateIdValidation(req, res, next) {
  var validationRule = {
    "inmateId": "required|string"
  };
  (0, _validate["default"])(req.params, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.inmateId && err.errors.inmateId[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var inmateLocationValidation = exports.inmateLocationValidation = function inmateLocationValidation(req, res, next) {
  var validationRule = {
    "faclCode": "required|string"
  };
  (0, _validate["default"])(req.params, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.faclCode && err.errors.faclCode[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var saveInmateValidation = exports.saveInmateValidation = function saveInmateValidation(req, res, next) {
  var validationRule = {
    nameFirst: "required|string",
    nameMiddle: "string",
    nameLast: "string",
    sex: "string",
    race: "string",
    age: "string",
    inmateNum: "required|string",
    faclCode: "required|string",
    faclName: "required|string",
    faclType: "required|string",
    faclURL: "string",
    releaseCode: "string",
    projRelDate: "string",
    actRelDate: "string"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors17, _err$errors18, _err$errors19, _err$errors20, _err$errors21, _err$errors22, _err$errors23, _err$errors24, _err$errors25, _err$errors26, _err$errors27, _err$errors28, _err$errors29, _err$errors30;
      var error = ((_err$errors17 = err.errors) === null || _err$errors17 === void 0 || (_err$errors17 = _err$errors17.nameFirst) === null || _err$errors17 === void 0 ? void 0 : _err$errors17[0]) || ((_err$errors18 = err.errors) === null || _err$errors18 === void 0 || (_err$errors18 = _err$errors18.nameMiddle) === null || _err$errors18 === void 0 ? void 0 : _err$errors18[0]) || ((_err$errors19 = err.errors) === null || _err$errors19 === void 0 || (_err$errors19 = _err$errors19.nameLast) === null || _err$errors19 === void 0 ? void 0 : _err$errors19[0]) || ((_err$errors20 = err.errors) === null || _err$errors20 === void 0 || (_err$errors20 = _err$errors20.sex) === null || _err$errors20 === void 0 ? void 0 : _err$errors20[0]) || ((_err$errors21 = err.errors) === null || _err$errors21 === void 0 || (_err$errors21 = _err$errors21.race) === null || _err$errors21 === void 0 ? void 0 : _err$errors21[0]) || ((_err$errors22 = err.errors) === null || _err$errors22 === void 0 || (_err$errors22 = _err$errors22.age) === null || _err$errors22 === void 0 ? void 0 : _err$errors22[0]) || ((_err$errors23 = err.errors) === null || _err$errors23 === void 0 || (_err$errors23 = _err$errors23.inmateNum) === null || _err$errors23 === void 0 ? void 0 : _err$errors23[0]) || ((_err$errors24 = err.errors) === null || _err$errors24 === void 0 || (_err$errors24 = _err$errors24.faclCode) === null || _err$errors24 === void 0 ? void 0 : _err$errors24[0]) || ((_err$errors25 = err.errors) === null || _err$errors25 === void 0 || (_err$errors25 = _err$errors25.faclName) === null || _err$errors25 === void 0 ? void 0 : _err$errors25[0]) || ((_err$errors26 = err.errors) === null || _err$errors26 === void 0 || (_err$errors26 = _err$errors26.faclType) === null || _err$errors26 === void 0 ? void 0 : _err$errors26[0]) || ((_err$errors27 = err.errors) === null || _err$errors27 === void 0 || (_err$errors27 = _err$errors27.faclURL) === null || _err$errors27 === void 0 ? void 0 : _err$errors27[0]) || ((_err$errors28 = err.errors) === null || _err$errors28 === void 0 || (_err$errors28 = _err$errors28.releaseCode) === null || _err$errors28 === void 0 ? void 0 : _err$errors28[0]) || ((_err$errors29 = err.errors) === null || _err$errors29 === void 0 || (_err$errors29 = _err$errors29.projRelDate) === null || _err$errors29 === void 0 ? void 0 : _err$errors29[0]) || ((_err$errors30 = err.errors) === null || _err$errors30 === void 0 || (_err$errors30 = _err$errors30.actRelDate) === null || _err$errors30 === void 0 ? void 0 : _err$errors30[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var inmateDetailIdValidation = exports.inmateDetailIdValidation = function inmateDetailIdValidation(req, res, next) {
  var validationRule = {
    "inmateId": "required|string"
  };
  (0, _validate["default"])(req.params, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.inmateId && err.errors.inmateId[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var addNewPricingTierValidation = exports.addNewPricingTierValidation = function addNewPricingTierValidation(req, res, next) {
  var validationRule = {
    min_images: "required|integer",
    max_images: "required|integer",
    label: "required|string",
    price_cents: "required|integer"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors31, _err$errors32, _err$errors33, _err$errors34;
      var error = ((_err$errors31 = err.errors) === null || _err$errors31 === void 0 || (_err$errors31 = _err$errors31.min_images) === null || _err$errors31 === void 0 ? void 0 : _err$errors31[0]) || ((_err$errors32 = err.errors) === null || _err$errors32 === void 0 || (_err$errors32 = _err$errors32.max_images) === null || _err$errors32 === void 0 ? void 0 : _err$errors32[0]) || ((_err$errors33 = err.errors) === null || _err$errors33 === void 0 || (_err$errors33 = _err$errors33.label) === null || _err$errors33 === void 0 ? void 0 : _err$errors33[0]) || ((_err$errors34 = err.errors) === null || _err$errors34 === void 0 || (_err$errors34 = _err$errors34.price_cents) === null || _err$errors34 === void 0 ? void 0 : _err$errors34[0]);
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var imageUploadValidation = exports.imageUploadValidation = function imageUploadValidation(req, res, next) {
  var validationRule = {
    "inmate_id": "required|string",
    "image_type": ['required', {
      'in': (0, _toConsumableArray2["default"])(_utils.imageTypes)
    }]
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.inmate_id && err.errors.inmate_id[0] || err.errors.image_type && err.errors.image_type[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var checkoutOrderValidation = exports.checkoutOrderValidation = function checkoutOrderValidation(req, res, next) {
  var validationRule = {
    "inmate_id": "required|string",
    "customer_id": "required|string",
    "pricing_tier_id": "required|string",
    "images": "required|array"
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var error = err.errors.inmate_id && err.errors.inmate_id[0] || err.errors.customer_id && err.errors.customer_id[0] || err.errors.pricing_tier_id && err.errors.pricing_tier_id[0] || err.errors.images && err.errors.images[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var contactUsFlagValidation = exports.contactUsFlagValidation = function contactUsFlagValidation(req, res, next) {
  var validationRule = {
    is_replied: ['required', {
      'in': (0, _toConsumableArray2["default"])(_utils.repliyFlag)
    }]
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors35;
      var error = (_err$errors35 = err.errors) === null || _err$errors35 === void 0 || (_err$errors35 = _err$errors35.is_replied) === null || _err$errors35 === void 0 ? void 0 : _err$errors35[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};
var updateOrderValidation = exports.updateOrderValidation = function updateOrderValidation(req, res, next) {
  var validationRule = {
    shipment_status: ['required', {
      'in': (0, _toConsumableArray2["default"])(_utils.orderStatus)
    }]
  };
  (0, _validate["default"])(req.body, validationRule, {}, function (err, status) {
    if (!status) {
      var _err$errors36;
      var error = (_err$errors36 = err.errors) === null || _err$errors36 === void 0 || (_err$errors36 = _err$errors36.shipment_status) === null || _err$errors36 === void 0 ? void 0 : _err$errors36[0];
      (0, _utils.validationError)(res, error);
    } else {
      next();
    }
  });
};