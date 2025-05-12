import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/type.navigate';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchDegree } from '../../utils/api';

interface DegreeProps {
  owner_name: string;
  major_name: string;
  degree_name: string;
  issued_at: string;
  status: string;
  gpa: number;
}

export default function ApproveHistoryScreen() {
  type NavigationProps = StackNavigationProp<RootStackParamList, 'Degree'>;
  const navigation = useNavigation<NavigationProps>();
  const [selectedTab, setSelectedTab] = useState('Đã duyệt');
  const [degreeList, setDegreeList] = useState<DegreeProps[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const statusMap: Record<string, string> = {
    'Đã duyệt': 'valid',
    'Chưa duyệt': 'pending',
    'Đã từ chối': 'revoked',
    'Tất cả': '',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const fetchDegrees = useCallback(async (status: string, date?: string) => {
    try {
      const res = await fetchDegree(status , date);
      const degree = res.data;
      setDegreeList(degree.degrees || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bằng cấp:', error);
    }
  }, []);

  useEffect(() => {
    const status = statusMap[selectedTab];
    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    fetchDegrees(status, formattedDate);
  }, [selectedTab, selectedDate, fetchDegrees]);

  return (
    <View style={styles.container}>
      {/* Thanh chọn */}
      <View style={styles.filterContainer}>
        {/* Nút quay lại */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/icon/arrow-left.png')} style={styles.backIcon} />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 2 }}>
          <TouchableOpacity
            style={[styles.filterButton, selectedTab === 'Tất cả' && styles.activeButton]}
            onPress={() => setSelectedTab('Tất cả')}
          >
            <Text style={[styles.filterText, selectedTab === 'Tất cả' && { color: '#fff' }]}>Tất cả</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.containerCalendar}>
            <Image source={require('../../../assets/icon/calendar.png')} style={styles.calendarIcon} />
            <View style={styles.arrowDownIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['Đã duyệt', 'Chưa duyệt', 'Đã từ chối'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, selectedTab === tab && styles.activeButton]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.filterText, selectedTab === tab && { color: '#fff' }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hiển thị DatePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              const formattedDate = date.toISOString().split('T')[0];
              fetchDegrees(statusMap[selectedTab], formattedDate);
              setSelectedDate(null);
            }
          }}
        />
      )}

      {/* Danh sách bằng cấp */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {degreeList.length > 0 ? (
          degreeList.map((degree, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate('Degree', {
                  degree_name: degree.degree_name,
                  issued_at: degree.issued_at,
                  owner_name: degree.owner_name,
                  major_name: degree.major_name,
                  status: degree.status,
                  gpa: degree.gpa,
                })
              }
            >
              <Text style={styles.cardTitle}>{degree.degree_name}</Text>
              <Text style={styles.cardText}>Thời gian: {formatDate(degree.issued_at)}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <TouchableOpacity style={styles.card}>
            <Text style={[styles.cardText, { textAlign: 'center' }]}>Không có dữ liệu</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  filterText: {
    color: '#3B5998',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#3B5998',
  },
  containerCalendar: {
    width: 100,
    height: 50,
    backgroundColor: '#d3d8e6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
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
    borderTopColor: '#3a5999',
    marginLeft: 8,
  },
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
    textAlign: 'center',
  },
  cardText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    paddingVertical: 7,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
