import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]);
    };

    const menuItems = [
        { icon: 'heart-outline', label: 'My Favorites', onPress: () => navigation.navigate('FavoritesTab'), show: !user?.isAdmin },
        { icon: 'cube-outline', label: 'Browse Products', onPress: () => navigation.navigate('ShopTab') },
        { icon: 'information-circle-outline', label: 'App Version', value: '1.0.0', onPress: null },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.username?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.username}>{user?.username}</Text>
                {user?.isAdmin && (
                    <View style={styles.adminBadge}>
                        <Ionicons name="shield-checkmark" size={12} color={COLORS.primaryLight} />
                        <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                )}
                <Text style={styles.memberSince}>Member of MicroMarket</Text>
            </View>

            {/* Menu */}
            <View style={styles.menuCard}>
                {menuItems.filter(m => m.show !== false).map((item, idx) => (
                    <TouchableOpacity
                        key={item.label}
                        style={[styles.menuItem, idx < menuItems.filter(m => m.show !== false).length - 1 && styles.menuItemBorder]}
                        onPress={item.onPress}
                        disabled={!item.onPress}
                        activeOpacity={item.onPress ? 0.7 : 1}
                    >
                        <View style={styles.menuIcon}>
                            <Ionicons name={item.icon} size={18} color={COLORS.primaryLight} />
                        </View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        {item.value
                            ? <Text style={styles.menuValue}>{item.value}</Text>
                            : item.onPress ? <Ionicons name="chevron-forward" size={16} color={COLORS.textSubtle} /> : null
                        }
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    content: { padding: 24, paddingBottom: 48 },
    avatarSection: { alignItems: 'center', marginBottom: 32, paddingTop: 16 },
    avatar: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: 'rgba(124,58,237,0.2)',
        borderWidth: 2, borderColor: COLORS.primaryLight,
        alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    avatarText: { fontSize: 36, fontWeight: '800', color: COLORS.primaryLight },
    username: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
    adminBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(124,58,237,0.15)', borderRadius: RADIUS.full,
        paddingHorizontal: 10, paddingVertical: 4,
        borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', marginBottom: 8,
    },
    adminBadgeText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '700' },
    memberSince: { fontSize: 13, color: COLORS.textMuted },
    menuCard: {
        backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
        borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, ...SHADOW.sm,
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
    menuIcon: {
        width: 36, height: 36, borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(124,58,237,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    menuLabel: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
    menuValue: { fontSize: 14, color: COLORS.textMuted },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: 'rgba(244,63,94,0.08)',
        borderRadius: RADIUS.md, paddingVertical: 16,
        borderWidth: 1, borderColor: 'rgba(244,63,94,0.2)',
    },
    logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
});
