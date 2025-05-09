import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ShareButton from '../../components/ShareButton';
import {APP_COLOR} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../utils/type.navigate';
import {addDegree} from '../../utils/api';

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

const AddDegree = ({route}: any) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const {
    id,
    major_id,
    degree_name,
    degree_type,
    graduation_year,
    gpa,
    hash_qrcode,
  } = route.params;

  const pickFiles = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 2}, response => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
      } else {
        setSelectedFiles(response.assets); // Lưu danh sách ảnh vào state
      }
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('Chưa chọn file!');
      return;
    }

    const formData = new FormData();

    formData.append('frontImage', {
      uri: selectedFiles[0].uri,
      type: selectedFiles[0].type,
      name: selectedFiles[0].fileName,
    });

    formData.append('backImage', {
      uri: selectedFiles[1].uri,
      type: selectedFiles[1].type,
      name: selectedFiles[1].fileName,
    });

    formData.append('user_id', id);
    formData.append('major_id', +major_id);
    formData.append('degree_name', degree_name);
    formData.append('degree_type', +degree_type);
    formData.append('graduation_year', graduation_year);
    formData.append('gpa', gpa);
    formData.append('hash_qrcode', hash_qrcode);

    try {
      const response = await addDegree(formData);

      if (response.success) {
        Alert.alert('Upload thành công!');
        navigation.navigate('ListCertificationPersonal', {id});
      } else {
        Alert.alert('Upload thất bại');
        navigation.navigate('ListCertificationPersonal', {id});
      }
    } catch (error) {
      console.error('Lỗi upload file:', error);
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
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => (
            <View key={index} style={{marginRight: 10}}>
              <Image
                source={{uri: file.uri}}
                style={{width: 150, height: 150, borderRadius: 10}}
              />
              {/* <Text style={{textAlign: 'center'}}>{file.fileName}</Text> */}
            </View>
          ))
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

      <TouchableOpacity style={styles.confirmButton} onPress={uploadFiles}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddDegree;
