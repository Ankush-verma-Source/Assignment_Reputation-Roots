import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, ShoppingCart, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    if (!user) {
        return (
            <div className="container cart-page">
                <div className="cart-empty fade-in">
                    <div className="cart-empty-icon">
                        <ShoppingCart size={40} />
                    </div>
                    <h2>Please sign in</h2>
                    <p>You need to be logged in to view your cart.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container cart-page">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={16} />
                    Continue Shopping
                </button>
                <div className="cart-empty fade-in">
                    <div className="cart-empty-icon">
                        <ShoppingCart size={40} />
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything yet. Start browsing!</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const handleCheckout = () => {
        toast.success('Order placed successfully! 🎉', { duration: 3000 });
        clearCart();
        navigate('/');
    };

    return (
        <div className="container cart-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={16} />
                Continue Shopping
            </button>

            <div className="cart-header">
                <h1>Your Cart</h1>
                <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
            </div>

            <div className="cart-grid">
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item._id} className="cart-item fade-in">
                            <div className="cart-item-image">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                            </div>
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p className="item-price">${Number(item.price).toFixed(2)} each</p>
                                <p className="item-subtotal">
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                            <div className="item-actions">
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item._id)}
                                    title="Remove item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-rows">
                        <div className="summary-row">
                            <span>Subtotal ({cart.reduce((c, i) => c + i.quantity, 0)} items)</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row free">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row free">
                            <span>Tax</span>
                            <span>Included</span>
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                    <button onClick={clearCart} className="clear-cart-btn">
                        Clear Cart
                    </button>

                    <div className="summary-note">
                        <ShieldCheck size={14} />
                        Secure checkout — your data is protected
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
