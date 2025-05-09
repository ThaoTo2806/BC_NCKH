import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CertificateHistoryScreen() {
  const navigation = useNavigation(); 
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = async (selectedDate?: Date) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    const storedHistory = await AsyncStorage.getItem("degreeHistory");
    if (storedHistory) {
      const allHistory = JSON.parse(storedHistory);
      const userHistory = allHistory.filter((item: { userId: string }) => item.userId === userId);

      if (selectedDate) {
        const selectedDateString = formatDate(selectedDate);
        const filteredHistory = userHistory.filter((item: { time: string }) => {
          const itemDateString = item.time.split(" ")[0];
          return itemDateString === selectedDateString;
        });

        setHistory(filteredHistory);
      } else {
        setHistory(userHistory);
      }
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  // Load danh sách history khi mở màn hình
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      loadHistory(selectedDate);
    }
  };




  return (
    <View style={styles.container}>
      {/* Thanh chọn */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setDate(new Date()); 
            loadHistory();
          }}
        >
          <Text style={styles.filterText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <View style={styles.containerCalendar}>
            <Image
              source={require('../../assets/icon/calendar.png')}
              style={styles.calendarIcon}
            />
            <View style={styles.arrowDownIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Danh sách bằng cấp */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {history.length > 0 ? (
          history.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>Bằng {
              item.degreeName === 0
                      ? "cử nhân"
                      : item.degreeName === 1
                        ? "thạc sĩ"
                        : item.degreeName === 2
                          ? "tiến sĩ"
                          : "bác sĩ"}</Text>
              <Text style={styles.cardText}>Thời gian: {item.time}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noHistoryText}>Chưa có lịch sử</Text>
        )}
      </ScrollView>

      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Image
          source={require('../../assets/icon/arrow-left.png')}
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
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
