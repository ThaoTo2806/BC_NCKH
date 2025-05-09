import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ShareButton from '../components/ShareButton';
import { APP_COLOR } from '../utils/constant';
import { useNavigation } from '@react-navigation/native';

const SecuritySettingScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon/User.png')}
          style={styles.image}
        />
        <Text style={styles.headerText}>Cấu hình{'\n'}bảo mật</Text>
      </View>

      {/* Danh sách tính năng */}
      <View style={styles.optionsContainer}>
        {renderOption(
          'Lưu Private Key',
          require('../../assets/icon/Access.png'),
        )}
        {renderOption(
          'Xuất file mã hóa',
          require('../../assets/icon/Password.png'),
        )}
        {renderOption(
          'Xác thực 2 lớp',
          require('../../assets/icon/fingerprint.png'),
        )}
      </View>

      {/* Nút Quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/icon/arrow-left.png')}
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      {/* Đưa nút Đăng xuất ra giữa màn hình */}
      <View style={styles.logoutContainer}>
        <ShareButton
          name="Đăng xuất"
          onPress={() => console.log('Đăng xuất')}
          btnStyles={styles.logoutButton}
          textStyles={styles.logoutText}
        />
      </View>
    </View>
  );
};

// Component hiển thị mỗi dòng trong danh sách
const renderOption = (title: string, iconSource: any) => {
  return (
    <View style={styles.optionItem}>
      <Text style={styles.optionText}>{title}</Text>
      <Image source={iconSource} style={styles.optionIcon} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#B0B0B0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: APP_COLOR.PRIMARY,
  },
  backText: {
    color: APP_COLOR.PRIMARY,
    marginLeft: 5,
    fontSize: 20,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    textAlign: 'center',
  },
  logoutButton: {
    width: 300,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default SecuritySettingScreen;
