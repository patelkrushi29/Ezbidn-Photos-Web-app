import jwt from 'jsonwebtoken';
import { unauthorizedAccess, serverError} from "../utils";
import Messages from "../utils/en.json";
import { userById } from "../models/userModel";
// This middleware function is used ot implement Basic Auth - 
export const isBasicAuth = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (!token) {
            unauthorizedAccess(res, Messages.ACCESS_DENIED);
        } else {
            let auth = new Buffer.from(token.split(' ')[1],
                'base64').toString().split(':');
            let user = auth[0];
            let pass = auth[1];
            if (user == process.env.PUBLIC_ACCESS_USERNAME && pass == process.env.PUBLIC_ACCESS_PASS ) {
                next();
            } else {
                return unauthorizedAccess(res, Messages.UNAUTHENTICATED)
            }
        }
    } catch (err) {
        return utils.unauthorizedAccess(res, err.code === 'ERR_INVALID_ARG_TYPE' ? Messages.INVALID_TOKEN : Messages.UNAUTHORIZED);
    }
}

// This middleware function is for all logedin users
export const isAuth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            unauthorizedAccess(res, Messages.ACCESS_DENIED);
        } else {
            let decoded = jwt.verify(token, process.env.SECRET)
            if(decoded){
                let userid = decoded.data.id
                let checkdata = await userById(userid);
                if (!checkdata) {
                    return unauthorizedAccess(res, Messages.UNAUTHORIZED);
                }else{
                    req.auth = decoded.data
                    next();
                }
            }else{
                return unauthorizedAccess(res, Messages.UNAUTHORIZED);
            }
        }
    } catch (err) {
        return unauthorizedAccess(res, err.name === 'TokenExpiredError' ? Messages.TOKEN_EXPIRED : Messages.UNAUTHORIZED);
    }
}


const containsDangerousContent = (input) => {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i; // Detects any HTML tags
    const scriptRegex = /<script.*?>.*?<\/script>/i; // Detects <script> tags
    return htmlRegex.test(input) || scriptRegex.test(input);
  };
  
  const validateInput = (input) => {
    return !(typeof input === 'string' && containsDangerousContent(input));
  };
  
// This middleware function is to detect HTML tags or JavaScript code
export const blockHtmlMiddleware = (req, res, next) => {
  let customMsg =Messages.INVALID_CONTENT;
  try {
      // Check query parameters
      for (const key in req.query) {
          if (!validateInput(req.query[key])) {
            return badRequest(res, customMsg);
          }
      }
      // Check body parameters
      for (const key in req.body) {
          if (!validateInput(req.body[key])) {
            return badRequest(res, customMsg);
          }
      }
      // Check headers
      for (const key in req.headers) {
          if (!validateInput(req.headers[key])) {
            return badRequest(res, customMsg);
          }
      }
      next(); // Proceed if no dangerous content is found
  } catch (err) {
    console.log("aaaaaaaaaaaaaaa", err)
    return serverError(res, Messages.SERVER_ERROR);
  }
};



