import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ShareButton from '../../components/ShareButton';
import { APP_COLOR } from '../../utils/constant';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/type.navigate';
import { addDegree } from '../../utils/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    // position: 'absolute',
    // top: 20, // Đặt gần đầu màn hình
    // left: 20,
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
    tintColor: APP_COLOR.PRIMARY, // Đảm bảo màu sắc của icon
  },
  backText: {
    fontSize: 18,
    color: APP_COLOR.PRIMARY,
    fontWeight: 'bold',
  },
  uploadContainer: {
    backgroundColor: APP_COLOR.PRIMARY,
    marginLeft: 15,
    padding: 10,
    borderRadius: 30,
    width: 347,
    height: 503,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: 'white',
    fontSize: 20,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 20,
    right: 100,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: APP_COLOR.PRIMARY,
    padding: 10,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

type NavigationProps = StackNavigationProp<RootStackParamList, 'AddDegree'>;

const AddDegree = ({ route }: any) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageFrontUri, setImageFrontUri] = useState<string | null>(null); // ảnh mặt trước
  const [imageFrontName, setImageFrontName] = useState<string | null>(null);

  const {
    id,
    major_id,
    degree_name,
    degree_type,
    graduation_year,
    gpa,
    hash_qrcode,
    imageFrontUri: frontUriFromRoute,
    imageFrontName: frontNameFromRoute// lấy từ route
  } = route.params;

  const batch = null;

  React.useEffect(() => {
    if (frontUriFromRoute) setImageFrontUri(frontUriFromRoute);
    if (frontNameFromRoute) setImageFrontName(frontNameFromRoute);
  }, [frontUriFromRoute, frontNameFromRoute]);

  const pickFiles = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
      } else {
        setSelectedFiles(response.assets); // Lưu danh sách ảnh vào state
      }
    });
  };

  const uploadFiles = async (batch) => {
    if (selectedFiles.length === 0) {
      Alert.alert('Chưa chọn file!');
      return;
    }

    const formData = new FormData();

    if (!imageFrontUri) {
      Alert.alert('Vui lòng chọn ảnh mặt trước!');
      return;
    }

    if (selectedFiles.length === 0) {
      Alert.alert('Vui lòng chọn ảnh mặt sau!');
      return;
    }

    formData.append('frontImage', {
      uri: imageFrontUri,
      type: 'image/jpeg',
      name: imageFrontName || 'front.jpg',
    });

    formData.append('backImage', {
      uri: selectedFiles[0].uri,
      type: selectedFiles[0].type,
      name: selectedFiles[0].fileName,
    });


    formData.append('user_id', id);
    formData.append('major_id', +major_id);
    formData.append('degree_name', degree_name);
    formData.append('degree_type', +degree_type);
    formData.append('graduation_year', graduation_year);
    formData.append('gpa', gpa);
    formData.append('hash_qrcode', hash_qrcode);
    formData.append('batch_approval', batch);
    console.log('Form data:', formData); // Log the form data to check its structure

    try {
      const response = await addDegree(formData);
      console.log('Response from server:', response); // Log the response data
      if (response.success) {
        Alert.alert('Upload thành công!');
        navigation.navigate('AdminHome');
        //navigation.navigate('ListCertificationPersonal', { id });
      } else {
        Alert.alert('Upload thất bại');
        navigation.navigate('ListCertificationPersonal', { id });
      }
    } catch (error) {
      console.error('Lỗi upload file:', error); // Log the entire error object
      Alert.alert('Lỗi upload file', error.message || 'Unknown error');
    }
  };
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
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
      <View style={styles.uploadContainer}>
        {imageFrontUri ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Image
              source={{ uri: imageFrontUri }}
              style={{ width: 150, height: 150, borderRadius: 10, marginRight: 10 }}
            />
            {selectedFiles.length > 0 &&
              selectedFiles.map((file, index) => (
                <Image
                  key={index}
                  source={{ uri: file.uri }}
                  style={{ width: 150, height: 150, borderRadius: 10 }}
                />
              ))}
          </View>
        ) : (
          <Image source={require('../../../assets/icon/uploadicon.png')} />
        )}

        <ShareButton
          pressStyles={styles.uploadButton}
          // btnStyles={styles.uploadIcon}
          textStyles={styles.uploadText}
          name="Pick a file"
          onPress={pickFiles}
        />
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={() => uploadFiles("false")}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.confirmButton} onPress={() => uploadFiles("true")}>
        <Text style={styles.confirmButtonText}>Duyệt sau</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddDegree;
