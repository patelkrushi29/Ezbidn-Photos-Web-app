
import { userRoles,unauthorizedAccess, serverError, getMethod , headers, agent, successRequest, noRecordFound, alreadyExist, badRequest} from "../utils";
import Messages from "../utils/en.json";
import {saveInmateModel, inmateByNumberAndUser, inmateListModel, inmateById, removeInmateModel} from "../models/inmateModel";
import {orderImagesByinmateId} from "../models/userModel";


export const findFederalInmate = async (req, res, next) => {
  try {
    const { inmateId } = req.params;
    const data = await globalThis.fetch(`${process.env.FIND_INMATE_API_BY_ID}${inmateId}`, {
      method: getMethod,
      headers: headers,
      agent: agent,
    }).then((res) => res.json());
    if (data && data.InmateLocator.length>0) {
      const dataLocation = await globalThis.fetch(`${process.env.INMATE_LOCATION_API_BY_FACL_CODE}${data.InmateLocator[0].faclCode}`, {
        method: getMethod,
        headers: headers,
        agent: agent,
      }).then((res) => res.json());
      if (dataLocation && dataLocation.Locations.length>0) {
        let inmateDetail = {
          inamteProfile:data.InmateLocator[0],
          inmateLocation:dataLocation.Locations[0]
        } 
        return successRequest(res, Messages.SUCCESS, inmateDetail);
      } else {
        return noRecordFound(res);
      }
    } else {
      return noRecordFound(res);
    }
  } catch (error) {
    console.log("Error Occured: " + error);
    return serverError(res, error);
  }
};

// This location api is not using for now
export const inmateLocation = async (req, res, next) => {
  try {
    const { faclCode } = req.params;
    const { role } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
        return unauthorizedAccess(res, Messages.NOT_USER)
    }
    const data = await globalThis.fetch(`${process.env.INMATE_LOCATION_API_BY_FACL_CODE}${faclCode}`, {
      method: getMethod,
      headers: headers,
      agent: agent,
    }).then((res) => res.json());
    if (data && data.Locations.length>0) {
      return successRequest(res, Messages.SUCCESS, data.Locations);
    } else {
      return noRecordFound(res);
    }
  } catch (error) {
    console.log("Error Occured: " + error);
    return serverError(res, error);
  }
};

export const saveInmate = async (req, res, next) => {
  try {
    const { nameFirst, nameMiddle, nameLast,sex,race,age, inmateNum, faclCode, faclName, faclType, faclURL, releaseCode, projRelDate, actRelDate } = req.body;
    const { role, id } = req.auth;
    let isInmateExist= await inmateByNumberAndUser(inmateNum,id);
    if (isInmateExist) {
      return alreadyExist(res, Messages.INMATE_EXIST, {id:isInmateExist.id});
     }
    let inputJson = {
      user_id:id,
      nameFirst : nameFirst, 
      nameMiddle: nameMiddle || null, 
      nameLast:nameLast || null, 
      sex:sex || null, 
      race:race || null, 
      age:age || null, 
      inmateNum:inmateNum, 
      faclCode:faclCode, 
      faclName:faclName, 
      faclType:faclType, 
      faclURL:faclURL || null, 
      releaseCode:releaseCode || null, 
      projRelDate:projRelDate || null, 
      actRelDate:actRelDate || null
    }
    
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
        return unauthorizedAccess(res, Messages.NOT_USER)
    }
      let newInmate = await saveInmateModel(inputJson);
    if (newInmate && newInmate.id) {
      return successRequest(res, Messages.INMATE_SAVED,newInmate);
    } else {
      return badRequest(res, Messages.SERVER_ERROR);
    }
  } catch (error) {
    console.log("Error Occured: " + error);
    return serverError(res, error);
  }
};

export const inmateList = async (req, res, next) => {
  try {
    const { role, id } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
        return unauthorizedAccess(res, Messages.NOT_USER)
    }
      let inmateList = await inmateListModel(id);
    if (inmateList && inmateList.length>0) {
      return successRequest(res, Messages.SUCCESS, inmateList);
    } else {
      return noRecordFound(res);
    }
  } catch (error) {
    console.log("Error Occured: " + error);
    return serverError(res, error);
  }
};

export const getInmateDetailById = async (req, res, next) => {
  try {
    const { inmateId } = req.params;
    const { role,id } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
        return unauthorizedAccess(res, Messages.NOT_USER)
    }
    let isInmateExist= await inmateById(inmateId,id);
    if (!isInmateExist) {
      return noRecordFound(res);
    }else{
      const dataLocation = await globalThis.fetch(`${process.env.INMATE_LOCATION_API_BY_FACL_CODE}${isInmateExist.faclCode}`, {
        method: getMethod,
        headers: headers,
        agent: agent,
      }).then((res) => res.json());
      if (dataLocation && dataLocation.Locations.length>0) {
        let inmateDetail = {
          inamteProfile:isInmateExist,
          inmateLocation:dataLocation.Locations[0]
        } 
        return successRequest(res, Messages.SUCCESS, inmateDetail);
      } else {
        return noRecordFound(res);
      }
    }
  } catch (error) {
    console.log("Error Occured: " + error);
    return serverError(res, error);
  }
};

export const removeInmate = async (req, res, next) => {
  try {
    const { inmateId } = req.params;
    const { role, id } = req.auth;
    if (role !== userRoles['User'] && role !== userRoles['Guest']) {
        return unauthorizedAccess(res, Messages.NOT_USER)
    }
    let data = await orderImagesByinmateId(inmateId, id);
    if(data && data.length>0){
      return badRequest(res, Messages.INMATE_DELETE_ERROR);
    }
    let isInmateDeleted= await removeInmateModel(inmateId, id);
    if (isInmateDeleted) {
      return successRequest(res, Messages.INMATE_DELETE_SUCCESS, {});
    }else{
      return badRequest(res, Messages.SERVER_ERROR);
    }
  } catch (error) {
    console.log("Error Occured: " + error);
    return serverError(res, error);
  }
}