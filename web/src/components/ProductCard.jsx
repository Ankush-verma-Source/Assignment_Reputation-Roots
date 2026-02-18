import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
    return (
        <div className="product-card fade-in">
            <div className="card-image">
                <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
                    }}
                />
                <div className="card-image-overlay" />
                {product.category && (
                    <span className="card-category-tag">{product.category}</span>
                )}
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(product._id);
                    }}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>
            <Link to={`/product/${product._id}`} className="card-info">
                <h3>{product.title}</h3>
                <p className="card-description">
                    {product.description && product.description.length > 90
                        ? product.description.substring(0, 90) + '...'
                        : product.description}
                </p>
                <div className="card-footer">
                    <span className="price">${Number(product.price).toFixed(2)}</span>
                    <span className="view-btn">View Details →</span>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
