const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
  });
router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getOneProduct);
router.post('/order', productCtrl.orderProducts);

module.exports = router;