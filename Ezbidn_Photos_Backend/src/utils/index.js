import HttpStatus from "./HttpStatus";
import Messages from "./en.json";
import jwt from "jsonwebtoken"; 


export function validationError(res, err) {
  let message = err || Messages.VALIDATION_ERROR;
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.badRequest,
    message: message,
    status: false,
  });
}

export const alreadyExist = (res,msg, data) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.existCode,
    message: msg,
    status: false,
    data: data
  });
};

export const serverError = (res, err) => {
  let message = Messages.SERVER_ERROR;
  if (err?.code == "ER_DATA_TOO_LONG") {
    let msgArr = err.sqlMessage.split(/'/);
    let fieldName = msgArr[1] ? ` for ${msgArr[1].split("_").join(" ")}` : "";
    message = Messages.DATA_LONG_ERROR + fieldName;
  } else if (err?.code == "ER_BAD_NULL_ERROR") {
    message = err.sqlMessage;
  } else if (err?.code == "ER_NO_REFERENCED_ROW_2") {
    message = Messages.REFERENCE_ERROR;
  } else if (err?.code == "ENOTFOUND") {
    message = Messages.SERVER_ERROR;
  } else if (err?.message) {
    message = err.message;
  }
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.internalServerError,
    message: message,
    status: false,
  });
};

export const notVerified = (res, msg) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.contentDifferent,
    message: msg,
    status: false,
  });
};

export const successRequest = (res, msg, data) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.success,
    message: msg,
    status: true,
    data: data,
  });
};

export const badRequest = (res, msg) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.badRequest,
    message: msg,
    status: false,
  });
};


export const emailNotExist = (res) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.emailNotExistCode,
    message: Messages.EMAIL_NOT_EXIST,
    status: false,
  });
};

export const unauthorizedAccess = (res, msg) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.unauthorized,
    message: msg,
    status: false,
  });
};

export const noRecordFound = (res) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.noDataFoundCode,
    message: Messages.NO_RECORD_FOUND,
    status: "fail",
  });
};

export const alreadyRegisteredUser = (res) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.alreadyRegisteredUserCode,
    message: Messages.REGISTERED_USER_EXIST,
    status: false
  });
};

export const alreadyOtherSocialUser = (res) => {
  return res.status(HttpStatus.success).json({
    customcode: HttpStatus.alreadyOtherSocialUserCode,
    message: Messages.SOCIAL_USER_EXIST,
    status: false
  });
};

// Other Functions

export const jwtToken = (row) => {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24*30),
        data: { ...row },
      },
      process.env.SECRET
    );
};

export const OTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
  
export const deviceTypes = ["web", "ios", "android"];
export const providerTypes = ["google","facebook"];
export const userRoles ={ Admin: "admin", User: "user", Guest:"guest" };
export const imageTypes = ["local","google", "facebook", "instagram"];
export const repliyFlag = [0,1,"0","1"];
export const orderStatus = ['processing', 'shipped', 'completed'];



export const getMethod = "GET";
export const postMethod = "POST";
export const putMethod = "PUT";
export const deleteMethod = "DELETE";
export const agent = "";
export const headers = {
  "User-Agent": "application/json",
  "Content-Type": "application/json"
};

