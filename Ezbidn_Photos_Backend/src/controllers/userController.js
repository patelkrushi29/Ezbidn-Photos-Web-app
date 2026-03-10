import { Router } from "express";
import {
  registerValidation,
  loginValidation,
  socialLoginValidation,
  verifyOtpValidation,
  emailValidation,
  resetPasswordValidation,
  editProfileValidation,
  changePasswordValidation,
  contactUsFormValidation,
  checkoutOrderValidation,
  imageUploadValidation
} from "../middlewares/validation-middleware";
import { isAuth } from "../middlewares/auth-middleware";
import {
  register,
  login,
  socialLogin,
  verifyOtp,
  forgotPassword,
  resendOtp,
  verifyPassOtp,
  resetPassword,
  viewProfile,
  editProfile,
  changePassword,
  contactUsForm,
  pricingTiers,
  guestLogin,
  checkoutOrder,
  imageUpload,
  deleteUploadedImage,
  imageUploadedList,
  getAllOrders,
  checkPaymentStatus,
  getOrderDetailsById
} from "../services/userService";
const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/socialLogin", socialLoginValidation, socialLogin);
router.post("/guestLogin", emailValidation, guestLogin);
router.post("/verifyOtp", verifyOtpValidation, verifyOtp);
router.post("/forgotPassword", emailValidation, forgotPassword);
router.post("/resendOtp", emailValidation, resendOtp);
router.post("/verifyPassOtp", verifyOtpValidation, verifyPassOtp);
router.post("/resetPassword", resetPasswordValidation, resetPassword);
router.get("/viewProfile", isAuth, viewProfile);  
router.put("/editProfile", isAuth, editProfileValidation, editProfile);  
router.put("/changePassword", isAuth, changePasswordValidation, changePassword);  
router.post("/contactUsForm",contactUsFormValidation, contactUsForm);
router.get("/pricingTiers", pricingTiers);

// Order apis
router.post("/imageUpload", isAuth, imageUploadValidation, imageUpload);
router.put("/deleteUploadedImage/:imageId", isAuth, deleteUploadedImage);
router.get("/imageUploadedList/:inmateId", isAuth, imageUploadedList);



router.post("/checkoutOrder", isAuth, checkoutOrderValidation, checkoutOrder);
router.get("/getAllOrders", isAuth, getAllOrders);
router.get("/getOrderDetailsById/:orderId", isAuth, getOrderDetailsById);

// Dummy
router.post("/checkPaymentStatus", isAuth, checkPaymentStatus);

export default router;
