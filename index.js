const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan')
const __PORT__ = process.env.PORT;
const __DATABASE__ = require('./db/db');
const bodyParser = require('body-parser');
const lineNotify = require('./notify/notify');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); //เก็บข้อมูลจาก body

// ตั้งค่า CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // ให้เปิดโอกาสให้ทำงานกับ cookies และ credentials
};
app.use(cors(corsOptions));
app.use(express.json());

// Import route files
const view_product = require('./routes/view_product');
const view_outstock_product = require('./routes/view_outstock_product');
const edit_product = require('./routes/edit_product');
const delete_product = require('./routes/delete_product')
const register = require('./routes/register_route');
const login_route = require('./routes/login_route');
const sale = require('./routes/sale_route');
const dailysale = require('./routes/view_dailysale');
const add_product_quantity = require('./routes/add_product_quantity');
const sale_credit = require('./routes/sale_credit');
const auth = require('./auth/authen');

//get routes
app.get('/', auth.isLogin, async(_req, res, next) => {
  res.send('Response form Home เด๊อจ่ะ');
});

//Route view product
app.get('/view-product',auth.isLogin, view_product);
//Route add product
const add_product_route = require("./controller/con_add_new_product");
app.use(add_product_route,auth.isLogin);
//Route view product outstock
app.get('/view-outstock-product',auth.isLogin, view_outstock_product);
//Route edit product
app.post('/edit-product',auth.isLogin, edit_product)
//Route delete product และส่ง para เป็น _id
app.delete('/delete-product/:_id',auth.isLogin, delete_product);
//Route register
app.post('/register',register);
//Route login
app.post('/login', login_route);
//Route sale
app.post('/sale',auth.isLogin, sale);
//Route dailysale
app.get('/view-dailysale',auth.isLogin, dailysale);
//Route add product quantity
app.post('/add-product-quantity',auth.isLogin, add_product_quantity);
//Route sale by credit
app.post('/sale-credit',auth.isLogin, sale_credit);

//กำหนดให้เข้าถึงไฟล์รูปภาพได้
app.use('/uploads', express.static('uploads'));

//Cnnect database
__DATABASE__();

//PORT
app.listen(__PORT__, () => {
  console.log(`App listening on port ${__PORT__}`)
})
//ส่งแจ้งเตือนทุก 2 ทุ่ม
const cron = require('node-cron');
cron.schedule('0 13 * * *', () => {
  console.log('Cron job is running...');
  lineNotify();
});