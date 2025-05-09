import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input } from '../../android/app/src/Components/Input';
import { Button } from '../../android/app/src/Components/Button';
import { useNavigation } from '@react-navigation/native';
import ShareButton from '../components/ShareButton';
import { APP_COLOR } from '../utils/constant';
import ShareInput from '../components/ShareInput';
import { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/type.navigate';
const unitIcon = require('../../assets/icon/Unit.png');
const ModuleIcon = require('../../assets/icon/Module.png');
const userIcon = require('../../assets/icon/User.png');
const VectorIcon = require('../../assets/icon/Vector.png');
const registerImage = require('../../assets/image/Register.png');



type NavigationProps = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View>
      <View style={styles.title}>
        <Text style={styles.text}>Register</Text>
      </View>

      <View style={{ padding: 28 }}>
        <ShareInput
          title="Common Name"
          onChangeText={() => console.log('Common Name')}
          onBlur={console.log('Common Name')}
          value={'Common Name'}
          errors={'Error Common Name'}
        />
        <ShareInput
          title="Organization"
          onChangeText={() => console.log('Organization')}
          onBlur={console.log('Organization')}
          value={'Organization'}
          errors={'Error Organization'}
        />
        <ShareInput
          title="Organization Unit"
          onChangeText={() => console.log('Organization Unit')}
          onBlur={console.log('Organization Unit')}
          value={'Organization Unit'}
          errors={'Error Organization Unit'}
        />

        <ShareInput
          title="Country"
          onChangeText={() => console.log('Country')}
          onBlur={console.log('Country')}
          value={'Country'}
          errors={'Error Country'}
        />
        <ShareInput
          title="State or Province"
          onChangeText={() => console.log('State or Province')}
          onBlur={console.log('UsState or Provinceer')}
          value={'State or Province'}
          errors={'Error State or Province'}
        />
        <ShareInput
          title="Locality"
          onChangeText={() => console.log('Locality')}
          onBlur={console.log('Locality')}
          value={'Locality'}
          errors={'Error Locality'}
        />
        <ShareInput
          title="Email"
          onChangeText={() => console.log('Email')}
          onBlur={console.log('Email')}
          value={'Email'}
          errors={'Email'}
        />
      </View>

      <ShareButton
        // loading={loading}
        name="Đăng ký"
        onPress={() => Alert.alert('Đăng nhập thành công')}
        textStyles={{
          textTransform: 'uppercase',
          color: '#fff',
          paddingVertical: 5,
        }}
        pressStyles={{ alignSelf: 'stretch' }}
        btnStyles={{
          backgroundColor: APP_COLOR.PRIMARY,
          justifyContent: 'center',
          marginHorizontal: 50,
          paddingVertical: 10,
          borderRadius: 30,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          justifyContent: 'center',
          marginVertical: 15,
        }}>
        <Text style={{ color: 'black' }}>Bạn đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: 'black', textDecorationLine: 'underline' }}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
