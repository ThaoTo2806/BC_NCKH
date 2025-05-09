import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { RootStackParamList } from "../../utils/type.navigate";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchDegree } from "../../utils/api";

// Định nghĩa kiểu dữ liệu cho bằng cấp
interface DegreeProps {
  id : number,
  owner_name : String,
  major_name: String,
  degree_name : String,
  issued_at: String,
  status : String,
  degree_image_front : Blob,
  degree_image_back : Blob,
}

// Định nghĩa kiểu navigation
type DegreeListNavigationProp = StackNavigationProp<RootStackParamList, "DegreeApprove">;
type DegreeListRouteProp = RouteProp<RootStackParamList, "DegreeApprove">;

export const DegreeAproveListScreen= () => {
  const navigation = useNavigation<DegreeListNavigationProp>();
  const route = useRoute<DegreeListRouteProp>();
  
  const [degreeList, setDegreeList] = useState<DegreeProps[]>([]);

  const Degrees = async (status: string) => { 
    try {
      const res = await fetchDegree(status);
      console.log("result : " , res);
      setDegreeList(res.data.degrees || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    Degrees("pending");
  }, [degreeList]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {degreeList.length > 0 ? (
        degreeList.map((degree, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate("DegreeApprove", 
              {
              id : degree.id,
              degree_name: degree.degree_name,
              issued_at: degree.issued_at,
              owner_name : degree.owner_name,
              major_name: degree.major_name,
              status : degree.status,
              degree_image_front: degree.degree_image_front,
              degree_image_back: degree.degree_image_back,
            }
          )}
          >
            <Text style={styles.cardTitle}>{degree.degree_name}</Text>
            <Text style={styles.cardText}>
              Thời gian: {new Date(degree.issued_at).toLocaleDateString("vi-VN")}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <TouchableOpacity style={styles.card}>
          <Text style={[styles.cardText, { textAlign: "center" }]}>
            Không có dữ liệu
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    marginTop: 10,
    backgroundColor: "#3B5998",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  cardText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 7,
  },
});

export default DegreeAproveListScreen;
