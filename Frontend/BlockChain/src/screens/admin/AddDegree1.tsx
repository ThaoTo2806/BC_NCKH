import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {APP_COLOR, LIST_DEGREE_TYPE, LIST_MAJOR} from '../../utils/constant';
import ShareButton from '../../components/ShareButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import ShareInput from '../../components/ShareInput';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../utils/type.navigate';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {AddDegree1Schema, RegisterSchema1} from '../../utils/validate.schema';
import ShareSelect from '../../components/ShareSelectedBox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.PRIMARY,
  },
  card: {
    backgroundColor: '#D3D3D3',
    height: 660,
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
});

type NavigationProps = StackNavigationProp<RootStackParamList, 'AddDegree1'>;

const AddDegree1 = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();

  const {id} = route.params;

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
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Formik
        validationSchema={AddDegree1Schema}
        initialValues={{
          major_id: '',
          degree_name: '',
          degree_type: '',
          graduation_year: '',
          gpa: '',
          hash_qrcode: '',
        }}
        onSubmit={values =>
          handleAddDegree1(
            values.major_id,
            values.degree_name,
            values.degree_type,
            values.graduation_year,
            values.gpa,
            values.hash_qrcode,
          )
        }>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
        }) => (
          <View style={styles.container}>
            <View style={{backgroundColor: APP_COLOR.PRIMARY, height: '30%'}}>
              <Text style={styles.text}>Thêm bằng cấp</Text>
            </View>
            <View style={{backgroundColor: '#ffffff', height: '70%'}} />
            <View style={styles.card}>
              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  Chọn ngành
                </Text>
                <ShareSelect
                  title="Chọn ngành học"
                  options={LIST_MAJOR}
                  selectedId={
                    values.major_id ? Number(values.major_id) : undefined
                  }
                  onSelect={value => setFieldValue('major_id', String(value))}
                  errors={errors.major_id}
                />
              </View>

              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  Tên bằng
                </Text>
                <ShareInput
                  title="Tên bằng"
                  onChangeText={handleChange('degree_name')}
                  onBlur={handleBlur('degree_name')}
                  value={values.degree_name}
                  errors={errors.degree_name}
                />
              </View>

              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  Loại bằng
                </Text>
                <ShareSelect
                  title="Chọn loại bằng"
                  options={LIST_DEGREE_TYPE}
                  selectedId={
                    values.degree_type ? Number(values.degree_type) : undefined
                  }
                  onSelect={value =>
                    setFieldValue('degree_type', String(value))
                  }
                  errors={errors.degree_type}
                />
              </View>

              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  Năm tốt nghiệp
                </Text>
                <ShareInput
                  title="Năm tốt nghiệp"
                  onChangeText={handleChange('graduation_year')}
                  onBlur={handleBlur('graduation_year')}
                  value={values.graduation_year}
                  errors={errors.graduation_year}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  GPA
                </Text>

                <ShareInput
                  title="gpa"
                  onChangeText={handleChange('gpa')}
                  onBlur={handleBlur('gpa')}
                  value={values.gpa}
                  errors={errors.gpa}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  QR_Code
                </Text>

                <ShareInput
                  title="hash_qrcode"
                  onChangeText={handleChange('hash_qrcode')}
                  onBlur={handleBlur('hash_qrcode')}
                  value={values.hash_qrcode}
                  errors={errors.hash_qrcode}
                />
              </View>

              <ShareButton
                name="Tiếp theo"
                onPress={handleSubmit}
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
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default AddDegree1;
