"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _validationMiddleware = require("../middlewares/validation-middleware");
var _authMiddleware = require("../middlewares/auth-middleware");
var _inmateService = require("../services/inmateService");
var router = (0, _express.Router)();
router.get("/findFederalInmate/:inmateId", _validationMiddleware.federalInmateIdValidation, _inmateService.findFederalInmate);
router.get("/inmateLocation/:faclCode", _authMiddleware.isAuth, _validationMiddleware.inmateLocationValidation, _inmateService.inmateLocation);
router.post("/saveInmate", _authMiddleware.isAuth, _validationMiddleware.saveInmateValidation, _inmateService.saveInmate);
router.get("/inmateList", _authMiddleware.isAuth, _inmateService.inmateList);
router.get("/getInmateDetailById/:inmateId", _authMiddleware.isAuth, _validationMiddleware.inmateDetailIdValidation, _inmateService.getInmateDetailById);
router.put("/removeInmate/:inmateId", _authMiddleware.isAuth, _validationMiddleware.inmateDetailIdValidation, _inmateService.removeInmate);
var _default = exports["default"] = router;