import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const { data } = await API.get('/products/favorites');
            setFavorites(data.filter(item => item !== null));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favorites', error);
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            await API.delete(`/products/${productId}/favorite`);
            setFavorites(favorites.filter(fav => fav._id !== productId));
            toast.success('Removed from favorites');
        } catch (error) {
            toast.error('Failed to remove favorite');
        }
    };

    if (loading) return (
        <div className="container loading-state">
            <div className="loading-spinner" />
            <p>Loading favorites...</p>
        </div>
    );

    return (
        <div className="container favorites-page">
            <div className="favorites-header fade-in">
                <div className="favorites-icon-wrap">
                    <Heart size={24} fill="currentColor" />
                </div>
                <div className="favorites-header-text">
                    <h1>My Favorites</h1>
                    <p>
                        {favorites.length > 0
                            ? `${favorites.length} item${favorites.length !== 1 ? 's' : ''} saved to your list`
                            : 'Your favorites list is empty'}
                    </p>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="favorites-empty fade-in">
                    <div className="favorites-empty-icon">
                        <Heart size={36} />
                    </div>
                    <h3>No favorites yet</h3>
                    <p>Browse products and tap the heart icon to save your favorites here.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {favorites.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            isFavorite={true}
                            onToggleFavorite={handleRemoveFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
