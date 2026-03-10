"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _validationMiddleware = require("../middlewares/validation-middleware");
var _authMiddleware = require("../middlewares/auth-middleware");
var _adminService = require("../services/adminService");
var router = (0, _express.Router)();
router.get("/listUsers/:pageNo/:limit/:searchText", _authMiddleware.isAuth, _validationMiddleware.listUsersValidation, _adminService.listUsers);
router.post("/addNewPricingTier", _authMiddleware.isAuth, _validationMiddleware.addNewPricingTierValidation, _adminService.addNewPricingTier);
router.get("/listPricingTier", _authMiddleware.isAuth, _adminService.listPricingTier);
router.get("/getPricingTierById/:tierId", _authMiddleware.isAuth, _adminService.getPricingTierById);
router.put("/updatePricingTier/:tierId", _authMiddleware.isAuth, _validationMiddleware.addNewPricingTierValidation, _adminService.updatePricingTier);
router.get("/listContactUsers/:pageNo/:limit/:searchText", _authMiddleware.isAuth, _validationMiddleware.listUsersValidation, _adminService.listContactUsers); // listUsersValidation its same as we need in contactformusers
router.get("/listOrders/:userId/:pageNo/:limit/:searchText", _authMiddleware.isAuth, _validationMiddleware.listUsersValidation, _adminService.listOrders);
router.get("/getOrderDetailsById/:orderId", _authMiddleware.isAuth, _adminService.getOrderDetailsById);
router.put("/updateContactUsFlag/:id", _authMiddleware.isAuth, _validationMiddleware.contactUsFlagValidation, _adminService.updateContactUsFlag);
router.put("/updateOrder/:id", _authMiddleware.isAuth, _validationMiddleware.updateOrderValidation, _adminService.updateOrder);
var _default = exports["default"] = router;