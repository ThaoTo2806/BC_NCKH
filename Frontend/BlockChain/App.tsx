/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';

import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Input} from './android/app/src/Components/Input';
import {RegisterScreen} from './src/screens/Register';
import {LoginScreen} from './src/screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VerificationScreen from './src/screens/Verification';
import UploadFileScreen from './src/screens/UpLoadFile';
import CertificateHistoryScreen from './src/screens/CertificateHIstory';
import SecuritySettingScreen from './src/screens/SecuritySetting';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminHomeScreen from './src/screens/admin/HomeAdminScreen';
import ListIdentity from './src/screens/admin/ListIdentity';
import ListRequestsScreen from './src/screens/admin/ListRequests';
import ListRequestsRejectedScreen from './src/screens/admin/ListRequestsRejected';
import ConfirmCertification from './src/screens/admin/ConfirmCertification';
import Register1 from './src/screens/admin/Register1';
import Register2 from './src/screens/admin/Register2';
import {RootStackParamList} from './src/utils/type.navigate';
import {PinScreen} from './src/screens/PinScreen';
import RefreshPassword from './src/screens/admin/RefreshPassword';
import DetailIdentity from './src/screens/admin/DetailIdentity';
import {RegisterForm1} from './src/screens/admin/RegisterForm1';
import ListCertificationPersonal from './src/screens/admin/ListCertificationPersonal';
import AddDegree from './src/screens/admin/AddDegree';
import AddDegree1 from './src/screens/admin/AddDegree1';
import ApproveHistoryScreen from './src/screens/ApproveUser/ApproveHistoryScreen';
import ApproveScreen from './src/screens/ApproveUser/ApproveScreen';
import {DegreeScreen} from './src/screens/ApproveUser/DegreeScreen';
import DegreeAproveListScreen from './src/screens/ApproveUser/DegreeApproveListScreen';
import {DegreeApprove} from './src/screens/ApproveUser/DegreeApprove';
import ChangePasswordScreen from './src/screens/ChangePassword';
import {CreatePinScreen} from './src/screens/CreatePinScreen';
import QRScan from './src/screens/QRScan';
import {LoginWithToken} from './src/screens/LoginWithToken';
import HistoryQuery from './src/screens/admin/HistoryQuery';
import { QRLogin } from './src/screens/QRLogin';
import DisplayImageDegree from './src/screens/DisplayImageDegree';

type SectionProps = PropsWithChildren<{
  title: string;
}>;
const Stack = createNativeStackNavigator<RootStackParamList>();

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="ApproveHistory"
            component={ApproveHistoryScreen}
            options={{title: 'Approve', headerShown: false}}
          />
          <Stack.Screen
            name="DisplayImage"
            component={DisplayImageDegree}
            options={{title: 'DisplayImage', headerShown: false}}
          />
          <Stack.Screen
            name="Approve"
            component={ApproveScreen}
            options={{title: 'Approve', headerShown: false}}
          />
          <Stack.Screen
            name="QRSCan"
            component={QRScan}
            options={{title: 'QRSCan', headerShown: false}}
          />
            <Stack.Screen
            name="QRLogin"
            component={QRLogin}
            options={{title: 'QRSCan', headerShown: false}}
          />
          <Stack.Screen
            name="LoginWithToken"
            component={LoginWithToken}></Stack.Screen>
          <Stack.Screen name="Degree" component={DegreeScreen}></Stack.Screen>

          <Stack.Screen
            name="DegreeApproveList"
            component={DegreeAproveListScreen}></Stack.Screen>
          <Stack.Screen
            name="DegreeApprove"
            component={DegreeApprove}></Stack.Screen>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Welcome', headerShown: false}}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="Verification"
            component={VerificationScreen}
            options={{title: 'Xác thực', headerShown: false}}
          />

          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Trang chủ', headerShown: false}}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{title: 'Đổi mật khẩu'}}
          />

          <Stack.Screen
            name="UploadFile"
            component={UploadFileScreen}
            options={{title: 'Upload file', headerShown: false}}
          />

          <Stack.Screen
            name="CertificateHistory"
            component={CertificateHistoryScreen}
            options={{title: 'Lịch sử truy vấn', headerShown: false}}
          />
          <Stack.Screen
            name="CreatePinScreen"
            component={CreatePinScreen}
            options={{title: 'Create Pin', headerShown: false}}
          />
          <Stack.Screen
            name="SecuritySettings"
            component={SecuritySettingScreen}
            options={{title: 'Cấu hình bảo mật', headerShown: false}}
          />
          <Stack.Screen
            name="AdminHome"
            component={AdminHomeScreen}
            options={{title: 'Admin Home', headerShown: false}}
          />
          <Stack.Screen
            name="ListIdentity"
            component={ListIdentity}
            options={{title: 'List Identity', headerShown: false}}
          />
          <Stack.Screen
            name="ListRequests"
            component={ListRequestsScreen}
            options={{title: 'List Requests Identities', headerShown: false}}
          />
          <Stack.Screen
            name="ListRequestsRejected"
            component={ListRequestsRejectedScreen}
            options={{
              title: 'List Requests Identities Rejected',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ConfirmCertification"
            component={ConfirmCertification}
            options={{title: 'Confirm Certification', headerShown: false}}
          />
          <Stack.Screen
            name="Register1"
            component={Register1}
            options={{title: 'Register 1', headerShown: false}}
          />
          <Stack.Screen
            name="Register2"
            component={Register2}
            options={{title: 'Register 2', headerShown: false}}
          />
          <Stack.Screen
            name="PinScreen"
            component={PinScreen}
            options={{title: 'PinScreen', headerShown: false}}
          />
          <Stack.Screen
            name="RefreshPassword"
            component={RefreshPassword}
            options={{title: 'RefreshPassword', headerShown: false}}
          />
          <Stack.Screen
            name="DetailIdentity"
            component={DetailIdentity}
            options={{title: 'DetailIdentity', headerShown: false}}
          />
          <Stack.Screen
            name="RegisterForm1"
            component={RegisterForm1}
            options={{title: 'RegisterForm1', headerShown: false}}
          />

          <Stack.Screen
            name="AddDegree"
            component={AddDegree}
            options={{title: 'AddDegree', headerShown: false}}
          />
          <Stack.Screen
            name="AddDegree1"
            component={AddDegree1}
            options={{title: 'AddDegree1', headerShown: false}}
          />
          <Stack.Screen
            name="ListCertificationPersonal"
            component={ListCertificationPersonal}
            options={{title: 'ListCertificationPersonal', headerShown: false}}
          />
          <Stack.Screen
            name="HistoryQuery"
            component={HistoryQuery}
            options={{title: 'HistoryQuery', headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
