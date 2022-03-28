const mysql = require('mysql');
const dbconfig = require('../../_secret/db/db.json');

class Database {
  constructor() {
    this.connection = mysql.createPool({
      connectionLimit: 5,
      host: dbconfig.connection.host,
      user: dbconfig.connection.user,
      password: dbconfig.connection.password,
      database: dbconfig.connection.database,
      debug: false,
      multipleStatements: true
    });

    this.connection.getConnection((err, connection) => {
      if (err) throw err;
      console.log('-------Database connected successfully------');
      connection.release();
    });
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      })
    })
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      })
    })
  }
}

const database = new Database();

module.exports = database