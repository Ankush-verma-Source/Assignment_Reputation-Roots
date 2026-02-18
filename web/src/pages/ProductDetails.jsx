import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Heart, ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, Package } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
        // Only check favorites for logged-in non-admin users
        if (user && !user.isAdmin) checkFavorite();
    }, [id, user]);

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/${id}`);
            setProduct(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product', error);
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        try {
            const { data } = await API.get('/products/favorites');
            setIsFavorite(data.some(fav => fav._id === id));
        } catch (error) {
            console.error('Error checking favorite', error);
        }
    };

    const handleToggleFavorite = async () => {
        if (!user) {
            toast.error('Please login to save favorites');
            return;
        }
        try {
            if (isFavorite) {
                await API.delete(`/products/${id}/favorite`);
                setIsFavorite(false);
                toast.success('Removed from favorites');
            } else {
                await API.post(`/products/${id}/favorite`);
                setIsFavorite(true);
                toast.success('Added to favorites ♥');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update favorites');
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        addToCart(product);
        toast.success('Added to cart!');
    };

    if (loading) return (
        <div className="container loading-state">
            <div className="loading-spinner" />
            <p>Loading product...</p>
        </div>
    );

    if (!product) return (
        <div className="container error-state">
            <Package size={48} />
            <h2>Product not found</h2>
            <button className="btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
        </div>
    );

    return (
        <div className="container product-details-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={16} />
                Back to Results
            </button>

            <div className="details-grid fade-in">
                {/* Image Panel */}
                <div className="product-image-panel">
                    <div className="product-image-large">
                        <img
                            src={product.image}
                            alt={product.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
                            }}
                        />
                        <div className="image-badge">
                            <span className="badge badge-success">In Stock</span>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="product-info-panel">
                    <div className="product-meta">
                        {product.category && (
                            <span className="badge badge-primary">{product.category}</span>
                        )}
                    </div>

                    <h1>{product.title}</h1>

                    <div className="product-price-section">
                        <span className="product-price">${Number(product.price).toFixed(2)}</span>
                        <span className="price-note">Free shipping included</span>
                    </div>

                    {/* Only show cart & favorites for non-admin users */}
                    {(!user || !user.isAdmin) && (
                        <div className="action-row">
                            <button
                                className="btn-primary add-to-cart-btn"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button
                                className={`fav-detail-btn ${isFavorite ? 'active' : ''}`}
                                onClick={handleToggleFavorite}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <Heart size={22} fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    )}

                    <div className="description-section">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="trust-points">
                        <div className="trust-point">
                            <div className="trust-icon"><ShieldCheck size={18} /></div>
                            <div className="trust-text">
                                <strong>1 Year Warranty</strong>
                                <span>Full manufacturer coverage</span>
                            </div>
                        </div>
                        <div className="trust-point">
                            <div className="trust-icon"><Truck size={18} /></div>
                            <div className="trust-text">
                                <strong>Free Delivery</strong>
                                <span>2–5 business days</span>
                            </div>
                        </div>
                        <div className="trust-point">
                            <div className="trust-icon"><RotateCcw size={18} /></div>
                            <div className="trust-text">
                                <strong>Easy Returns</strong>
                                <span>30-day return policy</span>
                            </div>
                        </div>
                        <div className="trust-point">
                            <div className="trust-icon"><Package size={18} /></div>
                            <div className="trust-text">
                                <strong>Secure Packaging</strong>
                                <span>Damage-free guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
