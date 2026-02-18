const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get products
// @route   GET /products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    // Allow caller to override pageSize (e.g. admin inventory uses pageSize=100)
    // Default 12 for the shop, capped at 100 to prevent abuse
    const pageSize = Math.min(Number(req.query.pageSize) || 12, 100);
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Get product by ID
// @route   GET /products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, image, category } = req.body;

    const product = new Product({
        title,
        price,
        description,
        image,
        category: category || '',
        user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
    const { title, price, description, image, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        product.title = title || product.title;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        if (category !== undefined) product.category = category;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Add product to favorites
// @route   POST /products/:id/favorite
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if product is already favorites using string comparison
    const isFavorited = user.favorites.some(
        (favId) => favId.toString() === product._id.toString()
    );

    if (isFavorited) {
        res.status(400);
        throw new Error('Product already favorited');
    }

    user.favorites.push(product._id);
    await user.save();

    res.json({ message: 'Product added to favorites' });
});

// @desc    Remove product from favorites
// @route   DELETE /products/:id/favorite
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Filter out the product ID using string comparison
    user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: 'Product removed from favorites' });
});

// @desc    Get favorite products
// @route   GET /products/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Robustly filter out nulls/undefined — Mongoose populate returns null for deleted docs
    const activeFavorites = user.favorites.filter(
        (item) => item != null && item._id
    );

    // Clean up stale IDs from user document if any were deleted
    if (activeFavorites.length !== user.favorites.length) {
        user.favorites = activeFavorites.map((item) => item._id);
        await user.save();
    }

    res.json(activeFavorites);
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addFavorite,
    removeFavorite,
    getFavorites,
};
