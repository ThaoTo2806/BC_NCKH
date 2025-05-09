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
import ShareInput from '../../components/ShareInput';

export default function RefreshPassword() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: "#D3D3D3", height: 200, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: 700 }}>Cấp lại</Text>
                        <Text style={{ fontSize: 24, fontWeight: 700, marginLeft: 30 }}> mật khẩu</Text>
                    </View>

                    <Image source={require('../../../assets/image/refreshpassword.png')} />
                </View>
                <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack() }}>
                    <Image
                        source={require('../../../assets/icon/arrow-left.png')}
                        style={styles.backIcon}
                    />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>


            </View>
            <View style={styles.content}>
                <View style={{ width: '100%', margin: 20 }}>
                    <ShareInput
                        title="Tìm theo tên danh tính"
                        onChangeText={() => console.log('User')}
                        onBlur={() => console.log('User')}
                        value={"User"}
                    />
                    <Image
                        source={require('../../../assets/icon/search.png')}
                        style={{ position: 'absolute', top: 15, right: 15 }}
                    />
                </View>

                <View style={styles.card}>
                    <View style={{ marginVertical: 5 }}>
                        <Text style={{ padding: 10, fontSize: 16, fontWeight: 600 }}>Tên danh tính</Text>
                        <ShareInput
                            title="Tên danh tính"
                            onChangeText={() => console.log('Tên danh tính')}
                            onBlur={() => console.log('Tên danh tính')}
                            value={'Tên danh tính'}
                            errors={'Tên danh tính'}
                        />
                    </View>
                    <View style={{ marginVertical: 5 }}>
                        <Text style={{ padding: 10, fontSize: 16, fontWeight: 600 }}>Mã số sinh viên</Text>
                        <ShareInput
                            title="MSSV"
                            onChangeText={() => console.log('MSSV')}
                            onBlur={() => console.log('MSSV')}
                            value={'MSSV'}
                            errors={'MSSV'}
                        />
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={{ padding: 10, fontSize: 16, fontWeight: 600 }}>Căn cước công dân</Text>
                        <ShareInput
                            title="CCCD"
                            onChangeText={() => console.log('CCCD')}
                            onBlur={() => console.log('CCCD')}
                            value={'CCCD'}
                            errors={'CCCD'}
                        />
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={{ padding: 10, fontSize: 16, fontWeight: 600 }}>Email</Text>
                        <ShareInput
                            title="Email"
                            onChangeText={() => console.log('Email')}
                            onBlur={() => console.log('Email')}
                            value={'Email'}
                            errors={'Email'}
                        />
                    </View>




                </View>

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
        backgroundColor: '#3a5999',
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
        backgroundColor: "#D3D3D3",
        height: 550,
        width: 347,
        padding: 28,
        borderRadius: 20,
        // alignItems: "center",
        // elevation: 5, // Bóng đổ giúp card nổi bật
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
        marginLeft: 20,
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
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
});
