import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {APP_COLOR} from '../../utils/constant';

import {useNavigation, useRoute} from '@react-navigation/native';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../utils/type.navigate';
import {getDegreeByUserId, getUserById} from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.PRIMARY,
  },
  card: {
    backgroundColor: '#D3D3D3',
    height: 700,
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 28,
    borderRadius: 20,
    // alignItems: "center",
    // elevation: 5, // Bóng đổ giúp card nổi bật
  },
  text: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Poppins',
    color: APP_COLOR.PRIMARY,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 100, // Đặt gần đáy
    left: 40,
    right: 40,
    zIndex: 2,
  },
  button: {
    backgroundColor: APP_COLOR.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 10,
    width: 150,
  },
  buttonText: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Nút quay lại
  backButton: {
    position: 'absolute',
    top: 20, // Đặt gần đầu màn hình
    left: 20,
    flexDirection: 'row',
    // alignItems: 'center',
    padding: 10,
    zIndex: 3,
  },
  resetButton: {
    position: 'absolute',
    top: 20, // Đặt gần đầu màn hình
    right: 10,
    flexDirection: 'row',
    // alignItems: 'center',
    padding: 10,
    zIndex: 3,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    resizeMode: 'contain',
    tintColor: '#ffffff', // Đảm bảo màu sắc của icon
  },
  backText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cardContainer: {
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
  scrollContainer: {
    paddingBottom: 20,
    margin: 20,
  },
});

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'ListCertificationPersonal'
>;

const ListCertificationPersonal = () => {
  const route = useRoute();
  const {id,dob,commonName} = route.params;
  const navigation = useNavigation<NavigationProps>();

  const [user, setUser] = useState({});
  const [degrees, setDegrees] = useState<[]>([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserById(id);
      if (res.success) {
        setUser(res.users);
      }
    };

    const fetchDegree = async () => {
      const res = await getDegreeByUserId(id);
      if (res.success) {
        setDegrees(res.degrees);
      }
    };

    fetchDegree();
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem('role');
      setRole(role || '');
    };

    fetchRole();
  }, []);

  // const handleResetPassword = () => {
  //     Alert.alert(
  //         "Xác nhận",
  //         "Bạn có chắc chắn muốn cấp lại mật khẩu?",
  //         [
  //             {
  //                 text: "Hủy",
  //                 style: "cancel"
  //             },
  //             {
  //                 text: "Xác nhận",
  //                 onPress: async () => {
  //                     console.log('Cấp lại mật khẩu');
  //                     const res = await resetPassword(user.common_name, user.username, user.citizen_id);
  //                     if (res.success) {
  //                         Alert.alert("Thông báo", "Cấp lại mật khẩu thành công");
  //                     } else {
  //                         Alert.alert("Lỗi", "Cấp lại mật khẩu thất bại");
  //                     }
  //                 }
  //             }
  //         ]
  //     );
  // };

  return (
    <View style={styles.container}>
      {/* Hai lớp màu nền */}
      <View
        style={{
          backgroundColor: APP_COLOR.PRIMARY,
          height: '30%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../../../assets/icon/arrow-left.png')}
            style={styles.backIcon}
          />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>

        {role === 'manager' && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.navigate('AddDegree1', {id,dob,commonName})}>
            <Text style={styles.backText}>Thêm bằng cấp</Text>
            <Image
              source={require('../../../assets/icon/arrow-right.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={{backgroundColor: '#ffffff', height: '70%'}} />

      {/* Card hiển thị thông tin */}
      <View style={styles.card}>
        <Text style={styles.text}>{user.common_name}</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {
            // @ts-ignore
            degrees.map(degree => (
              <TouchableOpacity
                // onPress={() => navigation.navigate('ConfirmCertification')}
                key={degree.id}
                style={styles.cardContainer}>
                <Text style={styles.cardTitle}>{degree.degree_name}</Text>
                <Text style={styles.cardText}>
                  Tên danh tính: {degree.common_name}
                </Text>
                <Text style={styles.cardText}>
                  Thời gian: {degree.issued_at}
                </Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </View>
  );
};

export default ListCertificationPersonal;
