import { mysql } from "../db.js";
import bcrypt from "bcryptjs";
import { jwtToken } from "../utils";
import s3Util from "../utils/s3utils.js";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const deleteOTP = async (user_id) => {
  let sqlUpdateQuery = "UPDATE users set otp=? where id=?";
  await mysql.preparedQuery(sqlUpdateQuery, [null, user_id]);
  return true;
};

// Check if user id is exist or not
export const userById = async (userId) => {
  let sqlQuery = "select * from users where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [userId]);
  return row;
};

// Check if email id is already exist or not
export const checkEmailExists = async (email) => {
  let sqlQuery = "select id, email from users where email=?";
  let rows = await mysql.preparedQuery(sqlQuery, [email]);
  return [rows];
};

export const registerModel = async (userdata) => {
  if(!userdata.isGuestUser){
    const customer = await stripe.customers.create({
      description: "My customer Id for email " + userdata.email,
      email: userdata.email,
      name: userdata.name,
      metadata: {
        provider_id: userdata.email,
      },
    });
    let hashedPassword = bcrypt.hashSync(userdata.password, 8);
    let sqlInsert = `INSERT INTO users (name, email, password, otp, phone, device_token, device_type, provider,customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
    await mysql.preparedQuery(sqlInsert, [
      userdata.name,
      userdata.email,
      hashedPassword,
      userdata.otp,
      userdata.phone,
      userdata.uuid,
      userdata.devicetype,
      userdata.provider,
      customer.id,
    ]);
    let sqlQuery = `SELECT * FROM users WHERE email = '${userdata.email}'`;
    let [row] = await mysql.query(sqlQuery);
    setTimeout(() => {
      deleteOTP(row.id);
    }, 300000); // 5 Minutes expire time for OTP
    return row;
  }else{
    let hashedPassword = bcrypt.hashSync(userdata.password, 8);
    let sqlUpdateQuery = "UPDATE users set name=?,password=?,otp=?,phone=?,device_token=?,device_type=?,provider=?,role=? where email=?";
    await mysql.preparedQuery(sqlUpdateQuery, [
      userdata.name,
      hashedPassword,
      userdata.otp,
      userdata.phone,
      userdata.uuid,
      userdata.devicetype,
      userdata.provider,
      'user',
      userdata.email,
    ]);
    let sqlQuery = `SELECT * FROM users WHERE email = '${userdata.email}'`;
    let [row] = await mysql.query(sqlQuery);
    setTimeout(() => {
      deleteOTP(row.id);
    }, 300000); // 5 Minutes expire time for OTP
    return row;
  }
};

export const loginModel = async (userdata) => {
  let sqlQuery = "SELECT * from users where email=? AND provider=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [userdata.email, "email"]);
  if (row) {
    if(row.role==='guest'){
      return { validation: 5 }; // Account Not verified
    }else{
      let result = await bcrypt.compare(userdata.password, row.password);
      if (result === true) {
        if (row.is_verified === 0) {
          return { validation: 2 }; // Account Not verified
        } else {
          let sqlUpdateQuery =
            "UPDATE users set device_token=?,device_type=? where email=?";
          await mysql.preparedQuery(sqlUpdateQuery, [
            userdata.uuid,
            userdata.devicetype,
            userdata.email,
          ]);
          let outputJSON = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            profile_picture: row.profile_picture,
            role: row.role,
            provider: row.provider,
            customer_id:row.customer_id
          };
          const jwttoken = jwtToken(outputJSON);
          return {
            validation: 3,
            data: outputJSON,
            token: jwttoken,
          };
        }
      } else {
        return { validation: 1 }; // Email or Password wrong
      }
    }
  } else {
    return { validation: 4 }; // Email or Password wrong
  }
};

export const socialLoginModel = async (userdata) => {
  let sqlQuery = `SELECT * FROM users WHERE email = '${userdata.email}'`;
  let [row] = await mysql.query(sqlQuery);
  if (row) {
     if(row && row.provider === 'email' && row.is_verified === 1){
      return {isFlag:1};
     }else if(row && row.provider !== userdata.provider && row.is_verified === 1 &&  row.provider !== 'email'){
      return {isFlag:2};
     }else{
      let sqlUpdateQuery =
      "UPDATE users set name=?,email=?,phone=?,profile_picture=?,device_token=?,device_type=?,is_verified=? where id=?";
    await mysql.preparedQuery(sqlUpdateQuery, [
      userdata.name,
      userdata.email,
      userdata.phone,
      userdata.profile_picture,
      userdata.uuid,
      userdata.devicetype,
      1,
      row.id,
    ]);
    let outputJSON = {
      id: row.id,
      name: userdata.name,
      email: userdata.email,
      phone: userdata.phone,
      profile_picture: userdata.profile_picture,
      role: row.role,
      provider: row.provider,
      customer_id:row.customer_id
    };
    const jwttoken = jwtToken(outputJSON);
    return {
      isFlag:0,
      data: outputJSON,
      token: jwttoken,
    };
     }
  } else {
    const customer = await stripe.customers.create({
      description: "My customer Id for "+userdata.email+" of " +userdata.provider +" "+ userdata.provider_id,
      email:userdata.email,
      name: userdata.name,
      metadata: {
        provider_id: userdata.provider_id,
      },
    });
    let sqlInsert = `INSERT INTO users (name, email, phone, provider, provider_id, device_token,device_type,profile_picture,is_verified,customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await mysql.preparedQuery(sqlInsert, [
      userdata.name,
      userdata.email,
      userdata.phone,
      userdata.provider,
      userdata.provider_id,
      userdata.uuid,
      userdata.devicetype,
      userdata.profile_picture,
      1,
      customer.id
    ]);
    let [row] = await mysql.query(sqlQuery);
    let outputJSON = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      profile_picture: row.profile_picture,
      role: row.role,
      provider: row.provider,
      customer_id:row.customer_id
    };
    const jwttoken = jwtToken(outputJSON);
    return {
      isFlag:0,
      data: outputJSON,
      token: jwttoken,
    };
  }
};

export const verifyOtpModel = async (email, otp) => {
  let sqlQuery = "SELECT id from users WHERE otp=? AND email=?";
  let [rows] = await mysql.preparedQuery(sqlQuery, [otp, email]);
  if (rows) {
    let sqlUpdate = "UPDATE users SET is_verified=1, otp=? WHERE email=?";
    await mysql.preparedQuery(sqlUpdate, [null, email]);
    return true;
  } else {
    return false;
  }
};

export const forgotPasswordModel = async (email, otp) => {
  let sqlQuery =
    "SELECT id,name,is_verified,otp_count,TIMESTAMPDIFF(MINUTE, updated_at, NOW()) as time_minutes from users WHERE email=? AND provider=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [email, "email"]);
  if (row) {
    let uid = row.id;
    if (row.otp_count < 3) {
      let sqlUpdate = `UPDATE users SET otp=?,otp_count=? WHERE id=?`;
      await mysql.preparedQuery(sqlUpdate, [otp, row.otp_count + 1, uid]);
      setTimeout(() => {
        deleteOTP(row.id);
      }, 300000); // 5 Minutes expire time for OTP
      return { type: "otp_sent", name: row.name };
    } else if (row.time_minutes <= 15) {
      return { type: "limit_exceed" };
    } else {
      let sqlUpdate = `UPDATE users SET otp=?,otp_count=? WHERE id=?`;
      await mysql.preparedQuery(sqlUpdate, [otp, 1, uid]);
      setTimeout(() => {
        deleteOTP(row.id);
      }, 300000); // 5 Minutes expire time for OTP
      return { type: "otp_sent", name: row.name };
    }
  } else {
    return { type: "not_found" };
  }
};

export const resendOtpModel = async (email, otp) => {
  let sqlQuery =
    "SELECT id,name,otp_count,TIMESTAMPDIFF(MINUTE, updated_at, NOW()) as time_minutes from users WHERE email=? AND provider=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [email, "email"]);
  if (row) {
    let uid = row.id;
    if (row.otp_count < 3) {
      let sqlUpdate = `UPDATE users SET otp=?,otp_count=? WHERE id=?`;
      await mysql.preparedQuery(sqlUpdate, [otp, row.otp_count + 1, uid]);
      setTimeout(() => {
        deleteOTP(row.id);
      }, 300000); // 5 Minutes expire time for OTP
      return { type: "otp_sent", name: row.name };
    } else if (row.time_minutes <= 15) {
      return { type: "limit_exceed" };
    } else {
      let sqlUpdate = `UPDATE users SET otp=?,otp_count=? WHERE id=?`;
      await mysql.preparedQuery(sqlUpdate, [otp, 1, uid]);
      setTimeout(() => {
        deleteOTP(row.id);
      }, 300000); // 5 Minutes expire time for OTP
      return { type: "otp_sent", name: row.name };
    }
  } else {
    return { type: "not_found" };
  }
};

export const verifyPassOtpModel = async (email, otp) => {
  let sqlQuery = "SELECT id, email from users WHERE otp=? AND email=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [otp, email]);
  if (row) {
    let sqlUpdate = "UPDATE users SET is_verified=1, otp=? WHERE email=?";
    await mysql.preparedQuery(sqlUpdate, [null, email]);
    return { type: "otp_verify", user_id: row.id, email: row.email };
  } else {
    return false;
  }
};

export const resetPasswordModel = async (
  verificationId,
  email,
  newpassword
) => {
  try {
    let sqlQuery = "SELECT name,id,email from users WHERE id=? and email=?";
    let [row] = await mysql.preparedQuery(sqlQuery, [verificationId, email]);
    if (row) {
      let hashedPassword = bcrypt.hashSync(newpassword, 8);
      let sqlUpdate = "UPDATE users SET password=? WHERE id=? and email=?";
      await mysql.preparedQuery(sqlUpdate, [
        hashedPassword,
        verificationId,
        email,
      ]);
      return "updated";
    } else {
      return "not_found";
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const viewProfileModel = async (userId) => {
  let sqlQuery = "SELECT * from users where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [userId]);
  if (row) {
    let outputJSON = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      provider: row.provider,
      profile_picture: row.profile_picture,
      role: row.role,
    };
    return {
      data: outputJSON,
    };
  } else {
    return false; // token wrong
  }
};

export const editProfileModel = async (inputJson) => {
  let sqlQuery = "SELECT * from users where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inputJson.id]);
  if (row) {
    let sqlUpdateQuery = "UPDATE users set name=?, phone=? where id=?";
    await mysql.preparedQuery(sqlUpdateQuery, [
      inputJson.name,
      inputJson.phone,
      inputJson.id,
    ]);
    return true;
  } else {
    return false; // token wrong
  }
};

export const changePasswordModel = async (id, oldPassword, newPassword) => {
  let sqlQuery = "SELECT * from users where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [id]);
  if (row) {
    let result = await bcrypt.compare(oldPassword, row.password);
    if (result === true) {
      let hashedPassword = bcrypt.hashSync(newPassword, 8);
      let sqlUpdate = "UPDATE users SET password=? WHERE id=?";
      await mysql.preparedQuery(sqlUpdate, [hashedPassword, id]);
      return "updated";
    } else {
      return "wrong_pass";
    }
  } else {
    return "not_found";
  }
};

export const addContactUsFormModel = async (inputJson) => {
  let sqlInsert =
    "INSERT INTO contact_us( email, description, device_type) VALUES(?,?,?)";
  await mysql.preparedQuery(sqlInsert, [
    inputJson.email,
    inputJson.description,
    inputJson.device_type,
  ]);
  return true;
};

function generateGuestUsernameFromEmail(email) {
  if (!email || typeof email !== 'string') return 'guest_user';
  const [localPart] = email.toLowerCase().split('@');
  const processed = localPart
    .replace(/[^a-z._-]/g, '')           // Keep only letters, dot, dash, underscore
    .replace(/[.\-_]+/g, '_')            // Convert all separators to single underscore
    .replace(/^_+|_+$/g, '')             // Trim leading/trailing underscores
    .replace(/__+/g, '_');               // Collapse multiple underscores
  const name = processed || 'user';
  return `guest_${name}`;
}


export const guestLoginModel = async (userdata) => {
  let sqlQuery = `SELECT * FROM users WHERE email = '${userdata.email}'`;
  let [row] = await mysql.query(sqlQuery);
  if (row) {
       if((row.is_verified === 0) || (row.provider !== 'email') ){
        let sqlUpdateQuery = "UPDATE users set device_token=?,device_type=? where id=?";
        await mysql.preparedQuery(sqlUpdateQuery, [
          userdata.uuid,
          userdata.devicetype,
          row.id,
        ]);
        let outputJSON = {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          profile_picture: row.profile_picture,
          role: row.role,
          provider: row.provider,
          customer_id:row.customer_id
        };
        const jwttoken = jwtToken(outputJSON);
        return {
          isSuccess:true,
          data: outputJSON,
          token: jwttoken,
        };
       }else{
         return { isSuccess:false}  
       }
  } else {
    let guestName = generateGuestUsernameFromEmail(userdata.email)
    const customer = await stripe.customers.create({
      description: "My customer Id for email "+userdata.email,
      email:userdata.email,
      name: guestName,
      metadata: {
        guest_user: userdata.email,
      },
    });
    let sqlInsert = `INSERT INTO users (name, email, role, provider, device_token, device_type,customer_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await mysql.preparedQuery(sqlInsert, [
      guestName,
      userdata.email,
      userdata.role,
      userdata.provider,
      userdata.uuid,
      userdata.devicetype,
      customer.id
    ]);
    let [row] = await mysql.query(sqlQuery);
    let outputJSON = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      profile_picture: row.profile_picture,
      role: row.role,
      provider: row.provider,
      customer_id:row.customer_id
    };
    const jwttoken = jwtToken(outputJSON);
    return {
      isSuccess:true,
      data: outputJSON,
      token: jwttoken,
    };
  }
};

export const imageUploadModel = async (inputJson) => {
  let sqlInsert =
    "INSERT INTO images( user_id, inmate_id, image_type, image) VALUES(?,?,?,?)";
  let row = await mysql.preparedQuery(sqlInsert, [
    inputJson.user_id,
    inputJson.inmate_id,
    inputJson.image_type,
    inputJson.image,
  ]);
  return {id:row.insertId}
};

// Image data using by id
export const imageById = async (id) => {
  let sqlQuery = "select * from images where id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [id]);
   return row
};


// Image data using by inmate id
export const imageByinmateId = async (inmateid) => {
  let sqlQuery = "select * from images where inmate_id=?";
  let [row] = await mysql.preparedQuery(sqlQuery, [inmateid]);
   return row
};

// Images  using by inmate id where no order avaialble
export const imagesByinmateId = async (inmateid, userid) => {
  let sqlQuery = "select * from images where inmate_id=? AND user_id=? AND order_id IS NULL";
  let rows = await mysql.preparedQuery(sqlQuery, [inmateid, userid]);
  for (let [index, val] of rows.entries()) {
        if(val.image_type === 'local'){
            let s3ImageURL = val.image ? await s3Util.gets3URLDirect(val.image) : '';
            rows[index].image = s3ImageURL;
     }
  }
   return rows
};

// Images  using by inmate id where order avaialble
export const orderImagesByinmateId = async (inmateid, userid) => {
  let sqlQuery = "select * from images where inmate_id=? AND user_id=? AND order_id IS NOT NULL";
  let rows = await mysql.preparedQuery(sqlQuery, [inmateid, userid]);
  for (let [index, val] of rows.entries()) {
        if(val.image_type === 'local'){
            let s3ImageURL = val.image ? await s3Util.gets3URLDirect(val.image) : '';
            rows[index].image = s3ImageURL;
     }
  }
   return rows
};

// Delete Image data using by id
export const deleteUploadedImageModel = async (data) => {
  let sqlQuery = `DELETE FROM images where id=?`;
  let row = await mysql.preparedQuery(sqlQuery, [data.id]);
  if (data.image_type === 'local' && data.image && data.image.length > 1) {
      await s3Util.deleteObjectS3([{Key:data.image}]);
  }
  return row && row.affectedRows != 0 ? true : false;
};

// Images by array of ids 
export const imagesByIds = async (ids, userid, inmate_id) => {
  const placeholders = ids.map(() => '?').join(', ');
  let sqlQuery = `select * from images where inmate_id=? AND user_id=? AND order_id IS NULL AND id IN (${placeholders})`;
  const values = [inmate_id, userid, ...ids]; 
  let rows = await mysql.preparedQuery(sqlQuery, values);
   return rows
};

// Images by array of ids 
export const checkoutOrderModel = async (inputJson, tierData, imageData) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_configuration: 'pmc_1R3xhqL1W3FcBtVaX6YWR8bv',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `Image Pack: ${tierData.label}` },
          unit_amount: tierData.price_cents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://dev.ezbidn.com/user/account/order-confirmed',
    cancel_url: 'https://dev.ezbidn.com/user/account/order-failed',
  });
  let sqlInsert = `INSERT INTO orders (user_id, inmate_id, customer_id, pricing_tier_id, payment_checkout_id,payment_status,images, device_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  let row = await mysql.preparedQuery(sqlInsert, [
    inputJson.user_id,
    inputJson.inmate_id,
    inputJson.customer_id,
    inputJson.pricing_tier_id,
    session.id,
    session.payment_status,
    JSON.stringify(inputJson.images),
    inputJson.devicetype
  ]);
  const placeholders = inputJson.images.map(() => '?').join(', ');
  let sqlUpdateQuery = `UPDATE images SET order_id =${row.insertId} where id IN (${placeholders})`;
  const values = [...inputJson.images]; 
  await mysql.preparedQuery(sqlUpdateQuery, values);
  return session
};

// Orders
export const getAllOrdersModel = async (id) => {
  let sqlQuery = `SELECT 
  o.id AS order_id,
  o.customer_id,
  o.payment_checkout_id,
  o.created_at,
  o.images,
  o.user_id,
  o.shipment_status,
  u.name AS user_name,
  u.email AS user_email,
  u.role AS user_role,
  u.provider AS user_provider,
  o.inmate_id AS id,
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
WHERE o.user_id = ${id}
ORDER BY o.created_at DESC;
`
  let rows = await mysql.query(sqlQuery);
  for (let [index, val] of rows.entries()) {
    const placeholders = val.images.map(() => '?').join(', ');
    let sqlImageQuery = `select * from images where order_id=? AND id IN (${placeholders})`;
    const values = [val.order_id, ...val.images]; 
    let rowsImage = await mysql.preparedQuery(sqlImageQuery, values);
      for (let [indexImage, valImage] of rowsImage.entries()) {
            if(valImage.image_type === 'local'){
                let s3ImageURL = valImage.image ? await s3Util.gets3URLDirect(valImage.image) : '';
                rowsImage[indexImage].image = s3ImageURL;
         }
      }
    rows[index].images = rowsImage
    const session = await stripe.checkout.sessions.retrieve(val.payment_checkout_id);
    rows[index].amount_total = session.amount_total;
    rows[index].transaction_id = session.id;
    rows[index].payment_status = session.payment_status;
    rows[index].payment_email = session.email;
  }
  return rows

};


// Get Order Details By Id
export const getOrderDetailsByIdModel = async (id, userId) => {
  try {
    let sqlQuery = `SELECT 
     o.id,
     o.customer_id,
     o.payment_checkout_id,
     o.created_at,
     o.images,
     o.user_id,
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
      WHERE o.id = ${id} AND o.user_id=${userId}`
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


// Checkout payment status
export const checkPaymentStatusModel = async (id) => {
  const session = await stripe.checkout.sessions.retrieve(id);
  return session
};




