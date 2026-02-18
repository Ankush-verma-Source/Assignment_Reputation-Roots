import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: COLORS.bgCard },
    headerTintColor: COLORS.text,
    headerTitleStyle: { fontWeight: '700', fontSize: 17 },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: COLORS.bg },
};

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'MicroMarket' }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
        </Stack.Navigator>
    );
}

function FavoritesStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ title: 'My Favorites' }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
        </Stack.Navigator>
    );
}

function CartStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Your Cart' }} />
        </Stack.Navigator>
    );
}

const CartBadge = ({ count }) => {
    if (count === 0) return null;
    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
    );
};

export default function AppNavigator() {
    const { user } = useAuth();
    const { cartCount } = useCart();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.bgCard,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 64,
                },
                tabBarActiveTintColor: COLORS.primaryLight,
                tabBarInactiveTintColor: COLORS.textSubtle,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'ShopTab') iconName = focused ? 'bag-handle' : 'bag-handle-outline';
                    else if (route.name === 'FavoritesTab') iconName = focused ? 'heart' : 'heart-outline';
                    else if (route.name === 'CartTab') iconName = focused ? 'cart' : 'cart-outline';
                    else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

                    return (
                        <View>
                            <Ionicons name={iconName} size={22} color={color} />
                            {route.name === 'CartTab' && <CartBadge count={cartCount} />}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="ShopTab" component={HomeStack} options={{ title: 'Shop' }} />

            {(!user || !user.isAdmin) && (
                <>
                    <Tab.Screen name="FavoritesTab" component={FavoritesStack} options={{ title: 'Favorites' }} />
                    <Tab.Screen name="CartTab" component={CartStack} options={{ title: 'Cart' }} />
                </>
            )}

            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerShown: true,
                    ...screenOptions
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute', top: -5, right: -10,
        backgroundColor: COLORS.danger, borderRadius: 10,
        minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 4, borderWidth: 1.5, borderColor: COLORS.bgCard,
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
