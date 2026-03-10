import {
    checkEmailExists,
    registerModel,
    loginModel,
    socialLoginModel,
    verifyOtpModel,
    forgotPasswordModel,
    resendOtpModel,
    verifyPassOtpModel,
    resetPasswordModel,
    viewProfileModel,
    editProfileModel,
    changePasswordModel,
    addContactUsFormModel,
    guestLoginModel,
    imageUploadModel,
    deleteUploadedImageModel,
    imageById,
    imagesByinmateId,
    imagesByIds,
    checkoutOrderModel,
    getAllOrdersModel,
    checkPaymentStatusModel,
    getOrderDetailsByIdModel
  } from "../models/userModel";
  import {listPricingTierModel, pricingTierById} from "../models/adminModel";
  import {inmateById} from "../models/inmateModel";
  import { alreadyExist, serverError, OTP, notVerified, successRequest, badRequest, emailNotExist, validationError, noRecordFound, unauthorizedAccess, userRoles, alreadyRegisteredUser, alreadyOtherSocialUser  } from "../utils";
  import HttpStatus from "../utils/HttpStatus";
  import Messages from "../utils/en.json";
  import s3Util from "../utils/s3utils.js";
  import fs from 'fs';
  import path from 'path';
  const sgMail = require('@sendgrid/mail');
  const __dirname = path.resolve(path.dirname('../'));
  const stripe = require("stripe")(process.env.STRIPE_SECRET);

  // OTP send function for registered users
const OtpEmailTemplate = async (email, mailBody, email_subject) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
      let mailOptions = {
        from: {
          email: process.env.SENDER_EMAIL_MAIN,
          name: 'Project'  // Add the sender's name here
      },
          to: email,
          subject: email_subject,
          html: mailBody
      };
      await sgMail.send(mailOptions);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

export const register = async (req, res) => {
    try {
      const { name, email, password,phone } = req.body;
      const { devicetype, uuid } = req.headers;
      let isEmailExists = await checkEmailExists(email);
      if (isEmailExists && isEmailExists.role !== 'guest') {
        return alreadyExist(res, Messages.EMAIL_EXIST);
      }else if(isEmailExists && isEmailExists.role === 'guest'){
        let otp = OTP();
        const temp = {
          name: name,
          email: email,
          password: password,
          phone: phone || null,
          otp:otp,
          devicetype: devicetype,
          uuid: uuid || null,
          provider: 'email',
          isGuestUser:true
        };
        let newUser = await registerModel(temp);
        let mailBody = fs.readFileSync(__dirname + process.env.REGISTRATION_EMAIL_TEMPLATE).toString();
        mailBody = mailBody.replace(/{{name}}/g, newUser.name);
        mailBody = mailBody.replace(/{{otp}}/g, otp);
        OtpEmailTemplate(newUser.email, mailBody, Messages.OTP_SENT_EMAIL_SUBJECT);
        return successRequest(res, Messages.REGISTER_SUCCESS, {});
      }else{
        let otp = OTP();
        const temp = {
          name: name,
          email: email,
          password: password,
          phone: phone || null,
          otp:otp,
          devicetype: devicetype,
          uuid: uuid || null,
          provider: 'email',
          isGuestUser:false
        };
        let newUser = await registerModel(temp);
        let mailBody = fs.readFileSync(__dirname + process.env.REGISTRATION_EMAIL_TEMPLATE).toString();
        mailBody = mailBody.replace(/{{name}}/g, newUser.name);
        mailBody = mailBody.replace(/{{otp}}/g, otp);
        OtpEmailTemplate(newUser.email, mailBody, Messages.OTP_SENT_EMAIL_SUBJECT);
        return successRequest(res, Messages.REGISTER_SUCCESS, {});
      }
    } catch (error) {
      console.log("Registration Error-------------", error);
      return serverError(res, error);
    }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { devicetype, uuid } = req.headers;
    const temp = {
      email: email,
      password: password,
      devicetype: devicetype,
      uuid: uuid || null
    }
    let userLogin = await loginModel(temp);
    if (userLogin) {
      if (userLogin.validation === 1) {
        return badRequest(res, Messages.INVALID_CREDENTIALS);
      } else if (userLogin.validation === 2) {
          return notVerified(res, Messages.NOT_VERIFIED_ACCOUNT);
      }else if (userLogin.validation === 4) {
        return emailNotExist(res);
      }else if (userLogin.validation === 5) {
        return badRequest(res, Messages.GUEST_LOGIN_REG);
      }
      else{
        return res.status(HttpStatus.success).json({
          customcode: HttpStatus.success,
          message: Messages.SUCCESS,
          status: true,
          data: userLogin.data,
          token: userLogin.token,
        });
      }
    } else {
      return badRequest(res,Messages.INVALID_CREDENTIALS);
    }
  } catch (error) {
    console.log("Login Error-----------", error);
    return serverError(res, error);
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { name, email, phone, provider, provider_id, profile_picture } = req.body;
    const { devicetype, uuid } = req.headers;
    const temp = {
      name: name,
      email: email,
      phone: phone || null,
      provider: provider,
      provider_id: provider_id,
      devicetype: devicetype,
      uuid: uuid || null,
      profile_picture:profile_picture || null
    }
    let userLogin = await socialLoginModel(temp);
    if (userLogin && userLogin.isFlag === 1)  {
      return alreadyRegisteredUser(res);
    }else if (userLogin && userLogin.isFlag === 2)  {
      return alreadyOtherSocialUser(res);
    }else{
      return res.status(HttpStatus.success).json({
        customcode: HttpStatus.success,
        message: Messages.SUCCESS,
        status: true,
        data: userLogin.data,
        token: userLogin.token,
      });
  
    }
  } catch (error) {
    console.log("Social Login Error-----------", error);
    return serverError(res, error);
  }
};


export const verifyOtp = async (req, res) => {
  try {
      const { email, otp } = req.body;
      let isVerified = await verifyOtpModel(email, otp);
      isVerified ? successRequest(res, Messages.OTP_MATCHED, {}) : badRequest(res, Messages.OTP_NOT_MATCHED);
  } catch (error) {
      console.log("Verify Otp error -------------", error)
      return serverError(res, error);
  }
}

export const forgotPassword = async (req, res) => {
  try {
      const {email} = req.body;
      let otp = OTP();
      let result = await forgotPasswordModel(email,otp);
      if (result.type == 'otp_sent' || result.type == 'not_verified') {
        let mailBody = fs.readFileSync(__dirname + process.env.FORGOT_PASSWORD_EMAIL_TEMPLATE).toString();
        mailBody = mailBody.replace(/{{name}}/g, result.name);
        mailBody = mailBody.replace(/{{otp}}/g, otp);
        OtpEmailTemplate(email, mailBody, Messages.FORGOT_PASSWORD_EMAIL_SUBJECT);
        return successRequest(res,Messages.OTP_SENT,{})
      } else if (result.type == 'limit_exceed'){
        return badRequest(res, Messages.OTP_ATTEMPTS);
      } else {
        return emailNotExist(res)
      }
  } catch (error) {
      console.log("Forgot Password Error ----------", error);
      return serverError(res, error)
  }
}

export const resendOtp = async (req, res) => {
  try {
      const {email} = req.body;
      let otp = OTP();
      let result = await resendOtpModel(email,otp);
      if (result.type == 'otp_sent') {
        let mailBody = fs.readFileSync(__dirname + process.env.RESEND_OTP_EMAIL_TEMPLATE).toString();
        mailBody = mailBody.replace(/{{name}}/g, result.name);
        mailBody = mailBody.replace(/{{otp}}/g, otp);
        OtpEmailTemplate(email, mailBody, Messages.OTP_SENT_EMAIL_SUBJECT);
        return successRequest(res,Messages.OTP_SENT,{})
      } else if (result.type == 'limit_exceed'){
        return badRequest(res, Messages.OTP_ATTEMPTS);
      }else{
        return emailNotExist(res)
    }
  } catch (error) {
      console.log("Resend OTP Error ----------", error);
      return serverError(res, error)
  }
}

export const verifyPassOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let isVerified = await verifyPassOtpModel(email, otp);
    if (isVerified.type == "otp_verify") {
      return successRequest(res, Messages.OTP_MATCHED, { verificationId: isVerified.user_id, email:isVerified.email});
    } else {
      return badRequest(res, Messages.OTP_NOT_MATCHED);
    }
  } catch (error) {
      console.log("Verify Otp error -------------", error);
      return serverError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
      const {verificationId, email, newpassword } = req.body;
      let result = await resetPasswordModel(verificationId, email, newpassword);
      if (result == 'updated') {
          return successRequest(res, Messages.UPDATE_PASSWORD_SUCCESS,{})
      } else {
        return badRequest(res, Messages.OTP_NOT_MATCHED)
      }
  } catch (error) {
      console.log("Reset Password Error--------------" + error);
      return serverError(res, error);
  }
};

export const viewProfile = async (req, res) => {
  try {
    const { id } = req.auth;
    let userData = await viewProfileModel(id);
    if (userData) {
        return res.status(HttpStatus.success).json({
          customcode: HttpStatus.success,
          message: Messages.SUCCESS,
          status: true,
          data: userData.data
        });
    } else {
      return badRequest(res, Messages.SERVER_ERROR);
    }
  } catch (error) {
    console.log("View Profile Error-----------", error);
    return serverError(res, error);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    const { id } = req.auth;
    const { name,phone } = req.body;
    let inputJson = {
      id:id,
      name : name, 
      phone : phone
    }
    let userData = await editProfileModel(inputJson);
    if (userData) {
      return successRequest(res, Messages.PROFILE_UPDATE_SUCCESS,{})
    } else {
      return badRequest(res, Messages.SERVER_ERROR);
    }
  } catch (error) {
    console.log("Edit Profile Error-----------", error);
    return serverError(res, error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
      const { oldPassword, newPassword } = req.body;
      const { id } = req.auth;
      let result = await changePasswordModel(id, oldPassword, newPassword);
      if (result === 'updated') {
          return successRequest(res, Messages.UPDATE_PASSWORD_SUCCESS,{})
      } else if(result === 'wrong_pass'){
        return badRequest(res, Messages.UPDATE_PASSWORD_ERROR)
      }else {
        return badRequest(res, Messages.SERVER_ERROR)
      }
  } catch (error) {
      console.log("Change Password Error--------------" + error);
      return serverError(res, error);
  }
};

export const contactUsForm = async (req, res, next) => {
  try {
    const { email, description } = req.body;
    const { devicetype } = req.headers;
    const temp = {
      email : email, 
      description : description,
      device_type:devicetype
    };
    let isAdded = await addContactUsFormModel(temp);
    if (isAdded) {
      let mailBody = fs.readFileSync(__dirname + process.env.CONTACT_US_EMAIL_TEMPLATE).toString();
      mailBody = mailBody.replace(/{{description}}/g, description);
      OtpEmailTemplate(email, mailBody, Messages.CONTACT_US_EMAIL_SUBJECT);
      return successRequest(res, Messages.CONTACT_US_SUBMISSION_SUCCSESS)
    } else {
      return badRequest(res, Messages.SERVER_ERROR);
    }
  } catch (error) {
    console.log("contactUsForm Error-------------", error);
    return serverError(res, error);
  }
};

// List of pricing tiers
export const pricingTiers = async (req, res, next) => {
  try {
      let data = await listPricingTierModel();
      if(data && data.length > 0){
          return successRequest(res, Messages.SUCCESS,data);
      }else{
           return noRecordFound(res);
      }
  } catch (error) {
      console.log("pricing Tiers List Error---------" + error);
      return serverError(res, error);
  }
}

export const guestLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const { devicetype, uuid } = req.headers;
    const temp = {
      email: email,
      role:'guest',
      provider:'email',
      devicetype: devicetype,
      uuid: uuid || null
    }
    let userLogin = await guestLoginModel(temp);
    if (userLogin && userLogin.isSuccess) {
      return res.status(HttpStatus.success).json({
        customcode: HttpStatus.success,
        message: Messages.SUCCESS,
        status: true,
        data: userLogin.data,
        token: userLogin.token,
      });
  } else {
    return alreadyRegisteredUser(res);
  }
  } catch (error) {
    console.log("Login Error-----------", error);
    return serverError(res, error);
  }
};

export const imageUpload = async (req, res, next) => {
  try {
    const { inmate_id, image_type, image } = req.body;
    const { id, role } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
      return unauthorizedAccess(res, Messages.NOT_USER)
     }
    let imageURL = image;
    let isInmateExist = await inmateById(inmate_id,id);
    if(isInmateExist){
      if (image_type === 'local' && req.files && req.files.image) {
        let uploadedFile = req.files.image;
        if (uploadedFile.mimetype === "image/png" || uploadedFile.mimetype === "image/jpeg") {
          let fileExtension = uploadedFile.mimetype.split("/")[1];
          let imageFilename = `${process.env.BUCKET_FOLDER_NAME}/inmate-images/${Date.now()}.${fileExtension}`; // s3 path
          let s3ImageURL = await s3Util.uploadS3(req.files.image, imageFilename);
          imageURL = s3ImageURL || "";
        } else {
          return validationError(res, Messages.IMAGE_TYPE);
        }
      } else if(image_type !== 'local' && image){
        imageURL = image
      }else {
        return validationError(res, Messages.IMAGE);
      }
      let inputJson = {
        user_id:id,
        inmate_id:inmate_id,
        image_type:image_type,
        image:imageURL
      }
      let isimageUpload = await imageUploadModel(inputJson);
      if(isimageUpload && isimageUpload.id){
        let imageAccessURL = imageURL;
        if (image_type === 'local'){
          imageAccessURL = await s3Util.gets3URLDirect(imageURL);
        }
        let outputData = {
        id:isimageUpload.id,
        inmate_id:inmate_id,
        image_type:image_type,
        image:imageAccessURL
        }
        return successRequest(res, Messages.IMAGE_SUCCESS,outputData)
      }else{
        return badRequest(res,Messages.SERVER_ERROR);
      }
    }else{
      return badRequest(res,Messages.NO_INMATE_EXIST);
    }
  } catch (error) {
    console.log("Image Upload Error---------" + error);
    return serverError(res, error);
  }
};

export const deleteUploadedImage = async (req, res, next) => {
  try {
    const { id, role } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
      return unauthorizedAccess(res, Messages.NOT_USER)
     }
    const { imageId} = req.params;
    let imageData = await imageById(imageId);
    if (imageData) {
      if(imageData.user_id === id){
        let isDeleted = await deleteUploadedImageModel(imageData);
        if(isDeleted){
          return successRequest(res, Messages.IMAGE_DELETE_SUCCESS)
        }else{
          return badRequest(res, Messages.NOT_OWNER_USER);
        }
      }else{
        return badRequest(res, Messages.NOT_OWNER_USER);
      }
    } else {
      return badRequest(res, Messages.SERVER_ERROR);
    }
  } catch (error) {
    console.log("Delete Uploaded Image-----------", error);
    return serverError(res, error);
  }
};

export const imageUploadedList = async (req, res, next) => {
  try {
    const { inmateId } = req.params;
    const { id, role } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
      return unauthorizedAccess(res, Messages.NOT_USER)
     }
    let data = await imagesByinmateId(inmateId, id);
    if(data && data.length>0){
        return successRequest(res, Messages.SUCCESS,data)
      }else{
        return noRecordFound(res);
    }
  } catch (error) {
    console.log("Image Uploaded List Error---------" + error);
    return serverError(res, error);
  }
};

export const checkoutOrder = async (req, res, next) => {
  try {
          const { inmate_id, customer_id, pricing_tier_id, images } = req.body;
          const { devicetype } = req.headers;
          const { id, role } = req.auth;
          if (role !== userRoles['User'] && role !== userRoles['Guest']) {
            return unauthorizedAccess(res, Messages.NOT_USER)
          }
          let isInmateExist = await inmateById(inmate_id,id);
          if(!isInmateExist){
            return badRequest(res,Messages.NO_INMATE_EXIST);
          }
          let tierData= await pricingTierById(pricing_tier_id);
          if (!tierData) {
             return badRequest(res, Messages.NO_PRICE_TIER_EXIST);
          }
          let imageArray= await imagesByIds(images,id,inmate_id);
          if (imageArray && imageArray.length===0) {
             return badRequest(res, Messages.NO_IMAGE_EXIST);
          }
          if(!(imageArray.length >= tierData.min_images &&  imageArray.length <= tierData.max_images)){
            return badRequest(res, imageArray.length < tierData.min_images ? Messages.MINIMAGE_AND_PLAN : Messages.MAXIMAGE_AND_PLAN);
          }
          let inputJson = {
            user_id:id,
            inmate_id : inmate_id, 
            customer_id : customer_id, 
            pricing_tier_id:pricing_tier_id, 
            images:images,
            devicetype:devicetype
          }
          let data = await checkoutOrderModel(inputJson,tierData,imageArray )
          return successRequest(res, Messages.SUCCESS,{id:data.id, url:data.url})
      }catch (error) {
      console.log("Checkout Order Error---------" + error);
      return serverError(res, error);
  }
}

export const getAllOrders = async (req, res, next) => {
  try {
    const { id, role } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
      return unauthorizedAccess(res, Messages.NOT_USER)
     }
    let data = await getAllOrdersModel(id);
    if(data && data.length>0){
        return successRequest(res, Messages.SUCCESS,data)
      }else{
        return noRecordFound(res);
    }
  } catch (error) {
    console.log("Get All Orders Error---------" + error);
    return serverError(res, error);
  }
};

export const checkPaymentStatus = async (req, res, next) => {
  try {
    const {checkOutId} = req.body
    const { id, role } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
      return unauthorizedAccess(res, Messages.NOT_USER)
     }
    let data = await checkPaymentStatusModel(checkOutId);
    if(data){
        return successRequest(res, Messages.SUCCESS,data)
      }else{
        return noRecordFound(res);
    }
  } catch (error) {
    console.log("Check Payment Status Error---------" + error);
    return serverError(res, error);
  }
};

// Get Order Details By Id
export const getOrderDetailsById = async (req, res, next) => {
  try {
      const { orderId } = req.params;
      const { role, id } = req.auth;
      if (role !== userRoles['User'] && role !== userRoles['Guest']) {
        return unauthorizedAccess(res, Messages.NOT_USER)
       }
      let orderDetail= await getOrderDetailsByIdModel(orderId, id);
      if (orderDetail) {
          return successRequest(res, Messages.SUCCESS, orderDetail);
      }else{
          return noRecordFound(res);
      }
  } catch (error) {
      console.log("Get Order Details By Id---------" + error);
      return serverError(res, error);
  }
}



