import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';

export default function ListRequestsRejectedScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: "#D3D3D3", height: 169, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 24, fontWeight: 700 }}>Danh sách bằng cấp bị từ chối</Text>
            </View>
            <View style={{ padding: 20 }}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack() }}>
                        <Image
                            source={require('../../../assets/icon/arrow-left.png')}
                            style={styles.backIcon}
                        />
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.containerCalendar}>
                            <Image
                                source={require('../../../assets/icon/calendar.png')}
                                style={styles.calendarIcon}
                            />


                            <View style={styles.arrowDownIcon} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Danh sách bằng cấp */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.cardTitle}>Tên bằng cấp</Text>
                                <Text style={styles.cardText}>Thời gian :</Text>
                                <Text style={styles.cardText}>Người truy vấn:</Text>
                                <Text style={styles.cardText}>Lý do:</Text>
                            </View>
                        ))}
                </ScrollView>

                {/* Nút quay lại */}

            </View>

            {/* Thanh chọn */}

        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Thanh chọn
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: '#3B5998',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    filterText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    containerCalendar: {
        width: 100,
        height: 50,
        backgroundColor: '#d3d8e6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10, // Để tránh sát mép
    },

    calendarIcon: {
        width: 30,
        height: 30,
    },

    arrowDownIcon: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#3a5999', // Màu của mũi tên
        marginLeft: 8, // Tạo khoảng cách với icon lịch
    },

    // Danh sách thẻ
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#3B5998',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    cardText: {
        fontSize: 17,
        color: '#fff',
        fontWeight: 'bold',
        paddingVertical: 7,
    },

    // Nút quay lại
    backButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    backIcon: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    backText: {
        fontSize: 22,
        color: '#3B5998',
        fontWeight: 'bold',
    },
});
