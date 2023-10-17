const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan')
const __PORT__ = process.env.PORT;
const __DATABASE__ = require('./db/db');
const bodyParser = require('body-parser');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); //เก็บข้อมูลจาก body
app.use(cors());


// Import route files
const view_product= require('./routes/view_product');
const add_product = require('./routes/add_product');
const view_outstock_product = require('./routes/view_outstock_product');
const edit_product = require('./routes/edit_product');
const delete_product = require('./routes/delete_product')

//get routes
app.get('/', (_req, res, _next) => {
  res.send('Response form Home เด๊อจ่ะ');
})
//Route view product
app.get('/view-product', view_product);
//Route add product
app.post ('/add-product',add_product)
//Route view product outstock
app.get ('/view-outstock-product',view_outstock_product);
//Route edit product
app.post ('/edit-product',edit_product)
//Route delete product และส่ง para เป็น _id
app.delete('/delete-product/:_id', delete_product);
//Cnnect database
__DATABASE__();

//PORT
app.listen(__PORT__, () => {
  console.log(`App listening on port ${__PORT__}`)
})
