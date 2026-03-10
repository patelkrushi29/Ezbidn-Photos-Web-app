"use strict";
require("dotenv").config();
const mysql = require("mysql2");

class MySqlClient {
  constructor() {
    this.pool = null;
    this.connect();
  }
  async connect() {
    try {
      let dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
        charset: process.env.CHAR_SET,
        dateStrings: true,
        connectionLimit: 100,
        "pool": {
          "max": 10,
          "min": 0,
          "acquire": 30000,
          "idle": 10000
        }
      }
      this.pool = mysql.createPool(dbConfig);
    } catch (err) {
      console.error('Error in AWS db', err);
      throw err;
    }
  }

  query(sql) {
    if (!this.pool) {
      throw new Error('MySQL connection pool not initialized');
    }

    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          reject(new Error(`${err.message} - Unable to execute query`));
          return;
        }
        connection.config.dateStrings = true;
        connection.query(sql, (error, rows) => {
          connection.release();
          if (error) {
            console.log('SQL WITH ERROR ==>');
            console.log(sql);
            console.log(error);
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  preparedQuery(sql, params) {
    if (!this.pool) {
      throw new Error('MySQL connection pool not initialized');
    }

    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          reject(new Error('Unable to execute query'));
          return;
        }

        connection.config.namedPlaceholders = true;
        connection.execute(sql, params || [], (error, rows) => {
          connection.release();
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  formatQuery(sql, params) {
    if (!this.pool) {
      throw new Error('MySQL connection pool not initialized');
    }

    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          reject(new Error('Unable to execute query'));
          return;
        }

        resolve(connection.format(sql, params));
      });
    });
  }

  disconnect() {
    if (this.pool) {
      try {
        this.pool.end();
        console.log("DB: DB Connection Closed");
      } catch (e) {
        console.log("DB: ERR: DB Connection Close ", e);
      }
    }
  }
}

module.exports.mysql = new MySqlClient
