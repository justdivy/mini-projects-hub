const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/cartController');
router.use(auth);
router.get('/', controller.get);
router.post('/', controller.add);
router.patch('/:productId', controller.update);
router.delete('/:productId', controller.remove);
module.exports = router;
