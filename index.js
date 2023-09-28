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
app.use(cors());
app.use(bodyParser.json()); //เก็บข้อมูลจาก body


// Import route files
const view_product= require('./routes/view_product');
const add_product = require('./routes/add_product');
const view_outstock_product = require('./routes/view_outstock_product');
const edit_product = require('./routes/edit_product');

//get routes
app.get('/', (_req, res, _next) => {
  res.send('Response form Home เด๊อจ่ะ');
})
//Route view product
app.get('/view-product', view_product);
//Route add product
app.post ('/add-product',add_product)
//Route add view product outstock
app.get ('/view-outstock-product',view_outstock_product);
//Route add edit product outstock
app.post ('/edit-product',edit_product)



//Cnnect database
__DATABASE__();

//PORT
app.listen(__PORT__, () => {
  console.log(`App listening on port ${__PORT__}`)
})
