const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan')
const __PORT__ = process.env.PORT;
const __DATABASE__ = require('./db/db');
const bodyParser = require('body-parser');
const lineNotify  = require('./notify/notify');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); //เก็บข้อมูลจาก body
app.use(cors());
app.use(express.json());

// Import route files
const view_product= require('./routes/view_product');
const add_new_product = require('./routes/add_new_product');
const view_outstock_product = require('./routes/view_outstock_product');
const edit_product = require('./routes/edit_product');
const delete_product = require('./routes/delete_product')
const register = require('./routes/register_route');
const login_route = require('./routes/login_route');
const sale = require('./routes/sale_route');
const dailysale = require('./routes/view_dailysale');
const add_product_quantity = require('./routes/add_product_quantity');


//get routes
app.get('/', (_req, res, _next) => {
  res.send('Response form Home เด๊อจ่ะ');
})
//Route view product
app.get('/view-product',view_product);
//Route add product
app.post ('/add-product',add_new_product)
//Route view product outstock
app.get ('/view-outstock-product',view_outstock_product);
//Route edit product
app.post ('/edit-product',edit_product)
//Route delete product และส่ง para เป็น _id
app.delete('/delete-product/:_id', delete_product);
//Route register
app.post('/register', register);
//Route login
app.post('/login', login_route);
//Route sale
app.post('/sale', sale);
//Route dailysale
app.get('/view-dailysale',dailysale);
//Route add product quantity
app.post('/add-product-quantity',add_product_quantity);


//Cnnect database
__DATABASE__();

//PORT
app.listen(__PORT__, () => {
  console.log(`App listening on port ${__PORT__}`)
})
//ส่งแจ้งเตือนทุก 2 ทุ่ม
const cron = require('node-cron');
// สร้าง cron job เพื่อตรวจสอบทุกวันที่ 20:00
cron.schedule('0 20 * * *', () => {
  console.log('Cron job is running...');
  lineNotify(); // เรียกฟังก์ชันส่ง Line Notify ที่คุณสร้าง
});