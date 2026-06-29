const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.get('/export', authMiddleware, adminMiddleware, productController.exportProducts);
router.get('/:slug', productController.getProduct);

// Admin only
router.post('/', authMiddleware, adminMiddleware, upload.any(), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.any(), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
