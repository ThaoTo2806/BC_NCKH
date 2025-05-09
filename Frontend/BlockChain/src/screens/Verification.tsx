import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDegreeByUserId, getTime } from "../utils/api";
import axios from "axios";
import { RootStackParamList } from "../utils/type.navigate";

export default function VerificationScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState(null);
  const [serverTime, setServerTime] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          const userId = JSON.parse(storedUserId);
          const data = await getDegreeByUserId(userId);
          setUserData(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchUserData();
  }, []);

  // Gọi API thời gian thực khi nhấn vào bằng cấp
  const handleDegreePress = async (degree) => {
    try {
      const response = await getTime();
      const time = response.time; // Thời gian lấy từ server
      const userId = await AsyncStorage.getItem("userId");
      // Lưu history vào AsyncStorage
      const historyItem = { degreeName: degree.degree_type, time, userId };
      const storedHistory = await AsyncStorage.getItem("degreeHistory");
      const historyList = storedHistory ? JSON.parse(storedHistory) : [];

      historyList.push(historyItem);
      await AsyncStorage.setItem("degreeHistory", JSON.stringify(historyList));

      setServerTime(time);
    } catch (error) {
      console.error("Lỗi khi lấy thời gian từ server:", error);
      Alert.alert("Lỗi", "Không thể lấy thời gian từ server.");
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/image/Logo_Huit.png")}
          style={styles.illustration}
        />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1 }]}>
        {userData &&
          userData.degrees &&
          userData.degrees.map((degree, index) => (
            <TouchableOpacity key={index}>
              <LinearGradient
                colors={["#425A8B", "#1E2A47"]}
                style={[styles.card, { minHeight: 600 }]}
              >
                <View style={styles.statusContainer}>
                  <Image
                    source={require("../../assets/icon/check.png")}
                    style={styles.checkIcon}
                  />
                  <Text style={styles.statusText}>Đã xác thực</Text>
                </View>
                <View style={styles.headerContainer}>
                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                      handleDegreePress(degree);
                      navigation.navigate("DisplayImage", { id: degree.id });
                    }}
                  >
                    <Image source={require("../../assets/icon/BulletList.png")} style={styles.menuIcon} />
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={styles.title}> 
                    Bằng {degree.degree_type === 0
                      ? "cử nhân"
                      : degree.degree_type === 1
                        ? "thạc sĩ"
                        : degree.degree_type === 2
                          ? "tiến sĩ"
                          : "bác sĩ"}
                  </Text>

                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Họ và tên: {degree.common_name}</Text>
                    <Text style={styles.infoText}>Ngành đào tạo: {degree.major_name}</Text>
                    <Text style={styles.infoText}>Hình thức đào tạo: Chính quy</Text>
                    <Text style={styles.infoText}>
                      Xếp loại tốt nghiệp:{" "}
                      {degree.gpa > 3.6
                        ? "Xuất sắc"
                        : degree.gpa > 3.2
                          ? "Giỏi"
                          : degree.gpa > 2.5
                            ? "Khá"
                            : degree.gpa > 2.0
                              ? "Trung bình"
                              : "Yếu"}
                    </Text>
                    <Text style={styles.infoText}>Ngày cấp bằng: {formatDate(degree.issued_at)}</Text>
                    <Text style={styles.serialNumber}>Số hiệu: {degree.serial_number}CT9X936T</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
      </ScrollView>


      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Image
          source={require("../../assets/icon/arrow-left.png")}
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 0,
    flex: 1,
    height: "100%",
  },
  content: {
    marginTop: 10,
    alignItems: "center",
  },
  card: {
    marginVertical: 10,
    alignSelf: "stretch",
    borderRadius: 20,
    justifyContent: "space-between",
    paddingVertical: 30,
    alignItems: "center",
    padding: 20,
    width: 450,
  },
  checkIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  statusContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  illustrationContainer: {
    alignItems: "center",
  },
  illustration: {
    width: 500,
    height: 150,
    resizeMode: "contain",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  backIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  backText: {
    fontSize: 22,
    color: "#3B5998",
    fontWeight: "bold",
  },
  infoContainer: {
    width: "100%", // Đảm bảo đồng đều
    alignSelf: "stretch",
    marginTop: 10,
  },
  infoText: {
    color: "#FFF",
    fontSize: 25,
    marginBottom: 10,
  },
  serialNumber: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 100,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 40,
    marginBottom: 30,
    textAlign: "left",
  },
  headerContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10, // Đảm bảo nó hiển thị trên cùng
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Hiển thị bóng trên Android
  },
  menuIcon: {
    width: 30,
    height: 30,
  },

});
