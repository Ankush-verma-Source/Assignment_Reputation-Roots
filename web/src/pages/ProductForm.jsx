import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Image as ImageIcon, DollarSign } from 'lucide-react';
import './ProductForm.css';

const ProductForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
        category: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (isEdit) fetchProduct();
    }, [id, user]);

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/${id}`);
            setFormData({
                title: data.title,
                price: data.price,
                description: data.description,
                image: data.image,
                category: data.category || '',
            });
        } catch (error) {
            toast.error('Failed to load product details');
            navigate('/admin/products');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await API.put(`/products/${id}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await API.post('/products', formData);
                toast.success('Product created successfully!');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container product-form-page">
            <button onClick={() => navigate('/admin/products')} className="back-btn">
                <ArrowLeft size={16} />
                Back to Inventory
            </button>

            <div className="form-card fade-in">
                <div className="form-header">
                    <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
                    <p>
                        {isEdit
                            ? 'Update the product details below'
                            : 'Fill in the details to list a new product on the marketplace'}
                    </p>
                </div>

                <div className="form-layout">
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-group">
                            <label htmlFor="title">Product Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Sony WH-1000XM5 Headphones"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price (USD)</label>
                                <div className="input-with-icon">
                                    <DollarSign size={16} className="input-icon" />
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Audio, Phones, Laptops"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Image URL</label>
                            <div className="input-with-icon">
                                <ImageIcon size={16} className="input-icon" />
                                <input
                                    type="url"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Describe the product features, specifications, and condition..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary submit-btn"
                            disabled={loading}
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                        </button>
                    </form>

                    <div className="form-preview">
                        <h3>Live Preview</h3>
                        <div className="preview-card">
                            <div className="preview-img">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800';
                                        }}
                                    />
                                ) : (
                                    <div className="placeholder">
                                        <ImageIcon size={36} />
                                        <span>Image preview</span>
                                    </div>
                                )}
                            </div>
                            <div className="preview-info">
                                <span className="p-title">{formData.title || 'Product Title'}</span>
                                <span className="p-price">
                                    ${formData.price ? Number(formData.price).toFixed(2) : '0.00'}
                                </span>
                                <p className="p-desc">
                                    {formData.description
                                        ? formData.description.substring(0, 120) + (formData.description.length > 120 ? '...' : '')
                                        : 'Product description will appear here...'}
                                </p>
                            </div>
                        </div>
                        <p className="preview-hint">Updates as you type</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
