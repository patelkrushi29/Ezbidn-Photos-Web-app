import { Router } from "express";
import { listUsersValidation, addNewPricingTierValidation, contactUsFlagValidation, updateOrderValidation } from "../middlewares/validation-middleware";
import { isAuth } from "../middlewares/auth-middleware";
import { listUsers, addNewPricingTier, listPricingTier, updatePricingTier, getPricingTierById, listContactUsers, listOrders,getOrderDetailsById,updateContactUsFlag,updateOrder } from "../services/adminService";
const router = Router();

router.get("/listUsers/:pageNo/:limit/:searchText",isAuth,listUsersValidation,listUsers);
router.post("/addNewPricingTier",isAuth, addNewPricingTierValidation, addNewPricingTier);
router.get("/listPricingTier",isAuth, listPricingTier);
router.get("/getPricingTierById/:tierId",isAuth, getPricingTierById);
router.put("/updatePricingTier/:tierId",isAuth, addNewPricingTierValidation, updatePricingTier);
router.get("/listContactUsers/:pageNo/:limit/:searchText",isAuth,listUsersValidation,listContactUsers); // listUsersValidation its same as we need in contactformusers
router.get("/listOrders/:userId/:pageNo/:limit/:searchText",isAuth,listUsersValidation,listOrders);
router.get("/getOrderDetailsById/:orderId", isAuth, getOrderDetailsById);
router.put("/updateContactUsFlag/:id", isAuth, contactUsFlagValidation, updateContactUsFlag);
router.put("/updateOrder/:id", isAuth, updateOrderValidation, updateOrder);
export default router;
