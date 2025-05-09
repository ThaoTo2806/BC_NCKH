import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import { loginWithTokenAPI } from '../utils/api'
import ShareButton from '../components/ShareButton'
import ShareInput from '../components/ShareInput'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { APP_COLOR } from '../utils/constant'
export const LoginWithToken = () => {
    const [token ,settoken ] = useState("");
    const navigation = useNavigation();
    const hanldeLoginwithToken = async (token: string) => {
        try {
          const result = await loginWithTokenAPI(token);
      
          console.log(result);
      
          if (result.success === true) {
            const storageItems: [string, string][] = [
              ['username', result.user.username],
              ['commonName', result.user.common_name],
              ['role', result.user.role],
              ['userId', JSON.stringify(result.user.id)],
            ];
      
            await AsyncStorage.multiSet(storageItems);
      
            if (result.user.role === 'admin' || result.user.role === 'manager') {
              navigation.navigate('AdminHome');
            } else if (result.user.role === 'verifier') {
              navigation.navigate('Approve');
            } else if (result.user.role === 'student' && result.code === 'LOGIN_SUCCESS') {
              navigation.navigate('Home', { username: result.user.username });
            }
          } else if (result.code === 'PIN_REQUIRED') {
            await AsyncStorage.setItem('username', result.user.username);
            navigation.navigate('CreatePinScreen', { username: result.user.username });
          } 
          else if(result.code === "INVALID_CREDENTIALS"){
            Alert.alert('Lỗi đăng nhập', 'Sai token');
          }
          else {
            Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập bằng token');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ.');
        }
      };
      
  return (
    <View>
        <ShareInput
                title="Password"
                secureTextEntry
                onChangeText={(value : string) => settoken(value)}
                onBlur={() =>{}}
                value={token}
                errors="Nhập token"
              />

            <ShareButton
              name="Đăng nhập"
              onPress={() => hanldeLoginwithToken(token)}
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
  )
}
