import {
  Image,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Input} from '../../android/app/src/Components/Input';
import {Button} from '../../android/app/src/Components/Button';
import ShareInput from '../components/ShareInput';
import {APP_COLOR} from '../utils/constant';
import ShareButton from '../components/ShareButton';
import {Link, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {LoginSchema} from '../utils/validate.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../utils/type.navigate';
import {loginAPI} from '../utils/api';

const LoginImage = require('../../assets/image/Login.png');
const IdentityIcon = require('../../assets/icon/Identification.png');
const AccessIcon = require('../../assets/icon/Access.png');
type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await loginAPI(username, password);

      if (res.data.code == 'INVALID_CREDENTIALS') {
        Alert.alert('Thông báo', 'Sai tên đăng nhập hoặc mật khẩu');
        return;
      }

      if (res.data.success === true) {
        // Lưu thông tin chung cho tất cả các role
        const storageItems = [
          ['username', username],
          ['commonName', res.data.common_name],
          ['role', res.data.role],
        ];

        // Nếu là admin
        if (res.data.role == 'admin' || res.data.role == 'manager') {
          await AsyncStorage.multiSet(storageItems);
          navigation.navigate('AdminHome');
        }
        // Nếu là verifier
        else if (res.data.role == 'verifier') {
          await AsyncStorage.multiSet(storageItems);
          navigation.navigate('Approve');
        }
        // Nếu là student
        else if (res.data.role == 'student') {
          if (res.data.code === 'LOGIN_SUCCESS') {
            const {common_name} = res.data;

            // // Thêm common_name vào danh sách lưu trữ
            // storageItems.push(['commonName', common_name]);

            // Lưu tất cả thông tin vào AsyncStorage
            await AsyncStorage.multiSet(storageItems);

            navigation.navigate('Home', {
              username,
              commonName: common_name,
            });
          } else {
            // Xử lý lỗi từ API
            switch (res.data.code) {
              case 'USER_NOT_FOUND':
                Alert.alert('Lỗi đăng nhập', 'Tên đăng nhập không tồn tại.');
                break;
              case 'INVALID_CREDENTIALS':
                Alert.alert('Lỗi đăng nhập', 'Mật khẩu không chính xác.');
                break;
              case 'PIN_REQUIRED':
                await AsyncStorage.setItem('username', username);
                navigation.navigate('CreatePinScreen', {username});
                break;
              default:
                Alert.alert(
                  'Lỗi đăng nhập',
                  'Có lỗi xảy ra. Vui lòng thử lại sau.',
                );
                break;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Lỗi kết nối',
        'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
      );
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Formik
        validationSchema={LoginSchema}
        initialValues={{username: '', password: ''}}
        onSubmit={values => handleLogin(values.username, values.password)}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <View>
            <View style={styles.imageContainer}>
              <Image source={LoginImage} style={styles.image}></Image>
            </View>

            <View style={styles.title}>
              <Text style={styles.text}>Login</Text>
            </View>

            <View style={{padding: 28}}>
              <ShareInput
                title="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                errors={errors.username}
              />
              <ShareInput
                title="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errors={errors.password}
              />
            </View>

            <ShareButton
              name="Đăng nhập"
              onPress={handleSubmit}
              textStyles={{
                textTransform: 'uppercase',
                color: '#fff',
                paddingVertical: 5,
              }}
              pressStyles={{alignSelf: 'stretch'}}
              btnStyles={{
                backgroundColor: APP_COLOR.PRIMARY,
                justifyContent: 'center',
                marginHorizontal: 50,
                paddingVertical: 10,
                borderRadius: 30,
              }}
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    // height: 240,
    marginVertical: 20,
  },
  Button: {
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 2,
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
