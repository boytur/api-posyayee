
const express = require("express");
const router = express.Router();
const { con_sale_credit} = require("../controller/con_sale_credit");

router.post("/sale-credit", con_sale_credit);
module.exports = router;
