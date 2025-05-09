import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { RootStackParamList } from '../../utils/type.navigate'

type DegreeScreenProps = RouteProp< RootStackParamList , "Degree">;
export const DegreeScreen = () => {
  const route = useRoute<DegreeScreenProps>();
    const navigation = useNavigation();
    const {degree_name , issued_at, owner_name , major_name , status} = route.params;
  return (
<View style={styles.container}>
    <Image source={require("../../../assets/image/Logo_Huit.png")}>

    </Image>
    <LinearGradient colors={["#4C6AA9" , "#1B253A"]} style={styles.DegreeContainer}>
                    
                   {status == "valid" ? (
                    <View style={styles.ButtonContainer}>

                      <Image source={require("../../../assets/icon/check.png")}  style={{width:30 , height:30}}>
                      </Image>
                      <Text style={styles.Text}>Đã xác thực</Text>  
                    </View>
                    ) : status == "revoked" ? 
                    <View  style={styles.ButtonContainer}>
                      <Image source={require("../../../assets/icon/Cancel.png")}  style={{width:30 , height:30}}>
                      </Image>
                    <Text style={styles.Text}>Đã từ chối</Text>  
                    </View>
                     : 
                     <View  style={styles.ButtonContainer}>
                        <Image source={require("../../../assets/icon/Identification.png")}  style={{width:30 , height:30}}>
                        </Image>
                        <Text style={styles.Text}>Chưa xác thực</Text>
                     </View>
                     } 

                <View>
                    {/* Nội dung */}
                    <Text style={styles.title}>Bằng đại học : {degree_name}</Text>
                    <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Họ và tên: {owner_name}</Text>
                    <Text style={styles.infoText}>Ngày sinh: 10/09/2004</Text>
                    <Text style={styles.infoText}>
                        Ngành đào tạo: {major_name}
                    </Text>
                    <Text style={styles.infoText}>Hình thức đào tạo: Chính quy</Text>
                    <Text style={styles.infoText}>Xếp loại tốt nghiệp: Xuất sắc</Text>
                    <Text style={styles.infoText}>Ngày cấp bằng: 10/02/2025</Text>
                    <Text style={[styles.serialNumber  ]} >Số hiệu: CT9X936T</Text>
                    </View >
                </View>

            
    </LinearGradient>
            <TouchableOpacity style={styles.BackButton} onPress={() =>navigation.goBack()}>
                <Image source={require("../../../assets/icon/arrow-left.png")}  style={{width:30 , height:30}}></Image>
                <Text style={{color: "#3B5998" , fontWeight :"bold" , fontSize : 18}}>Quay lại</Text>
            </TouchableOpacity>
</View>
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        padding : 10,
    },
    DegreeContainer : {
        flex : 1,
        borderRadius : 10 ,
        margin :10,
        padding : 10,
        flexDirection : "column"
    },
    BackButton : {
        flexDirection : "row",
        alignItems :"center",
        marginLeft : 10,
        marginTop : 10
    },
    ButtonContainer:  {
        backgroundColor : "#FFFFFF",
        flexDirection :"row",
        alignItems :"center",
        borderRadius : 20,
        alignSelf :"flex-start",
        padding: 5
    },
    infoContainer: {
        alignSelf: "stretch",
        marginTop: 10,
      },
      infoText: {
        color: "#FFF",
        fontSize: 16,
        marginBottom: 5,
      },
    Text : {
        color : "#000" ,
        fontSize : 18, 
        fontWeight : "bold",
    },
    serialNumber: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
      },
      title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: 10,
        marginBottom: 10,
        textAlign :"center"
      },
})
