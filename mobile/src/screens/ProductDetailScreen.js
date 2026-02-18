import React, { useState } from 'react';
import {
    View, Text, ScrollView, Image, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COLORS, RADIUS, SHADOW } from '../theme/colors';

export default function ProductDetailScreen({ route, navigation }) {
    const { product, isFavorite: initialFav } = route.params;
    const [isFavorite, setIsFavorite] = useState(initialFav || false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleToggleFavorite = async () => {
        if (!user) {
            Alert.alert('Sign In Required', 'Please sign in to save favorites.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign In', onPress: () => navigation.navigate('Auth') },
            ]);
            return;
        }
        setLoading(true);
        try {
            if (isFavorite) {
                await API.delete(`/products/${product._id}/favorite`);
                setIsFavorite(false);
            } else {
                await API.post(`/products/${product._id}/favorite`);
                setIsFavorite(true);
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to update favorites.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert('Success', 'Added to cart!', [{ text: 'View Cart', onPress: () => navigation.navigate('CartTab') }, { text: 'Continue' }]);
    };

    const trustPoints = [
        { icon: 'shield-checkmark-outline', title: '1 Year Warranty', sub: 'Full coverage' },
        { icon: 'car-outline', title: 'Free Delivery', sub: '2–5 business days' },
        { icon: 'refresh-outline', title: 'Easy Returns', sub: '30-day policy' },
        { icon: 'cube-outline', title: 'Secure Packaging', sub: 'Damage-free' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                    />
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                    <View style={styles.stockBadge}>
                        <Text style={styles.stockText}>✓ In Stock</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {product.category ? (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{product.category}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.title}>{product.title}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
                        <Text style={styles.freeShip}>Free shipping</Text>
                    </View>

                    {(!user || !user.isAdmin) && (
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.cartBtn}
                                onPress={handleAddToCart}
                            >
                                <Ionicons name="cart" size={20} color="#fff" />
                                <Text style={styles.cartBtnText}>Add to Cart</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.favBtn, isFavorite && styles.favBtnActive]}
                                onPress={handleToggleFavorite}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={isFavorite ? COLORS.danger : COLORS.primaryLight} />
                                ) : (
                                    <Ionicons
                                        name={isFavorite ? 'heart' : 'heart-outline'}
                                        size={22}
                                        color={isFavorite ? COLORS.danger : COLORS.primaryLight}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    <View style={styles.trustGrid}>
                        {trustPoints.map(tp => (
                            <View key={tp.title} style={styles.trustItem}>
                                <View style={styles.trustIcon}>
                                    <Ionicons name={tp.icon} size={18} color={COLORS.primaryLight} />
                                </View>
                                <Text style={styles.trustTitle}>{tp.title}</Text>
                                <Text style={styles.trustSub}>{tp.sub}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    imageContainer: { position: 'relative', height: 300 },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    backBtn: {
        position: 'absolute', top: 48, left: 16,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
    },
    stockBadge: {
        position: 'absolute', bottom: 16, right: 16,
        backgroundColor: 'rgba(16,185,129,0.85)', borderRadius: RADIUS.full,
        paddingHorizontal: 12, paddingVertical: 5,
    },
    stockText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    content: { padding: 20, paddingBottom: 40 },
    categoryBadge: {
        alignSelf: 'flex-start', backgroundColor: 'rgba(124,58,237,0.2)',
        borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 4,
        borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', marginBottom: 12,
    },
    categoryText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '600' },
    title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 12, lineHeight: 30 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    price: { fontSize: 28, fontWeight: '800', color: COLORS.primaryLight },
    freeShip: { fontSize: 13, color: COLORS.success, fontWeight: '600' },

    actions: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    cartBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
        paddingVertical: 16, ...SHADOW.sm,
    },
    cartBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    favBtn: {
        width: 56, height: 56, borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
    },
    favBtnActive: { borderColor: COLORS.danger, backgroundColor: 'rgba(244,63,94,0.05)' },

    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
    description: { fontSize: 15, color: COLORS.textMuted, lineHeight: 24 },
    trustGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    trustItem: {
        width: '47%', backgroundColor: COLORS.bgCard,
        borderRadius: RADIUS.md, padding: 14,
        borderWidth: 1, borderColor: COLORS.border, alignItems: 'flex-start',
    },
    trustIcon: {
        width: 36, height: 36, borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(124,58,237,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    trustTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
    trustSub: { fontSize: 11, color: COLORS.textMuted },
});
