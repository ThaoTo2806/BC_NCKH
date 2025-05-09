import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ShareButton from '../components/ShareButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const [commonName, setCommonName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
    useEffect(() => {
        const fetchCommonName = async () => {
            try {
              const storedCommonName = await AsyncStorage.getItem("commonName");
              const storedUsername = await AsyncStorage.getItem("username");
              const storedUserId = await AsyncStorage.getItem("userId");

              if (storedCommonName) setCommonName(storedCommonName);
              if (storedUsername) setUsername(storedUsername);
              if (storedUserId) setUserId(parseInt(storedUserId).toString());
            } catch (error) {
                console.error("Lỗi khi lấy Common Name:", error);
            }
        };

        fetchCommonName();
    }, []);
  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("username"); 
      await AsyncStorage.removeItem("commonName");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Điều hướng về màn hình đăng nhập
      });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/image/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{commonName}</Text>
      </View>

      {/* Nội dung chính */}
      <View style={styles.content}>
        {/* Hình minh họa */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/image/Logo_Huit.png')}
            style={styles.illustration}
          />
        </View>

        {/* Các nút bấm */}
        <View style={styles.buttonContainer}>
        <ShareButton
            name="Xuất trình bằng cấp"
            onPress={async () => {
              const storedUsername = await AsyncStorage.getItem("username");
              if (!storedUsername) {
                Alert.alert("Lỗi", "Không tìm thấy username.");
                return;
              }
              navigation.navigate("PinScreen", { username: storedUsername, actionType: "certificate" });
            }}
            btnStyles={styles.button}
            textStyles={styles.buttonText}
          />
          <ShareButton
            name="Lịch sử xuất trình"
            onPress={async () => {
              const storedUsername = await AsyncStorage.getItem("username");
              if (!storedUsername) {
                Alert.alert("Lỗi", "Không tìm thấy username.");
                return;
              }
              navigation.navigate("PinScreen", { username: storedUsername, actionType: "history" });
            }}
            btnStyles={styles.button}
            textStyles={styles.buttonText}
          />
          <ShareButton
            name="Đổi mật khẩu"
            onPress={() => navigation.navigate('ChangePassword')}
            btnStyles={styles.button}
            textStyles={styles.buttonText}
          />

          <ShareButton 
          name="Đăng xuất" 
          onPress={handleLogout} 
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
    width: 85,
    height: 85,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginRight: 15,
  },

  userName: {
    color: '#ffffff',
    fontSize: 30,
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
    width: 500,
    height: 250,
    resizeMode: 'contain',
  },

  /* Các nút */
  buttonContainer: {
    width:400,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    display: 'flex',
  },

  button: {
    width: 400,
    paddingVertical: 20,
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

export default HomeScreen;
