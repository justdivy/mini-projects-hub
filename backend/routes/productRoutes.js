const router = require('express').Router();
const controller = require('../controllers/productController');
router.get('/', controller.list);
module.exports = router;
