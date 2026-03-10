/* eslint-disable no-undef */
import { Router } from 'express';
import userController from '../controllers/userController';
import adminController from '../controllers/adminController';
import inmateController from '../controllers/inmateController';
import { isBasicAuth, blockHtmlMiddleware } from "../middlewares/auth-middleware";
import { headerValidation} from "../middlewares/validation-middleware";

const routes = Router();
routes.use('/user', headerValidation, blockHtmlMiddleware, isBasicAuth, userController)
routes.use('/admin', headerValidation, blockHtmlMiddleware, isBasicAuth, adminController)
routes.use('/inmate', headerValidation, blockHtmlMiddleware, isBasicAuth, inmateController)
export default routes