import React,{ useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_COLOR, LIST_DEGREE_TYPE, LIST_MAJOR } from '../../utils/constant';
import ShareButton from '../../components/ShareButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import ShareInput from '../../components/ShareInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/type.navigate';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { AddDegree1Schema, RegisterSchema1 } from '../../utils/validate.schema';
import ShareSelect from '../../components/ShareSelectedBox';
import { getDegreeById, getInfor } from '../../utils/api';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import moment from 'moment';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.PRIMARY,
  },
  card: {
    backgroundColor: '#D3D3D3',
    height: 750,
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 28,
    borderRadius: 20,
    gap: 20,
  },
  text: {
    position: 'absolute',
    left: 40,
    top: 60,
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 100,
    left: 40,
    right: 40,
    zIndex: 2,
  },
  button: {
    backgroundColor: APP_COLOR.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 10,
    width: 150,
  },
  buttonText: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 3,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    resizeMode: 'contain',
  },
  backText: {
    fontSize: 18,
    color: APP_COLOR.PRIMARY,
    fontWeight: 'bold',
  },
  label: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
});

type NavigationProps = StackNavigationProp<RootStackParamList, 'AddDegree1'>;

const AddDegree1 = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const { id, dob, commonName } = route.params;

  const handleAddDegree1 = (
    major_id: string,
    degree_name: string,
    degree_type: string,
    graduation_year: string,
    gpa: string,
    hash_qrcode: string,
  ) => {
    console.log('major_id: ', major_id);
    console.log('degree_name: ', degree_name);
    console.log('degree_type: ', degree_type);
    console.log('graduation_year: ', graduation_year);
    console.log('gpa: ', gpa);
    navigation.navigate('AddDegree', {
      id,
      major_id,
      degree_name,
      degree_type,
      graduation_year,
      gpa,
      hash_qrcode,
      imageFrontUri: selectedImage?.uri,
      imageFrontName: selectedImage?.fileName,
    });
  };
  const compareWithAccents = (str1: string, str2: string) => {
    return str1.toLowerCase() === str2.toLowerCase();
  };
  const handleUploadAndExtract = async (setFieldValue: any) => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh!');
        return;
      }
  
      const selectedFile = response.assets?.[0];
      if (!selectedFile) {
        Alert.alert('Lỗi', 'Không có ảnh được chọn!');
        return;
      }
  
      // 👉 Lưu ảnh vào state
      setSelectedImage(selectedFile);
  
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.fileName,
      });
  
      try {
        const res = await axios.post('http://blockchain.onlineai.vn:6000/process', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const data = res.data?.results?.[0]?.info;
        console.log("data",data);
        console.log("name",commonName);
        
        const formattedDob = moment(dob).format('DD/MM/YYYY');
        console.log("dob",formattedDob);
        var major_id = null;
        let degree_type = null;
        if (data.DOBDegree === formattedDob && compareWithAccents(data.NameDegree, commonName)) {
          
          
          if(compareWithAccents(data.LoaiBang, "BẰNG CỬ NHÂN")){
            degree_type=0;
          }else if(compareWithAccents(data.LoaiBang, "BẰNG KỸ SƯ")){
            degree_type=3;
          }else if(compareWithAccents(data.LoaiBang, "BẰNG THẠC SĨ")){
            degree_type=1;
          }
          else if(compareWithAccents(data.LoaiBang, "BẰNG TIẾN SĨ")){
            degree_type=2;
          }
          console.log("loaibang",degree_type);
          
          

          if(compareWithAccents(data.Nganh, "Công nghệ thông tin")){
            major_id=2;
          }else if(compareWithAccents(data.Nganh, "Khoa học máy tính")){
            major_id=1;
          }else if(compareWithAccents(data.Nganh, "Kế toán")){
            major_id=3;
          }
          else if(compareWithAccents(data.Nganh, "Quản trị kinh doanh")){
            major_id=4;
          }
          else if(compareWithAccents(data.Nganh, "Tài chính kế toán")){
            major_id=5;
          }
          console.log("nganh hoc",major_id);

          

          setFieldValue('major_id', major_id);
          setFieldValue('degree_name', data.LoaiBang);
          setFieldValue('graduation_year', data.NamTotNghiep);
          setFieldValue('gpa', data.gpa || '');
          setFieldValue('hash_qrcode', data.SoHieu);
          setFieldValue('xeploai', data.LoaiTotNghiep);
          setFieldValue('degree_type', degree_type.toString());

          Alert.alert('Thành công', 'Lấy thông tin từ ảnh thành công!');
        } else {
          Alert.alert('Lỗi', 'Thông tin không khớp với danh tính!');
        }
  
      } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể xử lý ảnh!');
      }
    });
  };
  
  const handleSubmitWithComparison = async (values: any) => {
    
    try {
      const res = await getInfor();     

        handleAddDegree1(
          values.major_id,
          values.degree_name,
          values.degree_type,
          values.graduation_year,
          values.gpa,
          values.hash_qrcode,
        );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu bằng cấp');
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        validationSchema={AddDegree1Schema}
        initialValues={{
          major_id: '',
          degree_name: '',
          degree_type: '',
          graduation_year: '',
          gpa: '',
          hash_qrcode: '',
          xeploai: '',
        }}
        onSubmit={values => handleSubmitWithComparison(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
        }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={80}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ backgroundColor: APP_COLOR.PRIMARY, height: 150, justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
                  Thêm bằng cấp
                </Text>
              </View>

              <View style={{ paddingHorizontal: 20, marginTop: -30 }}>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    padding: 20,
                    borderRadius: 15,
                    elevation: 3,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#4caf50',
                      padding: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                    onPress={() => handleUploadAndExtract(setFieldValue)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Upload ảnh lấy thông tin</Text>
                  </TouchableOpacity>

                  <Text style={styles.label}>Loại bằng</Text>
                  <ShareSelect
                    title="Chọn loại bằng"
                    options={LIST_DEGREE_TYPE}
                    selectedId={values.degree_type ? Number(values.degree_type) : undefined}
                    onSelect={value => setFieldValue('degree_type', String(value))}
                    errors={errors.degree_type}
                  />

                  <Text style={styles.label}>Chọn chuyên ngành học</Text>
                  <ShareSelect
                    title="Chọn chuyên ngành học"
                    options={LIST_MAJOR}
                    selectedId={values.major_id ? Number(values.major_id) : undefined}
                    onSelect={value => setFieldValue('major_id', String(value))}
                    errors={errors.major_id}
                  />

                  <Text style={styles.label}>Tên bằng</Text>
                  <ShareInput
                    title="Tên bằng"
                    onChangeText={handleChange('degree_name')}
                    onBlur={handleBlur('degree_name')}
                    value={values.degree_name}
                    errors={errors.degree_name}
                  />

                  <Text style={styles.label}>Năm tốt nghiệp</Text>
                  <ShareInput
                    title="Năm tốt nghiệp"
                    onChangeText={handleChange('graduation_year')}
                    onBlur={handleBlur('graduation_year')}
                    value={values.graduation_year}
                    errors={errors.graduation_year}
                  />

                  <Text style={styles.label}>Xếp loại</Text>
                  <ShareInput
                    title="Xếp loại"
                    onChangeText={handleChange('xeploai')}
                    onBlur={handleBlur('xeploai')}
                    value={values.xeploai}
                    errors={errors.xeploai}
                  />

                  <Text style={styles.label}>QR Code</Text>
                  <ShareInput
                    title="hash_qrcode"
                    onChangeText={handleChange('hash_qrcode')}
                    onBlur={handleBlur('hash_qrcode')}
                    value={values.hash_qrcode}
                    errors={errors.hash_qrcode}
                  />

                  <Text style={styles.label}>GPA</Text>
                  <ShareInput
                    title="gpa"
                    onChangeText={handleChange('gpa')}
                    onBlur={handleBlur('gpa')}
                    value={values.gpa}
                    errors={errors.gpa}
                  />

                  <ShareButton
                    name="Tiếp theo"
                    onPress={handleSubmit}
                    textStyles={{
                      textTransform: 'uppercase',
                      color: '#fff',
                      paddingVertical: 5,
                    }}
                    pressStyles={{ alignSelf: 'stretch' }}
                    btnStyles={{
                      backgroundColor: APP_COLOR.PRIMARY,
                      justifyContent: 'center',
                      marginTop: 20,
                      paddingVertical: 10,
                      borderRadius: 30,
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};


export default AddDegree1;
