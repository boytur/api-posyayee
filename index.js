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
const view_product_no_qr = require('./routes/view_product_no_qr');
const add_product_no_qr = require('./routes/add_product_no_qr');


//get routes
app.get('/', (req, res, next) => {
  res.send('Response form Home เด๊อจ่ะ');
})
//Route product no qr
app.get('/view-product-no-qr', view_product_no_qr);
//Route add product no qr
app.post ('/add-product-no-qr',add_product_no_qr)


//Cnnect database
__DATABASE__();

//PORT
app.listen(__PORT__, () => {
  console.log(`App listening on port ${__PORT__}`)
})
