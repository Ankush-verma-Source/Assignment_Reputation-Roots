import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, LayoutGrid, LogOut, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <ShoppingBag size={18} />
                    </div>
                    <div className="logo-text">
                        Micro<span>Market</span>
                    </div>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <LayoutGrid size={16} />
                        <span>Shop</span>
                    </Link>

                    {user ? (
                        <>
                            {/* Regular user links — hidden for admin */}
                            {!user.isAdmin && (
                                <>
                                    <Link to="/favorites" className={`nav-item ${isActive('/favorites') ? 'active' : ''}`}>
                                        <Heart size={16} />
                                        <span>Favorites</span>
                                    </Link>

                                    <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''}`}>
                                        <div className="cart-badge">
                                            <ShoppingCart size={16} />
                                            {cartCount > 0 && (
                                                <span className="cart-count">{cartCount}</span>
                                            )}
                                        </div>
                                        <span>Cart</span>
                                    </Link>
                                </>
                            )}

                            {/* Admin-only link */}
                            {user.isAdmin && (
                                <Link to="/admin/products" className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
                                    <LayoutGrid size={16} />
                                    <span>Inventory</span>
                                </Link>
                            )}

                            <div className="nav-divider" />

                            <div className="user-menu">
                                <div className="user-chip">
                                    <div className="user-avatar">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.username}</span>
                                    {user.isAdmin && (
                                        <span className="admin-tag">Admin</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="logout-btn"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-btns">
                            <Link to="/login" className="btn-ghost">Login</Link>
                            <Link to="/register" className="btn-nav-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
