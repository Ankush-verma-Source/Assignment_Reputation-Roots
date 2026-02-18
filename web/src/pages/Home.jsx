import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import './Home.css';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-image" />
        <div className="skeleton-body">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
            <div className="skeleton-line price" />
        </div>
    </div>
);

const Home = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(keyword);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchProducts();
            // Only fetch favorites for logged-in non-admin users
            if (user && !user.isAdmin) await fetchFavorites();
            setLoading(false);
        };
        loadData();
    }, [page, searchQuery, user]);

    const fetchProducts = async () => {
        try {
            const { data } = await API.get(`/products?pageNumber=${page}&keyword=${searchQuery}`);
            setProducts(data.products || []);
            setPages(data.pages || 1);
            setTotal(data.count || 0);
        } catch (error) {
            console.error('Error fetching products', error);
            toast.error('Failed to load products');
        }
    };

    const fetchFavorites = async () => {
        try {
            const { data } = await API.get('/products/favorites');
            setFavorites(data.filter(item => item != null).map(fav => fav._id));
        } catch (error) {
            console.error('Error fetching favorites', error);
        }
    };

    const handleToggleFavorite = async (productId) => {
        if (!user) {
            toast.error('Please login to save favorites');
            return;
        }
        try {
            if (favorites.includes(productId)) {
                await API.delete(`/products/${productId}/favorite`);
                setFavorites(favorites.filter(id => id !== productId));
                toast.success('Removed from favorites');
            } else {
                await API.post(`/products/${productId}/favorite`);
                setFavorites([...favorites, productId]);
                toast.success('Added to favorites ♥');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update favorites');
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setSearchQuery(keyword);
        setPage(1);
    };

    return (
        <div className="home-page">
            <div className="container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-badge">
                        <span className="hero-badge-dot" />
                        Premium Tech Marketplace
                    </div>
                    <h1 className="hero-title">
                        Find Your Next<br />
                        <span className="gradient-text">Favorite Gadget</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover curated tech products and accessories at unbeatable prices. Quality guaranteed.
                    </p>

                    <div className="search-wrapper">
                        <form className="search-bar" onSubmit={handleSearch}>
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Search products, brands, categories..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <button type="submit" className="btn-primary">Search</button>
                        </form>
                    </div>

                    {/* Stats row — uses real data once loaded */}
                    <div className="stats-row">
                        <div className="stat-item">
                            <div className="stat-value">{loading ? '—' : `${total}`}</div>
                            <div className="stat-label">Products</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{pages}</div>
                            <div className="stat-label">Pages</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">Free</div>
                            <div className="stat-label">Shipping</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">24/7</div>
                            <div className="stat-label">Support</div>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">
                                {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                            </h2>
                            {!loading && (
                                <p className="section-subtitle">
                                    {total > 0 ? `${total} product${total !== 1 ? 's' : ''} available` : 'No products found'}
                                </p>
                            )}
                        </div>
                        {!loading && total > 0 && (
                            <span className="results-count">Page {page} of {pages}</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="skeleton-grid">
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="product-grid">
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <Package size={32} />
                                </div>
                                <h3>No products found</h3>
                                <p>Try adjusting your search or browse all products</p>
                            </div>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product, i) => (
                                <div key={product._id} style={{ animationDelay: `${i * 0.05}s` }}>
                                    <ProductCard
                                        product={product}
                                        isFavorite={favorites.includes(product._id)}
                                        onToggleFavorite={handleToggleFavorite}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {pages > 1 && (
                        <div className="pagination">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="pg-btn"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {[...Array(pages).keys()].map(x => (
                                <button
                                    key={x + 1}
                                    className={`pg-num ${page === x + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(x + 1)}
                                >
                                    {x + 1}
                                </button>
                            ))}
                            <button
                                disabled={page === pages}
                                onClick={() => setPage(page + 1)}
                                className="pg-btn"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
