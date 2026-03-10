import { mysql } from "../db.js";
import s3Util from "../utils/s3utils.js";

// Check if inmate is exist or not
export const inmateByNumber = async (inmateNum) => {
  let sqlQuery = "select * from inmates where inmateNum=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inmateNum]);
  return row;
};

// Check if inmate id is exist or not
export const inmateById = async (id, user_id) => {
  let sqlQuery =
    "SELECT * from inmates where id=? AND user_id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [id, user_id]);
  return row;
};

export const inmateByNumberAndUser = async (inmateNum, user_id) => {
  let sqlQuery = "select * from inmates where inmateNum=? AND user_id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inmateNum, user_id]);
  return row;
};

export const saveInmateModel = async (inputJson) => {
  let sqlInsert =
    "INSERT INTO inmates( user_id, nameFirst, nameMiddle, nameLast,sex,race,age, inmateNum, faclCode, faclName, faclType, faclURL, releaseCode, projRelDate, actRelDate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let row = await mysql.preparedQuery(sqlInsert, [
    inputJson.user_id,
    inputJson.nameFirst,
    inputJson.nameMiddle,
    inputJson.nameLast,
    inputJson.sex,
    inputJson.race,
    inputJson.age,
    inputJson.inmateNum,
    inputJson.faclCode,
    inputJson.faclName,
    inputJson.faclType,
    inputJson.faclURL,
    inputJson.releaseCode,
    inputJson.projRelDate,
    inputJson.actRelDate,
  ]);
  return {id:row.insertId};
};

export const inmateListModel = async (user_id) => {
  let sqlQuery =
    "select * from inmates where user_id=? ORDER BY created_at DESC";
  let rows = await mysql.preparedQuery(sqlQuery, [user_id]);
  return rows;
};

export const removeInmateModel = async (id, user_id) => {
    let sqlImageDelete = `select * from images where inmate_id=${id} AND user_id=${user_id} AND order_id IS NULL`
    let rows = await mysql.query(sqlImageDelete);
    for (let [index, val] of rows.entries()) {
       if (val.image_type === 'local' && val.image && val.image.length > 1) {
            await s3Util.deleteObjectS3([{Key:val.image}]);
        }
    }
    let sqlImageDeleteQuery = `DELETE FROM images where inmate_id=${id} AND user_id=${user_id} AND order_id IS NULL`
    await mysql.query(sqlImageDeleteQuery);
  let sqlDelete = `DELETE FROM inmates WHERE id=${id} AND user_id=${user_id}`;
  let row = await mysql.query(sqlDelete);
  return row && row.affectedRows != 0 ? true : false;
};
