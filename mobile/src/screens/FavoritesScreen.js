import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
    StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    // Triggered when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user) fetchFavorites();
        }, [user])
    );

    const fetchFavorites = async () => {
        try {
            const { data } = await API.get('/products/favorites');
            setFavorites(data.filter(f => f != null));
        } catch (e) {
            console.error('Fetch favorites error', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRemove = async (productId) => {
        Alert.alert('Remove Favorite', 'Remove this product from your favorites?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove', style: 'destructive',
                onPress: async () => {
                    try {
                        await API.delete(`/products/${productId}/favorite`);
                        setFavorites(prev => prev.filter(f => f._id !== productId));
                    } catch (e) {
                        Alert.alert('Error', 'Failed to remove favorite.');
                    }
                },
            },
        ]);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFavorites();
    }, [user]);

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading favorites...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Ionicons name="heart" size={24} color={COLORS.danger} />
                        <Text style={styles.headerTitle}>My Favorites</Text>
                        <Text style={styles.headerCount}>{favorites.length} saved item{favorites.length !== 1 ? 's' : ''}</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="heart-outline" size={48} color={COLORS.textSubtle} />
                        </View>
                        <Text style={styles.emptyTitle}>No favorites yet</Text>
                        <Text style={styles.emptyText}>Tap the heart on any product to save it here.</Text>
                        <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('ShopTab')}>
                            <Text style={styles.browseBtnText}>Browse Products</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('ProductDetail', { product: item, isFavorite: true })}
                        activeOpacity={0.85}
                    >
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.cardBody}>
                            {item.category ? (
                                <Text style={styles.category}>{item.category}</Text>
                            ) : null}
                            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.removeBtn}
                            onPress={() => handleRemove(item._id)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="heart-dislike-outline" size={20} color={COLORS.danger} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { color: COLORS.textMuted, fontSize: 14 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, flex: 1 },
    headerCount: { fontSize: 13, color: COLORS.textMuted },
    card: {
        flexDirection: 'row', backgroundColor: COLORS.bgCard,
        borderRadius: RADIUS.lg, marginBottom: 12,
        borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', ...SHADOW.sm,
    },
    image: { width: 90, height: 90, resizeMode: 'cover' },
    cardBody: { flex: 1, padding: 12, justifyContent: 'center' },
    category: { fontSize: 11, color: COLORS.primaryLight, fontWeight: '600', marginBottom: 4 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
    price: { fontSize: 16, fontWeight: '800', color: COLORS.primaryLight },
    removeBtn: { padding: 16, justifyContent: 'center' },
    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyIcon: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center',
    },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
    emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: 32 },
    browseBtn: {
        backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
        paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
    },
    browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
