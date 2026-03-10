"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _validationMiddleware = require("../middlewares/validation-middleware");
var _authMiddleware = require("../middlewares/auth-middleware");
var _userService = require("../services/userService");
var router = (0, _express.Router)();
router.post("/register", _validationMiddleware.registerValidation, _userService.register);
router.post("/login", _validationMiddleware.loginValidation, _userService.login);
router.post("/socialLogin", _validationMiddleware.socialLoginValidation, _userService.socialLogin);
router.post("/guestLogin", _validationMiddleware.emailValidation, _userService.guestLogin);
router.post("/verifyOtp", _validationMiddleware.verifyOtpValidation, _userService.verifyOtp);
router.post("/forgotPassword", _validationMiddleware.emailValidation, _userService.forgotPassword);
router.post("/resendOtp", _validationMiddleware.emailValidation, _userService.resendOtp);
router.post("/verifyPassOtp", _validationMiddleware.verifyOtpValidation, _userService.verifyPassOtp);
router.post("/resetPassword", _validationMiddleware.resetPasswordValidation, _userService.resetPassword);
router.get("/viewProfile", _authMiddleware.isAuth, _userService.viewProfile);
router.put("/editProfile", _authMiddleware.isAuth, _validationMiddleware.editProfileValidation, _userService.editProfile);
router.put("/changePassword", _authMiddleware.isAuth, _validationMiddleware.changePasswordValidation, _userService.changePassword);
router.post("/contactUsForm", _validationMiddleware.contactUsFormValidation, _userService.contactUsForm);
router.get("/pricingTiers", _userService.pricingTiers);

// Order apis
router.post("/imageUpload", _authMiddleware.isAuth, _validationMiddleware.imageUploadValidation, _userService.imageUpload);
router.put("/deleteUploadedImage/:imageId", _authMiddleware.isAuth, _userService.deleteUploadedImage);
router.get("/imageUploadedList/:inmateId", _authMiddleware.isAuth, _userService.imageUploadedList);
router.post("/checkoutOrder", _authMiddleware.isAuth, _validationMiddleware.checkoutOrderValidation, _userService.checkoutOrder);
router.get("/getAllOrders", _authMiddleware.isAuth, _userService.getAllOrders);
router.get("/getOrderDetailsById/:orderId", _authMiddleware.isAuth, _userService.getOrderDetailsById);

// Dummy
router.post("/checkPaymentStatus", _authMiddleware.isAuth, _userService.checkPaymentStatus);
var _default = exports["default"] = router;