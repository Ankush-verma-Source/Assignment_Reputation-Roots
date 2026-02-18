import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register(username.trim(), password);
        } catch (err) {
            Alert.alert('Registration Failed', err.response?.data?.message || 'Could not create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoWrap}>
                        <Ionicons name="person-add" size={32} color={COLORS.primaryLight} />
                    </View>
                    <Text style={styles.appName}>Create Account</Text>
                    <Text style={styles.tagline}>Join MicroMarket today</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Get Started</Text>
                    <Text style={styles.subtitle}>Create your free account</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.inputWrap}>
                            <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Pick a unique username"
                                placeholderTextColor={COLORS.textSubtle}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrap}>
                            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Min. 6 characters"
                                placeholderTextColor={COLORS.textSubtle}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.btnText}>Create Account</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkRow}>
                        <Text style={styles.linkText}>Already have an account? </Text>
                        <Text style={styles.link}>Sign in →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 32 },
    logoWrap: {
        width: 72, height: 72, borderRadius: RADIUS.lg,
        backgroundColor: 'rgba(124,58,237,0.15)',
        borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    appName: { fontSize: 28, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
    tagline: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
    card: {
        backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
        padding: 28, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.md,
    },
    title: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, marginBottom: 8 },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.md,
        borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: COLORS.text, fontSize: 15, paddingVertical: 14 },
    btn: {
        backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
        paddingVertical: 16, alignItems: 'center', marginTop: 8, ...SHADOW.sm,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    linkText: { color: COLORS.textMuted, fontSize: 14 },
    link: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '600' },
});
