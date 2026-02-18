const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        const users = await User.create([
            { username: 'admin', password: 'password123', isAdmin: true },
            { username: 'user1', password: 'password123', isAdmin: false },
        ]);

        const adminId = users[0]._id;

        const products = [
            {
                title: 'iPhone 15 Pro',
                price: 999,
                description: 'Latest Apple smartphone with titanium design and A17 Pro chip. Features a 48MP camera system and USB-C connectivity.',
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800',
                category: 'Smartphones',
                user: adminId,
            },
            {
                title: 'MacBook Air M2',
                price: 1199,
                description: 'Supercharged by M2 chip, incredibly thin and fast. Up to 18 hours of battery life with a stunning Liquid Retina display.',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
                category: 'Laptops',
                user: adminId,
            },
            {
                title: 'Sony WH-1000XM5',
                price: 349,
                description: 'Industry-leading noise cancelling wireless headphones with 30-hour battery life and multipoint connection.',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
                category: 'Audio',
                user: adminId,
            },
            {
                title: 'Samsung Galaxy Watch 6',
                price: 299,
                description: 'The ultimate smartwatch for health tracking and style. Features advanced sleep coaching and body composition analysis.',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
                category: 'Wearables',
                user: adminId,
            },
            {
                title: 'Dell XPS 13',
                price: 1099,
                description: 'Compact laptop with stunning InfinityEdge display and 12th Gen Intel Core processors for exceptional performance.',
                image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800',
                category: 'Laptops',
                user: adminId,
            },
            {
                title: 'Logitech MX Master 3S',
                price: 99,
                description: 'Precision mouse with ultra-quiet clicks and MagSpeed electromagnetic scrolling. Works on any surface including glass.',
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800',
                category: 'Accessories',
                user: adminId,
            },
            {
                title: 'Keychron K2 Mechanical Keyboard',
                price: 79,
                description: 'Wireless mechanical keyboard for a tactile typing experience. Compatible with Mac and Windows with RGB backlighting.',
                image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800',
                category: 'Accessories',
                user: adminId,
            },
            {
                title: 'Nintendo Switch OLED',
                price: 349,
                description: 'High-definition gaming on the go with a vibrant 7-inch OLED screen and enhanced audio for handheld mode.',
                image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800',
                category: 'Gaming',
                user: adminId,
            },
            {
                title: 'Kindle Paperwhite',
                price: 139,
                description: 'The thinnest, lightest Kindle Paperwhite with a 300 ppi glare-free display and weeks of battery life.',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
                category: 'E-Readers',
                user: adminId,
            },
            {
                title: 'GoPro HERO12 Black',
                price: 399,
                description: 'Action camera with incredible 5.3K video, HDR, and HyperSmooth 6.0 stabilization. Waterproof to 33ft.',
                image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800',
                category: 'Cameras',
                user: adminId,
            },
            {
                title: 'iPad Pro M2',
                price: 799,
                description: 'Astonishing M2 performance with an incredibly advanced Liquid Retina XDR display and Apple Pencil hover.',
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800',
                category: 'Tablets',
                user: adminId,
            },
            {
                title: 'AirPods Pro 2',
                price: 249,
                description: 'Up to 2x more Active Noise Cancellation with Adaptive Audio that seamlessly transitions between modes.',
                image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=800',
                category: 'Audio',
                user: adminId,
            },
            {
                title: 'DJI Mini 4 Pro',
                price: 759,
                description: 'Mini drone with 4K/60fps camera, omnidirectional obstacle sensing, and up to 34 minutes of flight time.',
                image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=800',
                category: 'Drones',
                user: adminId,
            },
            {
                title: 'ASUS ROG Swift Monitor',
                price: 699,
                description: 'Ultra-fast 240Hz gaming monitor with stunning color accuracy and NVIDIA G-SYNC for tear-free gameplay.',
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800',
                category: 'Monitors',
                user: adminId,
            },
            {
                title: 'Bose QuietComfort Ultra',
                price: 429,
                description: 'World-class noise cancellation with breakthrough spatial audio and CustomTune technology for personalized sound.',
                image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800',
                category: 'Audio',
                user: adminId,
            },
            {
                title: 'Canon EOS R5',
                price: 3899,
                description: 'Professional full-frame mirrorless camera with 45MP sensor, 8K RAW video, and in-body image stabilization.',
                image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=800',
                category: 'Cameras',
                user: adminId,
            },
            {
                title: 'Xbox Series X',
                price: 499,
                description: 'The fastest, most powerful Xbox ever. Experience 4K gaming at up to 120 FPS with 1TB custom NVMe SSD.',
                image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=800',
                category: 'Gaming',
                user: adminId,
            },
            {
                title: 'Marshall Stanmore III',
                price: 379,
                description: 'Iconic home speaker with immersive room-filling sound, Bluetooth 5.2, and classic Marshall aesthetic.',
                image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800',
                category: 'Audio',
                user: adminId,
            },
            {
                title: 'Steam Deck OLED',
                price: 549,
                description: 'The ultimate handheld gaming experience with a stunning HDR OLED screen and up to 12 hours of battery life.',
                image: 'https://images.unsplash.com/photo-1621259182978-fbf93122b13d?q=80&w=800',
                category: 'Gaming',
                user: adminId,
            },
            {
                title: 'Razer DeathAdder V3',
                price: 149,
                description: 'Ultra-lightweight wireless gaming mouse with Focus Pro 30K optical sensor for competitive precision.',
                image: 'https://images.unsplash.com/photo-1527814732930-de47d2430a42?q=80&w=800',
                category: 'Gaming',
                user: adminId,
            },
        ];

        await Product.insertMany(products);

        console.log(`✅ Seeded ${products.length} products and ${users.length} users successfully!`);
        process.exit();
    } catch (error) {
        console.error(`❌ Seed error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
