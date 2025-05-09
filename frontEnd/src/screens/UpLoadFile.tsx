import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function UploadFileScreen() {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUploadPress = () => {
    Alert.alert('Upload', 'Upload file functionality goes here.');
  };

  const handleVerifyPress = () => {
    Alert.alert('Verify', 'Verification functionality goes here.');
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Image
          source={require('../../assets/icon/arrow-left.png')}
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      {/* Thẻ tải file */}
      <LinearGradient colors={['#425A8B', '#1E2A47']} style={styles.card}>
        {/* Icon upload */}
        <Image
          source={require('../../assets/icon/upload.png')}
          style={styles.uploadIcon}
        />

        {/* Nút tải file */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
          <Text style={styles.uploadText}>Tải File chứng chỉ lên tại đây</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Nút xác minh */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyPress}>
        <Text style={styles.verifyText}>Xác minh</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backIcon: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  backText: {
    fontSize: 22,
    color: '#3B5998',
    fontWeight: 'bold',
  },

  card: {
    width: '93%',
    height: 600,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  uploadIcon: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },

  uploadButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    borderRadius: 10,
  },

  uploadText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },

  verifyButton: {
    marginTop: 30,
    backgroundColor: '#3B5998',
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginVertical: 10,
    borderRadius: 20,
  },

  verifyText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});