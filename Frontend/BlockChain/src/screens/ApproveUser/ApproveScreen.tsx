import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ShareButton from '../../components/ShareButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/type.navigate';


type NavigationProps = StackNavigationProp<RootStackParamList, 'Approve'>;

const ApproveScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/icon/User.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>An Huynh</Text>
      </View>

      {/* Nội dung chính */}
      <View style={styles.content}>
        {/* Hình minh họa */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../assets/image/Logo_Huit.png')}
            style={styles.illustration}
          />
        </View>

        {/* Các nút bấm */}
        <View style={styles.buttonContainer}>
          <ShareButton
            name="Duyệt bằng cấp"
            onPress={() => navigation.navigate('DegreeApproveList')}
            btnStyles={styles.button}
            textStyles={styles.buttonText}
          />
          <ShareButton
            name="Lịch sử duyệt bằng cấp"
            onPress={() => navigation.navigate('ApproveHistory')}
            btnStyles={styles.button}
            textStyles={styles.buttonText}
          />
        

<ShareButton
            name="Đăng xuất"
            onPress={() => navigation.navigate('Login')}
            btnStyles={styles.button}
            textStyles={styles.buttonText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B5998',
    alignItems: 'center',
  },

  /* Header */
  header: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Đảm bảo borderRadius bằng một nửa chiều rộng và chiều cao
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginRight: 15,
  },

  userName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  /* Nội dung chính */
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },

  /* Hình minh họa */
  illustrationContainer: {
    alignItems: 'center',
  },

  illustration: {
    width: 440,
    height: 200,
    resizeMode: 'contain',
  },

  /* Các nút */
  buttonContainer: {
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    display: 'flex',
  },

  button: {
    width: 400,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 30,
    backgroundColor: '#3B5998',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ApproveScreen;
