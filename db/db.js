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
const uri = `${MONGO_DB_URI}`;

function connect_db_mongodb() {
  mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:false
  })
  .then(()=>{
    console.log("Connected database DEMO!");
  })
  .catch ((err)=>{
    console.log(err);
  })
}
module.exports = connect_db_mongodb;