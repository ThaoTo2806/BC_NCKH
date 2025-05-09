import { NavigationIndependentTree, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import ShareButton from '../../components/ShareButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/type.navigate';
import axios from 'axios';
import { fetchDegree } from '../../utils/api';

interface DegreeProps  {
  owner_name : String,
  major_name: String,
  degree_name : String,
  issued_at: String,
  status : String
}
export default function ApproveHistoryScreen() {
  type NavigationProps = StackNavigationProp<RootStackParamList , "Degree">;
  const navigation = useNavigation<NavigationProps>();
  const [selectedTab , setselectedTab] = useState("Đã duyệt");
  const [degreeList , setdegreeList] = useState<DegreeProps[]>([]);
  const statusMap:Record<string,string> = {
    'Đã duyệt': 'valid',
    'Chưa duyệt': 'pending',
    'Đã từ chối': 'revoked',
    'Tất cả' : ""
  };

  const Degrees = async(status:string) => {
   
    const res = await fetchDegree(status);
    const degree = res.data;
    setdegreeList(degree.degrees);

  } 
 
  useEffect( () => {
    const status = statusMap[selectedTab];
    Degrees(status);
  } , [selectedTab]);
  return (
    <View style={styles.container}>
      {/* Thanh chọn */}
      <View style={styles.filterContainer}>
        {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack() }}>
        <Image
          source={require('../../../assets/icon/arrow-left.png')}
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
      <View style= {{flexDirection : "row" , gap : 2}}>
      <TouchableOpacity style={[styles.filterButton , selectedTab == "Tất cả" && styles.activeButton]} onPress={() => setselectedTab("Tất cả")}>
          <Text style={[styles.filterText , selectedTab == "Tất cả" && {color : "#fff"}]}>Tất cả</Text>
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
        
      </View>
      
      <View style={styles.filterContainer}>
        {["Đã duyệt" , "Chưa duyệt" , "Đã từ chối"].map((tab , index ) =>
        (
            <TouchableOpacity key={index} style={[styles.filterButton,selectedTab == tab && styles.activeButton]} onPress={() =>setselectedTab(tab)}>
                <Text style={[styles.filterText , selectedTab == tab && {color : "#fff"}]}>
                  {tab}
                </Text>
            </TouchableOpacity>            
        )
        )}
      
      </View>

      {/* Danh sách bằng cấp */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {
          degreeList.length > 0 ?
        degreeList.map((degree , index) => 
        (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate("Degree" , {
            degree_name : degree.degree_name,
            issued_at : degree.issued_at,
            owner_name : degree.owner_name,
            major_name : degree.major_name,
            status : degree.status
          })}>
              <Text style={styles.cardTitle}>{degree.degree_name}</Text>
              <Text style={styles.cardText}>Thời gian: {new Date(degree.issued_at).toLocaleDateString("vi-VN")}</Text>
            </TouchableOpacity>

          ))
        :
        (
          <TouchableOpacity style={styles.card}>

            <Text style={[styles.cardText , {textAlign : "center  "} ]}>Không có dữ liệu</Text>
          </TouchableOpacity>
        )
        }
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

  // Thanh chọn
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
  activeButton : {
    color : "#fff" ,
    backgroundColor : "#3B5998",
    fontWeight : "bold",
    fontSize : 18
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
