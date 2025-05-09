import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShareButton from '../components/ShareButton';

export default function VerificationScreen() {
  const navigation = useNavigation(); // ✅ Lấy navigation để điều hướng trang
  const [selectedTab, setSelectedTab] = useState('verified');
  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  return (
    <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/image/Logo_Huit.png')}
            style={styles.illustration}
          />
        </View>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={['#425A8B', '#1E2A47']} style={styles.card}>
          <View style={styles.statusContainer}>
            <Image
              source={require('../../assets/icon/check.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.statusText}>Đã xác thực</Text>
          </View>
         
        </LinearGradient>

        <TouchableOpacity style={styles.historyButton}>
          <View style={styles.historyContainer}>
            <Image
              source={require('../../assets/icon/arrow-right.png')}
              style={styles.arrowRightIcon}
            />
            <Text style={styles.historyText}>Lịch sử thay đổi bằng cấp</Text>
          </View>
        </TouchableOpacity>
        {/* Nút quay lại */}
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate("Home")} // Điều hướng về Home
        >
            <Image
                source={require('../../assets/icon/arrow-left.png')}
                style={styles.backIcon}
            />
            <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 0,
    flex: 1, 
    height: '100%',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    marginBottom: 0,
    minWidth: '100%',
  },
  text: {
    fontFamily: 'Poppins',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginHorizontal: 5,
    // minWidth: '180px',
    height: 30,
    backgroundColor: '#D2D9E7',
  },

  activeTab: {
    backgroundColor: '#3B5998',
    borderRadius: 50,
  },
  tabText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    marginTop: 10,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: 600,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  arrowRightIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    marginLeft: -10,
  },
  statusContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingRight: 50,
  },

  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  historyButton: {
    marginTop: 15,
  },
  historyText: {
    fontSize: 16,
    color: '#3B5998',
    fontWeight: 'bold',
  },
  verifyButton: {
    marginTop: 30,
    backgroundColor: '#3B5998',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 15,
  },
  verifyText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
   /* Hình minh họa */
   illustrationContainer: {
    alignItems: 'center',
  },

  illustration: {
    width: 500,
    height: 150,
    resizeMode: 'contain',
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
