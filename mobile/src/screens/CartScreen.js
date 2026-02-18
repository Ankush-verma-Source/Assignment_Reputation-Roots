import React from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
    StyleSheet, Alert, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { COLORS, RADIUS, SHADOW } from '../theme/colors';

export default function CartScreen({ navigation }) {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

    const handleCheckout = () => {
        Alert.alert('Order Placed', 'Your order has been placed successfully! 🎉', [
            {
                text: 'OK', onPress: () => {
                    clearCart();
                    navigation.navigate('ShopTab');
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item._id, item.quantity - 1)}
                        style={styles.qtyBtn}
                    >
                        <Ionicons name="remove" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item._id, item.quantity + 1)}
                        style={styles.qtyBtn}
                    >
                        <Ionicons name="add" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
        </View>
    );

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="cart-outline" size={60} color={COLORS.textSubtle} />
                </View>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
                <TouchableOpacity
                    style={styles.browseBtn}
                    onPress={() => navigation.navigate('ShopTab')}
                >
                    <Text style={styles.browseBtnText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                ListFooterComponent={
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal ({cartCount} items)</Text>
                            <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.success }]}>Free</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    list: { padding: 16, paddingBottom: 40 },
    cartItem: {
        flexDirection: 'row', backgroundColor: COLORS.bgCard,
        borderRadius: RADIUS.md, padding: 12, marginBottom: 12,
        borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
    },
    itemImage: { width: 70, height: 70, borderRadius: RADIUS.sm, resizeMode: 'cover' },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    itemPrice: { fontSize: 14, fontWeight: '600', color: COLORS.primaryLight, marginBottom: 8 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    qtyBtn: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: COLORS.border,
    },
    qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 20, textAlign: 'center' },
    removeBtn: { padding: 8 },
    summaryCard: {
        backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
        padding: 20, marginTop: 12, borderWidth: 1, borderColor: COLORS.border,
        ...SHADOW.sm,
    },
    summaryTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { fontSize: 14, color: COLORS.textMuted },
    summaryValue: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
    totalLabel: { fontSize: 18, fontWeight: '800', color: COLORS.text },
    totalValue: { fontSize: 20, fontWeight: '800', color: COLORS.primaryLight },
    checkoutBtn: {
        backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
        paddingVertical: 16, alignItems: 'center', marginTop: 20, ...SHADOW.sm,
    },
    checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: COLORS.bg },
    emptyIcon: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    },
    emptyTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
    emptySubtitle: { fontSize: 15, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    browseBtn: {
        backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
        paddingHorizontal: 32, paddingVertical: 14, ...SHADOW.sm,
    },
    browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
