import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../utils/type.navigate';
import { getDegreeById, UpdateDegree } from '../../utils/api';

type DegreeListRouteProp = RouteProp<RootStackParamList, "DegreeApprove">;

export const DegreeApprove = () => {
    const navigation = useNavigation();
    const route = useRoute<DegreeListRouteProp>();
    const [degreeList, setdegreeList] = useState([]);
    const [imageFront, setimageFront] = useState("");
    const [imageBack , setimageBack] = useState("");
    const {id , status, degree_image_front = {}, degree_image_back = "" } = route.params;
    const [showingFront , setshowingFront] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const processImages = (degreeData) => {
      try {
        // Process front image
        if (degreeData?.frontImage && typeof degreeData.frontImage === 'string') {
          const frontUri = degreeData.frontImage.startsWith('data:image')
            ? degreeData.frontImage
            : `data:image/jpeg;base64,${degreeData.frontImage}`;
          setimageFront(frontUri);
        } else if (degreeData?.frontImage?.type === "Buffer" && Array.isArray(degreeData.frontImage.data)) {
          const base64ImageFront = arrayBufferToBase64(degreeData.frontImage.data);
          setimageFront(base64ImageFront);
        } else {
          setimageFront('');
        }

        // Process back image
        if (degreeData?.backImage && typeof degreeData.backImage === 'string') {
          const backUri = degreeData.backImage.startsWith('data:image')
            ? degreeData.backImage
            : `data:image/jpeg;base64,${degreeData.backImage}`;
          setimageBack(backUri);
        } else if (degreeData?.backImage?.type === "Buffer" && Array.isArray(degreeData.backImage.data)) {
          const base64ImageBack = arrayBufferToBase64(degreeData.backImage.data);
          setimageBack(base64ImageBack);
        } else {
          setimageBack('');
        }
      } catch (error) {
        console.error('Lỗi xử lý ảnh:', error);
      }
    };

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
  
    const Degrees = async (id: string) => {
      try {
        const res = await getDegreeById(id);
        setdegreeList(res.degree);
        processImages(res.degree);
      } catch (error) {
        console.error("Lỗi fetchDegree:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleAccept = async (status : string , id : number) =>{
      try {
        const result = await UpdateDegree(status , id);
        Alert.alert('Thông báo', 'Duyệt thành công');
        navigation.navigate('DegreeApproveList');
      } catch (error) {
        console.error("Lỗi duyệt:", error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi duyệt');
      }
    }

    const handleRevoked = async (status : string , id : number) =>{
      try {
        const result = await UpdateDegree(status , id);
        Alert.alert('Thông báo', 'Từ chối thành công');
        navigation.navigate('DegreeApproveList');
      } catch (error) {
        console.error("Lỗi từ chối:", error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi từ chối');
      }
    }
    
    useEffect(() => {
      Degrees(String(id));
    }, [id]);
  
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
                {isLoading ? (
                  <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#3B5998" />
                    <Text style={styles.imagePlaceholder}>Đang tải ảnh...</Text>
                  </View>
                ) : (
                  showingFront ? 
                  (imageFront ? 
                      <Image
                      source={{ uri: imageFront }}
                      style={styles.image}
                      resizeMode="contain"
                      onError={(e) => console.log("Lỗi hiển thị ảnh:", e.nativeEvent.error)}
                      />
                      :  <Text style={styles.imagePlaceholder}>Không có ảnh mặt trước</Text>
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
                      <Text style={styles.imagePlaceholder}>Không có ảnh mặt sau</Text>
                  )
                  )
                )}
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
             
              <TouchableOpacity 
                style={styles.rejectButton} 
                onPress={() => handleRevoked("revoked" , id)}
              >
                <View style={styles.iconCircle}>
                  <Image source={require("../../../assets/icon/Cancel.png")} />
                </View>
                <Text style={styles.buttonText}>Từ chối</Text>
              </TouchableOpacity>
            </View>
           
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

export default DegreeApprove;
