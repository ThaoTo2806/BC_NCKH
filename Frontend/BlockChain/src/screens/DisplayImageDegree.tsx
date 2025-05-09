import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDegreeById } from '../utils/api';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

const DisplayImageDegree = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const [imageFront, setImageFront] = useState('');
    const [imageBack, setImageBack] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getDegreeById(id);
                if (res?.success) {
                    const degreeData = res.degree;
                    setImageFront(
                        degreeData?.frontImage
                            ? `data:image/jpeg;base64,${degreeData.frontImage}`
                            : ''
                    );
                    setImageBack(
                        degreeData?.backImage
                            ? `data:image/jpeg;base64,${degreeData.backImage}`
                            : ''
                    );
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu bằng cấp:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <View style={styles.container}>
            <View style={styles.illustrationContainer}>
                <Image
                    source={require("../../assets/image/Logo_Huit.png")}
                    style={styles.illustration}
                />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                Thông tin bằng cấp
            </Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
            ) : (
                <LinearGradient
                    colors={['#1E3C72', '#2A5298']}
                    style={{
                        margin: 20,
                        borderRadius: 15,
                        paddingVertical: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View style={styles.statusContainer}>
                        <Image
                            source={require("../../assets/icon/check.png")}
                            style={styles.checkIcon}
                        />
                        <Text style={styles.statusText}>Đã xác thực</Text>
                    </View>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ width: width * 0.9 }}
                    >
                        {/* Mặt trước */}
                        <View style={{ width: width * 0.9, alignItems: 'center' , marginTop: 35}}>
                            {imageFront ? (
                                <Image source={{ uri: imageFront }} style={{ width: 250, height: 180 }} resizeMode="contain" />
                            ) : (
                                <Text style={{ color: 'white' }}>Không có ảnh mặt trước</Text>
                            )}
                            <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Mặt trước</Text>

                        </View>

                        {/* Mặt sau */}
                        <View style={{ width: width * 0.9, alignItems: 'center', marginTop: 35 }}>
                            {imageBack ? (
                                <Image source={{ uri: imageBack }} style={{ width: 250, height: 180 }} resizeMode="contain" />
                            ) : (
                                <Text style={{ color: 'white' }}>Không có ảnh mặt sau</Text>
                            )}
                            <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Mặt sau</Text>
                        </View>
                    </ScrollView>
                </LinearGradient>
            )}

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Verification")}
            >
                <Image
                    source={require("../../assets/icon/arrow-left.png")}
                    style={styles.backIcon}
                />
                <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    checkIcon: {
        width: 22,
        height: 22,
        marginRight: 8,
    },
    statusContainer: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#fff",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    statusText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    container: {
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 0,
        flex: 1,
        height: "100%",
    },
    illustrationContainer: {
        alignItems: "center",
    },
    illustration: {
        width: 500,
        height: 150,
        resizeMode: "contain",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    backIcon: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    backText: {
        fontSize: 22,
        color: "#3B5998",
        fontWeight: "bold",
    },
});
export default DisplayImageDegree;
