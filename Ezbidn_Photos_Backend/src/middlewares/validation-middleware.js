import validator from "../utils/validate";
import { validationError, deviceTypes, providerTypes, imageTypes, repliyFlag, orderStatus } from "../utils";

export const headerValidation = (req, res, next) => {
  const validationRule = {
      "devicetype":['required', { 'in': [...deviceTypes] }],
      "uuid": "required|string",
  }
  validator(req.headers, validationRule, { required: ':attribute value is missing in api headers' }, (err, status) => {
      if (!status) {
          let error = 
          err.errors?.devicetype?.[0] ||
          err.errors?.uuid?.[0]
          validationError(res, error);
      } else {
          next();
      }
  });
}

export const registerValidation = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    email: "required|email",
    password: "required|string",
    phone: "string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error =
        err.errors?.name?.[0] ||
        err.errors?.email?.[0] ||
        err.errors?.phone?.[0] ||
        err.errors?.password?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const loginValidation = (req, res, next) => {
  const validationRule = {
    email: "required|email",
    password: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error = err.errors.email
        ? err.errors.email[0]
        : err.errors.password[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const socialLoginValidation = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    email: "email|string",
    provider: ['required', {'in': [...providerTypes]}],
    provider_id: "required|string",
    phone: "string",
    profile_picture:"string"
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error =
        err.errors?.name?.[0] ||
        err.errors?.provider?.[0] ||
        err.errors?.provider_id?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};


export const verifyOtpValidation = (req, res, next) => {
  const validationRule = {
    email: "required|email",
    otp: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error = err.errors.email
        ? err.errors.email[0]
        : err.errors.otp[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const emailValidation = (req, res, next) => {
  const validationRule = {
      "email": "required|email"
  }
  validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
          let error = err.errors?.email?.[0] 
          validationError(res, error);
      } else {
          next();
      }
  });
}

export const resetPasswordValidation = (req, res, next) => {
  const validationRule = {
    verificationId: "required",
    email: "required|email",
    newpassword: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
        let error =
        err.errors?.verificationId?.[0] ||
        err.errors?.email?.[0] ||
        err.errors?.newpassword?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const editProfileValidation = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    phone: "string"
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error = err.errors?.name?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const changePasswordValidation = (req, res, next) => {
  const validationRule = {
    oldPassword: "required|string",
    newPassword: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error = err.errors.oldPassword
        ? err.errors.oldPassword[0]
        : err.errors.newPassword[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const contactUsFormValidation = (req, res, next) => {
  const validationRule = {
    email: "required|email",
    description: "required|string"
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error =
        err.errors?.email?.[0] ||
        err.errors?.description?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const listUsersValidation = (req, res, next) => {
  const validationRule = {
      "pageNo" : "required",
      "limit" : "required"
  }
  validator(req.params, validationRule, {}, (err, status) => { 
      if (!status) {
          let error =  
          err.errors.pageNo && err.errors.pageNo[0] ||
          err.errors.limit && err.errors.limit[0]
          validationError(res, error);
      } else {
          next();
      }
  });
}


export const federalInmateIdValidation = (req, res, next) => {
  const validationRule = {
      "inmateId" : "required|string"
  }
  validator(req.params, validationRule, {}, (err, status) => { 
      if (!status) {
          let error =  
          err.errors.inmateId && err.errors.inmateId[0] 
          validationError(res, error);
      } else {
          next();
      }
  });
}


export const inmateLocationValidation = (req, res, next) => {
  const validationRule = {
      "faclCode" : "required|string"
  }
  validator(req.params, validationRule, {}, (err, status) => { 
      if (!status) {
          let error =  
          err.errors.faclCode && err.errors.faclCode[0] 
          validationError(res, error);
      } else {
          next();
      }
  });
}


export const saveInmateValidation = (req, res, next) => {
  const validationRule = {
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
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error =
        err.errors?.nameFirst?.[0] ||
        err.errors?.nameMiddle?.[0] ||
        err.errors?.nameLast?.[0] ||
        err.errors?.sex?.[0] ||
        err.errors?.race?.[0] ||
        err.errors?.age?.[0] ||
        err.errors?.inmateNum?.[0] ||
        err.errors?.faclCode?.[0] ||
        err.errors?.faclName?.[0] ||
        err.errors?.faclType?.[0] ||
        err.errors?.faclURL?.[0] ||
        err.errors?.releaseCode?.[0] ||
        err.errors?.projRelDate?.[0] ||
        err.errors?.actRelDate?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};


export const inmateDetailIdValidation = (req, res, next) => {
  const validationRule = {
      "inmateId" : "required|string"
  }
  validator(req.params, validationRule, {}, (err, status) => { 
      if (!status) {
          let error =  
          err.errors.inmateId && err.errors.inmateId[0] 
          validationError(res, error);
      } else {
          next();
      }
  });
}

export const addNewPricingTierValidation = (req, res, next) => {
  const validationRule = {
    min_images: "required|integer",
    max_images: "required|integer",
    label: "required|string",
    price_cents: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error =
        err.errors?.min_images?.[0] ||
        err.errors?.max_images?.[0] ||
        err.errors?.label?.[0] ||
        err.errors?.price_cents?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};


export const imageUploadValidation = (req, res, next) => {
  const validationRule = {
      "inmate_id" : "required|string",
      "image_type" : ['required', { 'in': [...imageTypes] }]
  }
  validator(req.body, validationRule, {}, (err, status) => { 
      if (!status) {
          let error =  
          err.errors.inmate_id && err.errors.inmate_id[0] ||
          err.errors.image_type && err.errors.image_type[0] 
          validationError(res, error);
      } else {
          next();
      }
  });
}

export const checkoutOrderValidation = (req, res, next) => {
  const validationRule = {
      "inmate_id" : "required|string",
      "customer_id" : "required|string",
      "pricing_tier_id" : "required|string",
      "images" : "required|array"
  }
  validator(req.body, validationRule, {}, (err, status) => { 
      if (!status) {
          let error =  
          err.errors.inmate_id && err.errors.inmate_id[0] ||
          err.errors.customer_id && err.errors.customer_id[0] ||
          err.errors.pricing_tier_id && err.errors.pricing_tier_id[0] ||
          err.errors.images && err.errors.images[0]
          validationError(res, error);
      } else {
          next();
      }
  });
}


export const contactUsFlagValidation = (req, res, next) => {
  const validationRule = {
    is_replied: ['required', {'in': [...repliyFlag]}]
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error = err.errors?.is_replied?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};

export const updateOrderValidation = (req, res, next) => {
  const validationRule = {
    shipment_status: ['required', {'in': [...orderStatus]}]
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      let error = err.errors?.shipment_status?.[0];
      validationError(res, error);
    } else {
      next();
    }
  });
};