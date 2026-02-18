import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, RefreshControl, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../theme/colors';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.imageWrap}>
            <Image
                source={{ uri: product.image }}
                style={styles.image}
            />
            {product.category ? (
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                </View>
            ) : null}
            <TouchableOpacity
                style={[styles.favBtn, isFavorite && styles.favBtnActive]}
                onPress={() => onToggleFavorite(product._id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFavorite ? COLORS.danger : '#fff'}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2}>{product.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{product.description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
                <Text style={styles.viewMore}>View →</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    // Triggered when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user && !user.isAdmin) fetchFavorites();
        }, [user])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(keyword);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    useEffect(() => {
        fetchProducts();
    }, [page, searchQuery]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/products?pageNumber=${page}&keyword=${searchQuery}`);
            setProducts(data.products || []);
            setPages(data.pages || 1);
            setTotal(data.count || 0);
        } catch (e) {
            console.error('Fetch products error', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const { data } = await API.get('/products/favorites');
            setFavorites(data.filter(f => f != null).map(f => f._id));
        } catch (e) {
            console.error('Fetch favorites error', e);
        }
    };

    const handleToggleFavorite = async (productId) => {
        if (!user) {
            navigation.navigate('Login');
            return;
        }
        try {
            if (favorites.includes(productId)) {
                await API.delete(`/products/${productId}/favorite`);
                setFavorites(prev => prev.filter(id => id !== productId));
            } else {
                await API.post(`/products/${productId}/favorite`);
                setFavorites(prev => [...prev, productId]);
            }
        } catch (e) {
            console.error('Toggle favorite error', e);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        fetchProducts();
        if (user && !user.isAdmin) fetchFavorites();
    }, [user]);

    const renderHeader = React.useMemo(() => {
        return (
            <View>
                <View style={styles.hero}>
                    <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>✦ Premium Tech Marketplace</Text>
                    </View>
                    <Text style={styles.heroTitle}>Find Your Next{'\n'}
                        <Text style={styles.heroAccent}>Favorite Gadget</Text>
                    </Text>
                    <Text style={styles.heroSub}>Curated tech at unbeatable prices.</Text>
                </View>

                <View style={styles.searchWrap}>
                    <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor={COLORS.textSubtle}
                        value={keyword}
                        onChangeText={setKeyword}
                    />
                    {keyword.length > 0 && (
                        <TouchableOpacity onPress={() => setKeyword('')}>
                            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statsRow}>
                    {[
                        { val: loading ? '—' : String(total), label: 'Products' },
                        { val: String(pages), label: 'Pages' },
                        { val: 'Free', label: 'Shipping' },
                        { val: '24/7', label: 'Support' },
                    ].map(s => (
                        <View key={s.label} style={styles.statItem}>
                            <Text style={styles.statVal}>{s.val}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {searchQuery ? `"${searchQuery}"` : 'All Products'}
                    </Text>
                    {!loading && <Text style={styles.sectionCount}>{total} items</Text>}
                </View>
            </View>
        );
    }, [keyword, searchQuery, loading, total, pages]);

    const renderFooter = () => (
        pages > 1 ? (
            <View style={styles.pagination}>
                <TouchableOpacity
                    style={[styles.pgBtn, page === 1 && styles.pgBtnDisabled]}
                    onPress={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    <Ionicons name="chevron-back" size={18} color={page === 1 ? COLORS.textSubtle : COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.pgText}>Page {page} of {pages}</Text>
                <TouchableOpacity
                    style={[styles.pgBtn, page === pages && styles.pgBtnDisabled]}
                    onPress={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                >
                    <Ionicons name="chevron-forward" size={18} color={page === pages ? COLORS.textSubtle : COLORS.text} />
                </TouchableOpacity>
            </View>
        ) : null
    );

    return (
        <View style={styles.container}>
            {loading && products.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading products...</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            isFavorite={favorites.includes(item._id)}
                            onToggleFavorite={handleToggleFavorite}
                            onPress={() => navigation.navigate('ProductDetail', {
                                product: item,
                                isFavorite: favorites.includes(item._id)
                            })}
                        />
                    )}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="cube-outline" size={48} color={COLORS.textSubtle} />
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { color: COLORS.textMuted, fontSize: 14 },

    // Hero
    hero: { marginBottom: 20, paddingTop: 8 },
    heroBadge: {
        alignSelf: 'flex-start', backgroundColor: 'rgba(124,58,237,0.15)',
        borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 5,
        borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', marginBottom: 12,
    },
    heroBadgeText: { color: COLORS.primaryLight, fontSize: 11, fontWeight: '600' },
    heroTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, lineHeight: 36, marginBottom: 8 },
    heroAccent: { color: COLORS.primaryLight },
    heroSub: { fontSize: 14, color: COLORS.textMuted },

    // Search
    searchWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.md,
        borderWidth: 1, borderColor: COLORS.border,
        paddingHorizontal: 14, marginBottom: 16,
    },
    searchInput: { flex: 1, color: COLORS.text, fontSize: 15, paddingVertical: 12 },

    // Stats
    statsRow: { flexDirection: 'row', marginBottom: 20 },
    statItem: { flex: 1, alignItems: 'center' },
    statVal: { fontSize: 16, fontWeight: '700', color: COLORS.primaryLight },
    statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

    // Section
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
    sectionCount: { fontSize: 13, color: COLORS.textMuted },

    // Card
    card: {
        backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
        marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm, overflow: 'hidden',
    },
    imageWrap: { position: 'relative', height: 180 },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    categoryBadge: {
        position: 'absolute', top: 10, left: 10,
        backgroundColor: 'rgba(124,58,237,0.85)', borderRadius: RADIUS.full,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    categoryText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    favBtn: {
        position: 'absolute', top: 10, right: 10,
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    },
    favBtnActive: { backgroundColor: 'rgba(244,63,94,0.2)' },
    cardBody: { padding: 14 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
    cardDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 18, marginBottom: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 18, fontWeight: '800', color: COLORS.primaryLight },
    viewMore: { fontSize: 13, color: COLORS.accent, fontWeight: '600' },

    // Pagination
    pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 },
    pgBtn: {
        width: 40, height: 40, borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgElevated, borderWidth: 1, borderColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    pgBtnDisabled: { opacity: 0.4 },
    pgText: { color: COLORS.textMuted, fontSize: 14 },

    // Empty
    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { color: COLORS.textMuted, fontSize: 16 },
});
