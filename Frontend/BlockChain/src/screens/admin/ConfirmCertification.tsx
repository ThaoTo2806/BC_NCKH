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
  const [imageFront, setImageFront] = useState('');
  const [imageBack, setImageBack] = useState('');
  const [degree, setDegree] = useState(null);
  const [showingFront, setShowingFront] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
      console.log('degreeData>>>>>>>', degreeData);

      // Xử lý ảnh mặt trước (chỉ hỗ trợ base64)
      if (degreeData?.frontImage && typeof degreeData.frontImage === 'string') {
        const frontUri = degreeData.frontImage.startsWith('data:image')
          ? degreeData.frontImage
          : `data:image/jpeg;base64,${degreeData.frontImage}`;
        setImageFront(frontUri);
      } else {
        console.log('frontImage không hợp lệ hoặc không tồn tại');
        setImageFront('');
      }

      // Xử lý ảnh mặt sau (chỉ hỗ trợ base64)
      if (degreeData?.backImage && typeof degreeData.backImage === 'string') {
        const backUri = degreeData.backImage.startsWith('data:image')
          ? degreeData.backImage
          : `data:image/jpeg;base64,${degreeData.backImage}`;
        setImageBack(backUri);
      } else {
        console.log('backImage không hợp lệ hoặc không tồn tại');
        setImageBack('');
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
        console.log('res>>>>>>>', res);
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
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: APP_COLOR.PRIMARY, height: '30%'}} />
      <View style={{backgroundColor: '#ffffff', height: '70%'}} />

      <View style={styles.card}>
        <Text style={styles.text}>Thông tin bằng cấp</Text>
        <TouchableOpacity
          onPress={() => setShowingFront(true)}
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
                  console.log(
                    'Lỗi hiển thị ảnh mặt trước:',
                    e.nativeEvent.error,
                  )
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
                console.log('Lỗi hiển thị ảnh mặt sau:', e.nativeEvent.error)
              }
            />
          ) : (
            <Text style={styles.imagePlaceholder}>Không có ảnh mặt sau</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowingFront(false)}
          disabled={!showingFront}>
          <Image
            source={require('../../../assets/icon/arrow-right.png')}
            style={styles.iconCircle}
          />
        </TouchableOpacity>
        <View>
          <Text style={{color: 'red', fontSize: 26, fontWeight: 'bold'}}>
            Duyệt lần 2
          </Text>
        </View>
      </View>

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
