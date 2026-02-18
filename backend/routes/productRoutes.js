const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addFavorite,
    removeFavorite,
    getFavorites,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

router
    .route('/')
    .get(getProducts)
    .post(
        protect,
        admin,
        [
            body('title', 'Title is required').notEmpty(),
            body('price', 'Price must be a positive number').isFloat({ min: 0 }),
            body('description', 'Description is required').notEmpty(),
            body('image', 'Image URL is required').notEmpty(),
        ],
        validate,
        createProduct
    );
router.route('/favorites').get(protect, getFavorites);
router
    .route('/:id')
    .get(getProductById)
    .put(
        protect,
        admin,
        [
            body('title', 'Title is required').optional().notEmpty(),
            body('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
            body('description', 'Description is required').optional().notEmpty(),
            body('image', 'Image URL is required').optional().notEmpty(),
        ],
        validate,
        updateProduct
    )
    .delete(protect, admin, deleteProduct);
router.route('/:id/favorite').post(protect, addFavorite).delete(protect, removeFavorite);

module.exports = router;
