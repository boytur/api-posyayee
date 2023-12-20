/*
    เชื่อมต่อ MngoDB และ exports ไปใช้ในชื่อ
    connect_db_mongodb

    DATE : 27/กันยายน/2023
    OWNER : piyawat W. 
*/

// //DB-DEMO
require("dotenv").config();
const MONGO_DB_URI = process.env.MONGO_DB_URI;

const mongoose = require("mongoose");

function connect_db_mongodb() {
  mongoose.connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    });
}

module.exports = connect_db_mongodb;