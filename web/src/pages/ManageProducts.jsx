import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import './ManageProducts.css';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/products?pageSize=100');
            setProducts(data.products || []);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load products');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (loading) return (
        <div className="container loading-state">
            <div className="loading-spinner" />
            <p>Loading inventory...</p>
        </div>
    );

    const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0);

    return (
        <div className="container manage-products-page">
            <div className="manage-header">
                <div className="manage-header-text">
                    <h1>Inventory Management</h1>
                    <p>Add, edit, or remove products from the marketplace</p>
                </div>
                <button
                    className="btn-primary add-btn"
                    onClick={() => navigate('/admin/products/add')}
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Stats */}
            <div className="manage-stats">
                <div className="manage-stat">
                    <div className="manage-stat-value">{products.length}</div>
                    <div className="manage-stat-label">Total Products</div>
                </div>
                <div className="manage-stat">
                    <div className="manage-stat-value">${totalValue.toFixed(0)}</div>
                    <div className="manage-stat-label">Total Value</div>
                </div>
                <div className="manage-stat">
                    <div className="manage-stat-value">
                        ${products.length > 0 ? (totalValue / products.length).toFixed(2) : '0'}
                    </div>
                    <div className="manage-stat-label">Avg. Price</div>
                </div>
            </div>

            <div className="products-table-container">
                {products.length === 0 ? (
                    <div className="empty-manage">
                        <div className="empty-manage-icon">
                            <Package size={32} />
                        </div>
                        <h3>No products yet</h3>
                        <p>Start by adding your first product to the marketplace.</p>
                    </div>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="fade-in">
                                    <td>
                                        <div className="product-cell">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100';
                                                }}
                                            />
                                            <div className="product-cell-info">
                                                <span className="title">{product.title}</span>
                                                <span className="id">ID: {product._id.substring(0, 10)}…</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">
                                            {product.category || 'Tech'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="price-tag">${Number(product.price).toFixed(2)}</span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button
                                                className="icon-btn edit"
                                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                title="Edit Product"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="icon-btn delete"
                                                onClick={() => handleDelete(product._id)}
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;
