import { mysql } from "../db.js";
import s3Util from "../utils/s3utils.js";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const listUsersModel = async (pageNo, limit, searchText) => {
  try {
    let limitCount = limit || 10;
    let pageCount = pageNo || 1;
    let conditionalWhere = "";
    if (searchText != "null") {
      conditionalWhere = ` AND (email LIKE '%${searchText}%' OR name LIKE '%${searchText}%')`;
    }
    let sqlCount = `SELECT count(*) as total FROM users WHERE role IN ('user', 'guest') ${conditionalWhere}`;
    let [totalCount] = await mysql.query(sqlCount);
    let sqlData = `SELECT id,name,email,profile_picture,phone,provider,provider_id,customer_id,role,is_verified,created_at,updated_at FROM users WHERE role IN ('user', 'guest')${conditionalWhere}
            order by updated_at desc 
            LIMIT ${(pageCount - 1) * limitCount},${limitCount}`;
    let data = await mysql.query(sqlData);
    return {
      data: data,
      page: pageCount,
      limit: limitCount,
      totalCount: totalCount.total,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Check if pricing tier is already exist
export const pricingTier = async (min_images, max_images) => {
  let sqlQuery = "SELECT * from pricing_tiers where min_images=? OR max_images=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [min_images, max_images]);
  return row;
};

// Check if pricing tier is already exist without id
export const pricingTierWithoutId = async (id, min_images, max_images) => {
  let sqlQuery = "SELECT * FROM pricing_tiers WHERE id != ? AND (min_images = ? OR max_images = ?)";
  let [row] = await mysql.preparedQuery(sqlQuery, [id, min_images, max_images]);
  return row;
};


// pricing tier by id
export const pricingTierById = async (id) => {
  let sqlQuery = "SELECT * FROM pricing_tiers WHERE id = ?";
  let [row] = await mysql.preparedQuery(sqlQuery, [id]);
  return row;
};

export const addNewPricingTierModel = async (inputJson) => {
  let sqlInsert = "INSERT INTO pricing_tiers( min_images, max_images, label, description,price_cents) VALUES(?,?,?,?,?)";
  let row = await mysql.preparedQuery(sqlInsert, [
    inputJson.min_images,
    inputJson.max_images,
    inputJson.label,
    inputJson.description,
    inputJson.price_cents
  ]);
  return {id:row.insertId};
};


export const listPricingTierModel = async (user_id) => {
  let sqlQuery = "select * from pricing_tiers ORDER BY min_images ASC";
  let rows = await mysql.query(sqlQuery);
  return rows;
};


export const updatePricingTierModel = async (inputJson) => {
  let sqlQuery = "SELECT * from pricing_tiers where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inputJson.id]);
  if (row) {
    let sqlUpdateQuery = "UPDATE pricing_tiers set min_images=?, max_images=?, label=?, description=?, price_cents=? where id=?";
    await mysql.preparedQuery(sqlUpdateQuery, [
      inputJson.min_images,
      inputJson.max_images,
      inputJson.label,
      inputJson.description,
      inputJson.price_cents,
      inputJson.id,
    ]);
    return true;
  } else {
    return false; // token wrong
  }
};


export const listContactUsersModel = async (pageNo, limit, searchText) => {
  try {
    let limitCount = limit || 10;
    let pageCount = pageNo || 1;
    let conditionalWhere = "";
    if (searchText != "null") {
      conditionalWhere = ` WHERE email LIKE '%${searchText}%' OR description LIKE '%${searchText}%'`;
    }
    let sqlCount = `SELECT count(*) as total FROM contact_us ${conditionalWhere}`;
    let [totalCount] = await mysql.query(sqlCount);
    let sqlData = `SELECT * FROM contact_us ${conditionalWhere}
            order by updated_at desc 
            LIMIT ${(pageCount - 1) * limitCount},${limitCount}`;
    let data = await mysql.query(sqlData);
    return {
      data: data,
      page: pageCount,
      limit: limitCount,
      totalCount: totalCount.total,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const listOrdersModel = async (userId, pageNo, limit, searchText) => {
  try {
    let limitCount = limit || 10;
    let pageCount = pageNo || 1;
    let conditionalWhere = "";
    let conditionalDataWhere = "";
    if (userId != "null") {
      conditionalWhere = `WHERE user_id=${userId}`;
      conditionalDataWhere = `WHERE o.user_id=${userId}`;
    }
    if (searchText != "null") {
      conditionalWhere = conditionalWhere+` AND customer_id LIKE '%${searchText}%'`;
      conditionalDataWhere = conditionalDataWhere+` AND o.customer_id LIKE '%${searchText}%'`;
    }
    let sqlCount = `SELECT count(*) as total FROM orders ${conditionalWhere}`;
    let [totalCount] = await mysql.query(sqlCount);
    let sqlData = `SELECT o.id,
                    o.customer_id,o.payment_checkout_id,o.created_at,o.images,o.user_id,o.comment,o.shipment_status,
                    u.name AS user_name,u.email AS user_email,u.role AS user_role,u.provider AS user_provider,
                    o.inmate_id,i.nameFirst AS inmate_nameFirst,i.nameMiddle AS inmate_nameMiddle,i.nameLast AS inmate_nameLast,i.inmateNum AS inmate_Num,i.faclName AS inmate_faclName,
                    i.faclCode AS inmate_faclCode,o.pricing_tier_id,pt.label AS pricing_label,pt.min_images AS pricing_min_images,
                    pt.max_images AS pricing_max_images,pt.description AS pricing_description FROM orders o
                    LEFT JOIN users u ON o.user_id = u.id
                    LEFT JOIN inmates i ON o.inmate_id = i.id
                    LEFT JOIN pricing_tiers pt ON o.pricing_tier_id = pt.id
                    ${conditionalDataWhere}
                    ORDER BY o.created_at DESC
                    LIMIT ${(pageCount - 1) * limitCount}, ${limitCount};
                    `;
    let data = await mysql.query(sqlData);
    return {
      data: data,
      page: pageCount,
      limit: limitCount,
      totalCount: totalCount.total,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// Get Order Details By Id
export const getOrderDetailsByIdModel = async (id) => {
  try {
    let sqlQuery = `SELECT 
     o.id,
     o.customer_id,
     o.payment_checkout_id,
     o.created_at,
     o.images,
     o.user_id,
     o.comment,
     o.shipment_status,
     u.name AS user_name,
     u.email AS user_email,
     u.role AS user_role,
     u.provider AS user_provider,
     o.inmate_id,
     i.inmateNum AS inmate_inmateNum,
     i.nameFirst AS inmate_nameFirst,
     i.nameMiddle AS inmate_nameMiddle,
     i.nameLast AS inmate_nameLast,
     i.faclName AS inmate_faclName,
     i.faclCode AS inmate_faclCode,
     o.pricing_tier_id,
     pt.label AS pricing_label,
     pt.min_images AS pricing_min_images,
     pt.max_images AS pricing_max_images,
     pt.description AS pricing_description
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN inmates i ON o.inmate_id = i.id
      LEFT JOIN pricing_tiers pt ON o.pricing_tier_id = pt.id
      WHERE o.id = ${id}`
     let [row] = await mysql.query(sqlQuery);
     if(row){
      const placeholders = row.images.map(() => '?').join(', ');
      let sqlImageQuery = `select * from images where order_id=? AND id IN (${placeholders})`;
      const values = [id, ...row.images]; 
      let rows = await mysql.preparedQuery(sqlImageQuery, values);
        for (let [index, val] of rows.entries()) {
              if(val.image_type === 'local'){
                  let s3ImageURL = val.image ? await s3Util.gets3URLDirect(val.image) : '';
                  rows[index].image = s3ImageURL;
           }
        }
       row.images = rows;
       const session = await stripe.checkout.sessions.retrieve(row.payment_checkout_id);
       row.amount_total = session.amount_total;
       row.transaction_id = session.id;
       row.payment_status = session.payment_status;
       row.payment_email = session.email;
     }
    
     return row
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateContactUsFlagModel = async (inputJson) => {
  let sqlQuery = "SELECT * from contact_us where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inputJson.id]);
  if (row) {
    let sqlUpdateQuery = "UPDATE contact_us set is_replied=? where id=?";
    await mysql.preparedQuery(sqlUpdateQuery, [
      inputJson.is_replied,
      inputJson.id
    ]);
    return true;
  } else {
    return false; // id wrong
  }
};


export const updateOrderModel = async (inputJson) => {
  let sqlQuery = "SELECT * from orders where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inputJson.id]);
  if (row) {
    let sqlUpdateQuery = "UPDATE orders set shipment_status=?, comment=? where id=?";
    await mysql.preparedQuery(sqlUpdateQuery, [
      inputJson.shipment_status,
      inputJson.comment,
      inputJson.id
    ]);
    return true;
  } else {
    return false; // id wrong
  }
};