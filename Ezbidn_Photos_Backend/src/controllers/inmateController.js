import { Router } from "express";
import { federalInmateIdValidation,inmateLocationValidation, saveInmateValidation, inmateDetailIdValidation } from "../middlewares/validation-middleware";
import { isAuth } from "../middlewares/auth-middleware";
import { findFederalInmate, inmateLocation, saveInmate, inmateList, getInmateDetailById, removeInmate } from "../services/inmateService";
const router = Router();

router.get("/findFederalInmate/:inmateId", federalInmateIdValidation, findFederalInmate);
router.get("/inmateLocation/:faclCode", isAuth, inmateLocationValidation, inmateLocation);
router.post("/saveInmate", isAuth, saveInmateValidation, saveInmate);
router.get("/inmateList", isAuth, inmateList);
router.get("/getInmateDetailById/:inmateId", isAuth, inmateDetailIdValidation, getInmateDetailById);
router.put("/removeInmate/:inmateId", isAuth, inmateDetailIdValidation, removeInmate);

export default router;
