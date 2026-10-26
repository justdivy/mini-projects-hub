const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/orderController');
router.post('/', auth, controller.create);
module.exports = router;
