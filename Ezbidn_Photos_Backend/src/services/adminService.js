import {listUsersModel, addNewPricingTierModel, pricingTier, listPricingTierModel, updatePricingTierModel, pricingTierWithoutId, pricingTierById, listContactUsersModel,listOrdersModel, getOrderDetailsByIdModel, updateContactUsFlagModel, updateOrderModel} from "../models/adminModel";
import { userRoles,unauthorizedAccess, serverError, successRequest, badRequest, alreadyExist, noRecordFound } from "../utils";
import HttpStatus from "../utils/HttpStatus";
import Messages from "../utils/en.json";

// User List with pagination
export const listUsers = async (req, res, next) => {
    try {
        const { pageNo, limit, searchText } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let userdata = await listUsersModel(pageNo, limit, searchText);
        return res.status(HttpStatus.success).json({
            'customcode': HttpStatus.success,
            'message': Messages.SUCCESS,
            'status': "success",
            'page': pageNo,
            'limit': limit,
            'total': userdata.totalCount,
            'users': userdata.data
        });

    } catch (error) {
        console.log("User List Error---------" + error);
        return serverError(res, error);
    }
}

// Add New tier for the pricing
export const addNewPricingTier = async (req, res, next) => {
    try {
        const { min_images,max_images,label,price_cents,description } = req.body;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let isTierExist= await pricingTier(min_images,max_images);
        if (isTierExist) {
          return alreadyExist(res, Messages.TIER_EXIST);
        }
        let inputJson = {
          min_images : min_images, 
          max_images: max_images, 
          label:label, 
          price_cents:price_cents, 
          description:description || null
        }
        let newPriceTier = await addNewPricingTierModel(inputJson);
        if (newPriceTier && newPriceTier.id) {
          return successRequest(res, Messages.TIER_SAVED,newPriceTier);
        } else {
          return badRequest(res, Messages.SERVER_ERROR);
        }
    } catch (error) {
        console.log("Pricing Tier Error---------" + error);
        return serverError(res, error);
    }
}

// List of pricing tiers
export const listPricingTier = async (req, res, next) => {
    try {
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let data = await listPricingTierModel();
        if(data && data.length > 0){
            return successRequest(res, Messages.SUCCESS,data);
        }else{
             return noRecordFound(res);
        }
    } catch (error) {
        console.log("User List Error---------" + error);
        return serverError(res, error);
    }
}

// Update tier for the pricing
export const updatePricingTier = async (req, res, next) => {
    try {
        const { min_images,max_images,label,price_cents,description } = req.body;
        const { tierId } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let isTierExist= await pricingTierWithoutId(tierId,min_images,max_images);
        if (isTierExist) {
          return alreadyExist(res, Messages.TIER_EXIST);
        }
        let inputJson = {
          id:tierId,
          min_images : min_images, 
          max_images: max_images, 
          label:label, 
          price_cents:price_cents, 
          description:description || null
        }
        let updatePriceTier = await updatePricingTierModel(inputJson);
        if (updatePriceTier) {
          return successRequest(res, Messages.TIER_UPDATE);
        } else {
          return badRequest(res, Messages.SERVER_ERROR);
        }
    } catch (error) {
        console.log("Update Pricing Tier Error---------" + error);
        return serverError(res, error);
    }
}

// Get pricing tier by id
export const getPricingTierById = async (req, res, next) => {
    try {
        const { tierId } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let tierData= await pricingTierById(tierId);
        if (tierData) {
            return successRequest(res, Messages.SUCCESS,tierData );
        }else{
            return noRecordFound(res);
        }
    } catch (error) {
        console.log("Update Pricing Tier Error---------" + error);
        return serverError(res, error);
    }
}

// User List with pagination
export const listContactUsers = async (req, res, next) => {
    try {
        const { pageNo, limit, searchText } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let userdata = await listContactUsersModel(pageNo, limit, searchText);
        return res.status(HttpStatus.success).json({
            'customcode': HttpStatus.success,
            'message': Messages.SUCCESS,
            'status': "success",
            'page': pageNo,
            'limit': limit,
            'total': userdata.totalCount,
            'users': userdata.data
        });

    } catch (error) {
        console.log("Contact Form User List Error---------" + error);
        return serverError(res, error);
    }
}

// Update Contact Us Flag replied yes/no
export const updateContactUsFlag = async (req, res, next) => {
    try {
        const { is_replied } = req.body;
        const { id } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let inputJson = {
            is_replied:is_replied,
            id : id
        }
        let updateContactUsFlag = await updateContactUsFlagModel(inputJson);
        if (updateContactUsFlag) {
          return successRequest(res, Messages.REPLY_STATUS_UPDATE);
        } else {
          return badRequest(res, Messages.SERVER_ERROR);
        }
    } catch (error) {
        console.log("Update Contact Us Flag Error---------" + error);
        return serverError(res, error);
    }
}

// Order List based on userid if receiving in params
export const listOrders = async (req, res, next) => {
    try {
        const { userId, pageNo, limit, searchText } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let userdata = await listOrdersModel(userId, pageNo, limit, searchText);
        return res.status(HttpStatus.success).json({
            'customcode': HttpStatus.success,
            'message': Messages.SUCCESS,
            'status': "success",
            'page': pageNo,
            'limit': limit,
            'total': userdata.totalCount,
            'data': userdata.data
        });

    } catch (error) {
        console.log("List Orders Error---------" + error);
        return serverError(res, error);
    }
}

// Get Order Details By Id
export const getOrderDetailsById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let orderDetail= await getOrderDetailsByIdModel(orderId);
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

// Update Contact Us Flag replied yes/no
export const updateOrder = async (req, res, next) => {
    try {
        const { shipment_status, comment } = req.body;
        const { id } = req.params;
        const { role } = req.auth;
        if (userRoles['Admin'] != role) {
            return unauthorizedAccess(res, Messages.NOT_ADMIN);
        }
        let inputJson = {
            shipment_status:shipment_status,
            comment:comment ? comment : null,
            id : id
        }
        let isUpdateOrder = await updateOrderModel(inputJson);
        if (isUpdateOrder) {
          return successRequest(res, Messages.ORDER_UPDATE);
        } else {
          return badRequest(res, Messages.SERVER_ERROR);
        }
    } catch (error) {
        console.log("Update Order Error---------" + error);
        return serverError(res, error);
    }
}