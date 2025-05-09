import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../utils/type.navigate';
import ShareButton from '../../components/ShareButton';
import {getAllDegrees} from '../../utils/api';
import {APP_COLOR} from '../../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
type NavigationProps = StackNavigationProp<RootStackParamList, 'ListRequests'>;

const status_list = [
  {
    id: 1,
    title: 'Tạo mới',
    value: 'new',
  },
  {
    id: 2,
    title: 'Đang đợi duyệt',
    value: 'pending',
  },
  {
    id: 3,
    title: 'Đã duyệt',
    value: 'valid',
  },
  {
    id: 4,
    title: 'Đã từ chối',
    value: 'revoked',
  },
];

export default function ListRequestsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [data, setData] = useState<[]>([]);
  const [status, setStatus] = useState('new');
  const [statusActive, setStatusActive] = useState(1);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchDegrees = async () => {
      const result = await getAllDegrees({status});
      console.log('check result >>>>>', result);
      if (result?.success === true) {
        setData(result?.data?.degrees);
      } else {
        console.log('Không fetch được degrees');
      }
      console.log('check data >>>>>', data);
    };

    fetchDegrees();
  }, [status]);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem('role');
      setRole(role || '');
    };

    fetchRole();
  }, []);

  return (
    <View style={styles.container}>
      {/* Thanh chọn */}
      <View style={styles.filterContainer}>
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
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.containerCalendar}>
            <Image
              source={require('../../../assets/icon/calendar.png')}
              style={styles.calendarIcon}
            />
            {/* <Image
              source={require('../../assets/icon/arrow-down.png')}
              style={styles.arrowDownIcon}
            /> */}

            <View style={styles.arrowDownIcon} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          margin: 20,
          gap: 2,
          justifyContent: 'space-between',
        }}>
        {status_list.map((item, index) => {
          return (
            <ShareButton
              // btnStyles={
              //   statusActive === item.id
              //     ? `backgroundColor: ${APP_COLOR.PRIMARY}`
              //     : `#d3d3d3`
              // }
              key={index}
              btnStyles={
                statusActive === item.id
                  ? {backgroundColor: APP_COLOR.PRIMARY}
                  : {backgroundColor: '#d3d3d3'}
              }
              name={item.title}
              onPress={() => (setStatus(item.value), setStatusActive(item.id))}
            />
          );
        })}
      </View>

      {/* Danh sách bằng cấp */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {(data || []).map(degree => (
          <TouchableOpacity
            onPress={() => {
              if (role === 'manager') {
                navigation.navigate('ConfirmCertification', {id: degree?.id});
              }
            }}
            key={degree.id}
            style={styles.card}>
            <Text style={styles.cardTitle}>{degree.degree_name}</Text>
            <Text style={styles.cardText}>
              Tên danh tính: {degree.owner_name}
            </Text>
            <Text style={styles.cardText}>Tên ngành: {degree.major_name}</Text>
            <Text style={styles.cardText}>Thời gian: {degree.issued_at}</Text>
            <Text style={styles.cardText}>GPA: {degree.gpa}</Text>

            <Text style={styles.cardText}>Trạng thái: {degree.status}</Text>
          </TouchableOpacity>
        ))}

        {/* {Array(4)
          .fill(0)
          .map((_, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ConfirmCertification')}
              key={index}
              style={styles.card}>
              <Text style={styles.cardTitle}>Bằng kỹ sư</Text>
              <Text style={styles.cardText}>Tên danh tính: Đặng Ngọc Tài</Text>
              <Text style={styles.cardText}>Thời gian: 12/10/2025</Text>
            </TouchableOpacity>
          ))} */}
      </ScrollView>
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
    backgroundColor: '#D3D3D3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    height: 138,
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
    margin: 20,
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
