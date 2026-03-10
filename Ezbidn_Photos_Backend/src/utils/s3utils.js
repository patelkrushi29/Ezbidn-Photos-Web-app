// const AWS = require('aws-sdk')
// const dbHandle = require('../db.js').mysql;

const { S3Client, PutObjectCommand, DeleteObjectsCommand, GetObjectCommand  } = require("@aws-sdk/client-s3");
const { getSignedUrl   } = require("@aws-sdk/s3-request-presigner");
const client = new S3Client({
  region: process.env.REGION,
  credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
  },
});


// const S3 = new AWS.S3({
//   region: process.env.REGION,
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_KEY
// })
const s3Controller = {}

// To Upload file on s3
// s3Controller.uploadS3 = async (file, filename) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${filename}`,
//       Body: file.data,
//       ContentType: `${file.mimetype}`,
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.upload(params, (error, data) => {
//         if (error) {
//           reject(error)
//           // console.log("error", error)
//         } else {
//         //   console.log('success', data)
//           resolve(data.Key)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     return false
//   }
// }

// // Delete multiple files

// s3Controller.deleteObjectS3 = async (keyArray) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Delete: { Objects: [...keyArray] },
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.deleteObjects(params, (error, data) => {
//         if (error) {
//           reject(error)
//           // console.log("error", error)
//         } else {
//           console.log('success delete file', data)
//           resolve(data.Location)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     return false
//   }
// }

// // Get s3 url from private bucket and push url in db for local image path
// s3Controller.gets3URL = async (keyName) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`,
//       Expires: 60*60*24
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.getSignedUrl('getObject', params, async(error, data) => {
//         if (error) {
//           reject(error)
//         } else {
//           let imageName =  keyName.split('/');
//           let keyValueName = imageName && imageName.length > 1 ? imageName[imageName.length - 1] : keyName;
//           const shortUrl =  await generateShortUrl(data, keyValueName);
//           resolve(shortUrl)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     // console.log('errerrerr', err, keyName)
//     return ''
//   }
// }

// const generateShortUrl = async (longUrl, keyName) => {
//   let sqlInsertOrUpdate = `INSERT INTO s3filepath (keyname, s3url,created_at) VALUES ('${keyName}','${longUrl}',CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE keyname='${keyName}',s3url = '${longUrl}',
//   created_at = CURRENT_TIMESTAMP`;
//   await dbHandle.query(sqlInsertOrUpdate);
//   const shortUrl = process.env.SERVER_API_URL +'/api/v1/app/fileUrl/'+ keyName;
//   return shortUrl;
// };

// // Get s3 url from private bucket and send it as reponse without saving url in db
// s3Controller.gets3URLDirect = async (keyName) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`,
//       Expires: 60*60*24
//     }
//     let fileURI = await new Promise((resolve, reject) => {
//       S3.getSignedUrl('getObject', params, async(error, data) => {
//         if (error) {
//           reject(error)
//         } else {
//           resolve(data)
//         }
//       })
//     })
//     return fileURI
//   } catch (err) {
//     return ''
//   }
// }


// s3Controller.gets3Data = async (keyName) => {
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`
//     }
//     const s3Response = await S3.getObject(params).promise();
//     const resData = s3Response.Body.toString('utf-8');
//     return resData
//   } catch (err) {
//     return ''
//   }
// }





/*888888888888888888888888888888888888888888888888 New S3 Code 888888888888888888888888888888888*/
s3Controller.uploadS3 = async (file, filename) => {
  try {
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${filename}`,
      Body: file.data,
      ContentType: `${file.mimetype}`,
    }
    const command = new PutObjectCommand(params);
    await client.send(command);
    return filename;
  } catch (err) {
    return false
  }
}



// s3Controller.gets3URL = async (keyName) => {
//   // Get s3 url from private bucket
//   try {
//     let params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `${keyName}`,
//       Expires: 60*60*24
//     }
//     const command = new GetObjectCommand(params);
//     const signedUrl = await getSignedUrl(client, command, {expiresIn:60*60*24});
//     let imageName =  keyName.split('/');
//     let keyValueName = imageName && imageName.length > 1 ? imageName[imageName.length - 1] : keyName;
//     const shortUrl =  await generateShortUrl(signedUrl, keyValueName);
//     return shortUrl;
//   } catch (err) {
//     return ''
//   }
// }

// const generateShortUrl = async (longUrl, keyName) => {
//   let sqlInsertOrUpdate = `INSERT INTO s3filepath (keyname, s3url,created_at) VALUES ('${keyName}','${longUrl}',CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE keyname='${keyName}',s3url = '${longUrl}',
//   created_at = CURRENT_TIMESTAMP`;
//   await dbHandle.query(sqlInsertOrUpdate);
//   const shortUrl = process.env.SERVER_API_URL +'/api/v1/app/fileUrl/'+ keyName;
//   return shortUrl;
// };

// Get s3 url from private bucket and send it as reponse without saving url in db
s3Controller.gets3URLDirect = async (keyName) => {
  try {
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${keyName}`,
      Expires: 60*60*24
    }
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(client, command, {expiresIn:60*60*24});
    return signedUrl;
  } catch (err) {
    return ''
  }
}

s3Controller.deleteObjectS3 = async (keyArray) => {
  // Delete multiple files
  try {
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Delete: { Objects: [...keyArray] },
    }
    const command = new DeleteObjectsCommand(params);
    await client.send(command);
    return true;
  } catch (err) {
    return false
  }
}


module.exports = s3Controller
