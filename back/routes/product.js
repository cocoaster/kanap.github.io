const express = require('express');
const router = express.Router();
const path = require('path');

const productCtrl = require('../controllers/product');


router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getOneProduct);
router.post('/order', productCtrl.orderProducts);

module.exports = router;