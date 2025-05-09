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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllDegreesNoStatus} from '../../utils/api';
type NavigationProps = StackNavigationProp<RootStackParamList, 'HistoryQuery'>;

export default function HistoryQuery() {
  const navigation = useNavigation<NavigationProps>();
  const [data, setData] = useState<[]>([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchDegrees = async () => {
      const result = await getAllDegreesNoStatus();
      console.log('check result >>>>>', result);
      if (result?.success === true) {
        setData(result?.data?.degrees);
      } else {
        console.log('Không fetch được degrees');
      }
      console.log('check data >>>>>', data);
    };

    fetchDegrees();
  }, []);

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

      {/* Danh sách bằng cấp */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {(data || [])
          .sort((a, b) => {
            // Sort by query_time in descending order (newest first)
            const dateA = new Date(a.query_time || 0);
            const dateB = new Date(b.query_time || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .map(degree => (
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
                Thời gian: {degree.query_time}
              </Text>
            </TouchableOpacity>
          ))}
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
