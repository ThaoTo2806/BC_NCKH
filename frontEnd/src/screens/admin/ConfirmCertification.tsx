import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {APP_COLOR} from '../../utils/constant';
import ShareButton from '../../components/ShareButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getDegreeById, UpdateDegree} from '../../utils/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.PRIMARY,
  },
  card: {
    backgroundColor: '#D3D3D3',
    height: 524,
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5, // Bóng đổ giúp card nổi bật
  },
  text: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: APP_COLOR.PRIMARY,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 100, // Đặt gần đáy
    left: 40,
    right: 40,
    zIndex: 2,
  },
  button: {
    backgroundColor: APP_COLOR.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 10,
    width: 150,
  },
  buttonText: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Nút quay lại
  backButton: {
    position: 'absolute',
    bottom: 20, // Đặt gần đầu màn hình
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 3,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    resizeMode: 'contain',
  },
  backText: {
    fontSize: 18,
    color: APP_COLOR.PRIMARY,
    fontWeight: 'bold',
  },
  iconCircle: {
    borderRadius: 50,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '90%',
    height: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
  },
});

const ConfirmCertification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const [imageFront, setimageFront] = useState('');
  const [imageBack, setimageBack] = useState('');
  const [degree, setDegree] = useState(null);
  const [showingFront, setshowingFront] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const arrayBufferToBase64 = (buffer: number[]): string => {
    try {
      const binary = buffer.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        '',
      );
      const base64String = btoa(binary);
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error('Lỗi chuyển đổi arrayBufferToBase64:', error);
      return '';
    }
  };

  const handleAccept = async (status: String, id: number) => {
    const result = await UpdateDegree(status, id);
    Alert.alert('Thông báo', 'Duyệt thành công');
    navigation.navigate('ListRequests');
  };

  const handleRevoked = async (status: String, id: number) => {
    const result = await UpdateDegree(status, id);
    Alert.alert('Thông báo', 'Từ chối thành công');
    navigation.navigate('ListRequests');
  };

  const processImages = degreeData => {
    try {
      if (degreeData?.degree_image_front) {
        if (
          typeof degreeData.degree_image_front === 'string' &&
          degreeData.degree_image_front.startsWith('data:image')
        ) {
          setimageFront(degreeData.degree_image_front);
        } else if (
          degreeData.degree_image_front.type === 'Buffer' &&
          Array.isArray(degreeData.degree_image_front.data)
        ) {
          const base64ImageFront = arrayBufferToBase64(
            degreeData.degree_image_front.data,
          );
          setimageFront(base64ImageFront);
        } else if (degreeData.degree_image_front.uri) {
          setimageFront(degreeData.degree_image_front.uri);
        }
      }

      if (degreeData?.degree_image_back) {
        if (
          typeof degreeData.degree_image_back === 'string' &&
          degreeData.degree_image_back.startsWith('data:image')
        ) {
          setimageBack(degreeData.degree_image_back);
        } else if (
          degreeData.degree_image_back.type === 'Buffer' &&
          Array.isArray(degreeData.degree_image_back.data)
        ) {
          const base64ImageBack = arrayBufferToBase64(
            degreeData.degree_image_back.data,
          );
          setimageBack(base64ImageBack);
        } else if (degreeData.degree_image_back.uri) {
          setimageBack(degreeData.degree_image_back.uri);
        }
      }
    } catch (error) {
      console.error('Lỗi xử lý ảnh:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getDegreeById(id);
        if (res?.success) {
          setDegree(res.degree);
          processImages(res.degree);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bằng cấp:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // Chỉ phụ thuộc vào id để tránh vòng lặp vô hạn

  return (
    <View style={styles.container}>
      {/* Hai lớp màu nền */}
      <View style={{backgroundColor: APP_COLOR.PRIMARY, height: '30%'}} />
      <View style={{backgroundColor: '#ffffff', height: '70%'}} />

      {/* Card hiển thị thông tin */}
      <View style={styles.card}>
        <Text style={styles.text}>Thông tin bằng cấp</Text>
        <TouchableOpacity
          onPress={() => setshowingFront(true)}
          disabled={showingFront}>
          <Image
            source={require('../../../assets/icon/arrow-left.png')}
            style={styles.iconCircle}
          />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {isLoading ? (
            <View style={{alignItems: 'center'}}>
              <ActivityIndicator size="large" color={APP_COLOR.PRIMARY} />
              <Text style={styles.imagePlaceholder}>Đang tải ảnh...</Text>
            </View>
          ) : showingFront ? (
            imageFront ? (
              <Image
                source={{uri: imageFront}}
                style={styles.image}
                resizeMode="contain"
                onError={e =>
                  console.log('Lỗi hiển thị ảnh:', e.nativeEvent.error)
                }
              />
            ) : (
              <Text style={styles.imagePlaceholder}>
                Không có ảnh mặt trước
              </Text>
            )
          ) : imageBack ? (
            <Image
              source={{uri: imageBack}}
              style={styles.image}
              resizeMode="contain"
              onError={e =>
                console.log('Lỗi hiển thị ảnh:', e.nativeEvent.error)
              }
            />
          ) : (
            <Text style={styles.imagePlaceholder}>Không có ảnh mặt sau</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setshowingFront(false)}
          disabled={!showingFront}>
          <Image
            source={require('../../../assets/icon/arrow-right.png')}
            style={styles.iconCircle}
          />
        </TouchableOpacity>
      </View>

      {/* Button xác nhận & từ chối */}
      <View style={styles.buttonContainer}>
        <ShareButton
          name="Chấp nhận"
          onPress={() => handleAccept('valid', id)}
          textStyles={styles.buttonText}
          btnStyles={styles.button}
        />
        <ShareButton
          name="Từ chối"
          onPress={() => handleRevoked('revoked', id)}
          textStyles={styles.buttonText}
          btnStyles={styles.button}
        />
      </View>

      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/icon/arrow-left.png')}
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmCertification;
