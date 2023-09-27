/*
    เชื่อมต่อ MngoDB และ exports ไปใช้ในชื่อ
    connect_db_mongodb

    DATE : 27/กันยายน/2023
    OWNER : piyawat W. 
*/

require("dotenv").config();
const __PASSDB__ = process.env.PASS_DATABASE;

const mongoose = require("mongoose");
const uri = `mongodb+srv://piyawatbackup:${__PASSDB__}@cluster0.nxfb6yd.mongodb.net/?retryWrites=true&w=majority`;

function connect_db_mongodb() {
  mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:false
  })
  .then(()=>{
    console.log("Connected database !");
  })
  .catch ((err)=>{
    console.log(err);
  })
}
module.exports = connect_db_mongodb;
