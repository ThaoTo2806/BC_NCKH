import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../utils/type.navigate';
import { fetchDegree, UpdateDegree } from '../../utils/api';
type DegreeListRouteProp = RouteProp<RootStackParamList, "DegreeApprove">;
export const DegreeApprove = () => {
    const navigation = useNavigation();
    const route = useRoute<DegreeListRouteProp>();
    const [degreeList, setdegreeList] = useState([]);
    const [imageFront, setimageFront] = useState("");
    const [imageBack , setimageBack] = useState("");
    const {id , status, degree_image_front = {}, degree_image_back = "" } = route.params;
    const [showingFront , setshowingFront] = useState(true);
    const arrayBufferToBase64 = (buffer: number[]): string => {
      try {
        const binary = buffer.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
        const base64String = btoa(binary);
        return `data:image/jpeg;base64,${base64String}`;
      } catch (error) {
        console.error("Lỗi chuyển đổi arrayBufferToBase64:", error);
        return "";
      }
    };
  
    const Degrees = async (status: string) => {
      
      try {
        const res = await fetchDegree(status);
        setdegreeList(res.data.degrees);
      } catch (error) {
        console.error("Lỗi fetchDegree:", error);
      }
        };

    const handleAccept = async (status : String , id : number) =>{
      const result = await UpdateDegree(status , id);
      console.log("result :" , result );
    }
    const handleRevoked = async (status : String , id : number) =>{
      const result = await UpdateDegree(status , id);
      console.log("result :" , result );
    }
    
        useEffect(() => {
            console.log("Route Params:", route.params);
            console.log("degree_image_front:", degree_image_front);
            Degrees("pending");
        
            const loadImage = async () => {
            try {
                  if (degree_image_front) {
                  if (typeof degree_image_front === "string" && degree_image_front.startsWith("data:image")) {
                      setimageFront(degree_image_front);
                  } else if (degree_image_front.type === "Buffer" && Array.isArray(degree_image_front.data)) {
                      const base64ImageFront = arrayBufferToBase64(degree_image_front.data);
                      setimageFront(base64ImageFront);
                  } else if (degree_image_front.uri) {
                      setimageFront(degree_image_front.uri);
                  }
                }
        
        if (degree_image_back) {
        if (typeof degree_image_back === "string" && degree_image_back.startsWith("data:image")) {
            setimageBack(degree_image_back);
        } else if (degree_image_back.type === "Buffer" && Array.isArray(degree_image_back.data)) {
            const base64ImageBack = arrayBufferToBase64(degree_image_back.data);
            setimageBack(base64ImageBack);
        } else if (degree_image_back.uri) {
            setimageBack(degree_image_back.uri);
        }
        }
    } catch (error) {
        console.error("Lỗi tải ảnh:", error);
    }
};
      loadImage();
    }, [degree_image_front , degree_image_back]);
  
    return (
            <LinearGradient
          colors={["#3B5998", "#3B5998", "#ffffff"]}
          locations={[0, 0.3, 0.5]}
          style={styles.container}
        >
          <View style={styles.contentBox}>
           {/* Header */}
            <Text style={styles.headerText}>Thông tin bằng cấp</Text> 
           <View style={styles.imageDivider}>
                    <TouchableOpacity
                    onPress={() => setshowingFront(true)}
                    disabled={showingFront}
                    >
                        <Image source={require("../../../assets/icon/arrow-left.png")} style={styles.iconCircle} />
                    </TouchableOpacity>
             {/* Khung hiển thị ảnh */}
           <View style={styles.imageContainer}>
                   
                {
                showingFront ? 
                (imageFront ? 
                    <Image
                    source={{ uri: imageFront }}
                    style={styles.image}
                    resizeMode="contain"
                    onError={(e) => console.log("Lỗi hiển thị ảnh:", e.nativeEvent.error)}
                    />
                    :  <Text style={styles.imagePlaceholder}>Đang tải ảnh mặt trước...</Text>

                )  
                : (
                imageBack ?
                 <Image
                    source={{ uri: imageBack }}
                    style={styles.image}
                    resizeMode="contain"
                    onError={(e) => console.log("Lỗi hiển thị ảnh:", e.nativeEvent.error)}
                    />
                    : (
                    <Text style={styles.imagePlaceholder}>Đang tải ảnh mặt sau...</Text>
                )
                )
                
                }
                 
                </View>
                <TouchableOpacity 
                    onPress={() => setshowingFront(false)}
                    disabled={!showingFront}
                >
                    <Image source={require("../../../assets/icon/arrow-right.png")} style={styles.iconCircle} />
                    </TouchableOpacity>
           </View>
           
               
            
           
           {/* Duyệt cấp 2 */}
            <Text style={styles.reviewText}>*Duyệt cấp 2</Text>
           
            {/* Nút hành động */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept("valid" , id)}>
                <View style={styles.iconCircle}>
                  <Image source={require("../../../assets/icon/CheckMark.png")} />
                </View>
                <Text style={styles.buttonText}>Chấp nhận</Text>
              </TouchableOpacity>
             
              <TouchableOpacity style={styles.rejectButton}>
                <View style={styles.iconCircle}>
                  <Image source={require("../../../assets/icon/Cancel.png")} onPress={() => handleRevoked("revoked" , id)} />
                </View>
                <Text style={styles.buttonText}>Từ chối</Text>
              </TouchableOpacity>
            </View>
           
         
          {/* </View> */}
         
          {/* Nút quay lại */}
          <TouchableOpacity style={[styles.backButton , {alignSelf : "flex-start" ,  marginTop : 30, gap : 2}]} onPress={() => navigation.goBack()}>
            <View style={styles.backIconCircle}>
                
              <Image source={require("../../../assets/icon/arrow-left.png")} style={{width : 30 , height : 30 }} />
            </View>
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
          </View>
        </LinearGradient>

     
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        paddingTop: 40,
        paddingHorizontal: 20,
      },
      imageContainer: {
        width: "90%",
        height: 260,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection : "row",
        alignItems: "center",
        justifyContent: "center", 
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        overflow: "hidden", 
      },
      image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
      },
      contentBox: {
        width: '90%',
        height : 440,
        backgroundColor: '#F0F2F5',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3B5998",
        marginBottom: 20,
      },
      imagePlaceholder: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
      },
   

    imageDivider : {
        justifyContent : "space-between",
        flexDirection : "row",
        alignItems : "center"
    },
      reviewText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
        marginBottom: 15,
        fontStyle: "italic",
        alignSelf: 'flex-start',
      },
      buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
        paddingBottom : 10,
        justifyContent: 'center',
        width: '100%',
        gap: 15,
      },
      acceptButton: {
        flexDirection: "row",
        backgroundColor: "#3A5BA0",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
        alignItems: "center",
        gap: 5,
      },
      rejectButton: {
        flexDirection: "row",
        backgroundColor: "#3A5BA0",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
        alignItems: "center",
        gap: 5,
      },
      iconCircle: {
        borderRadius: 50,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: '500',
      },
      sizeIndicator: {
        backgroundColor: '#3A5BA0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        position: 'absolute',
        bottom: -12,
      },
      sizeText: {
        color: 'white',
        fontSize: 12,
      },
      backButton: {
        flexDirection: "row",
        alignItems: "center",
      },
      backIconCircle: {
        backgroundColor: '#E0E0E0',
        borderRadius: 50,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
      },
      backText: {
        color: "#3A5BA0",
        fontSize: 16,
        fontWeight: "bold",
      },
   
  });