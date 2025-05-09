import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { fetchQRData } from '../utils/api';
export const QRLogin = () => {
    const [qrData, setQrData] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetchQRData();
                console.log("API Response:", response);

                if (response && response.success && response.data.qrData) {
                    // Directly set the qrData if it's already a base64 string
                    setQrData(`data:image/png;base64,${response.data.qrData}`);
                } else {
                    setError("Invalid API response structure");
                    console.error("Invalid API response structure");
                }
            } catch (error) {
                setError(error.message);
                console.log("Error fetching QR:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh QR code every 4 minutes (since token expires in 5 minutes)
        const refreshInterval = setInterval(fetchData, 4 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quét mã QR để đăng nhập</Text>

            {loading && (
                <ActivityIndicator size="large" color="#0000ff" />
            )}

            {error && (
                <Text style={styles.error}>Lỗi: {error}</Text>
            )}

            {qrData && !loading && (
                <View style={styles.qrContainer}>
                    <Image
                        source={{ uri: qrData }}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    qrContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrImage: {
        width: 200,
        height: 200,
    },
    error: {
        color: 'red',
        marginTop: 10,
    }
});