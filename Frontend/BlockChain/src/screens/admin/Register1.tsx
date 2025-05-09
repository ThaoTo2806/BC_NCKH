import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { APP_COLOR } from '../../utils/constant';
import ShareButton from '../../components/ShareButton';
import { useNavigation } from '@react-navigation/native';
import ShareInput from '../../components/ShareInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/type.navigate';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { RegisterSchema1 } from '../../utils/validate.schema';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.PRIMARY,
    },
    card: {
        backgroundColor: "#D3D3D3",
        height: 660,
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        padding: 28,
        borderRadius: 20,
        gap: 20,
    },
    text: {
        position: "absolute",
        left: 40,
        top: 60,
        fontSize: 40,
        fontWeight: "700",
        fontFamily: "Poppins",
        color: "#ffffff",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 100,
        left: 40,
        right: 40,
        zIndex: 2,
    },
    button: {
        backgroundColor: APP_COLOR.PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 30,
        flex: 1,
        marginHorizontal: 10,
        width: 150,
    },
    buttonText: {
        textTransform: "uppercase",
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        position: "absolute",
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

type NavigationProps = StackNavigationProp<RootStackParamList, 'Register1'>;

const Register1 = () => {
    const navigation = useNavigation<NavigationProps>();

    const handleRegister1 = (common_name: string, organization: string, organizational_unit: string, country: string, state: string, locality: string) => {
        console.log('Common Name: ', common_name);
        console.log('Organization: ', organization);
        console.log('Organization Unit: ', organizational_unit);
        console.log('Country: ', country);
        console.log('State or Province: ', state);
        console.log('Locality: ', locality);
        navigation.navigate('Register2', {
            common_name: common_name,
            organization: organization,
            organizational_unit: organizational_unit,
            country: country,
            state: state,
            locality: locality,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Formik
                validationSchema={RegisterSchema1}
                initialValues={{
                    common_name: '',
                    organization: '',
                    organizational_unit: '',
                    country: '',
                    state: '',
                    locality: '',
                }}
                onSubmit={(values) => handleRegister1(values.common_name, values.organization, values.organizational_unit, values.country, values.state, values.locality)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View style={styles.container}>
                        <View style={{ backgroundColor: APP_COLOR.PRIMARY, height: "30%" }}>
                            <Text style={styles.text}>Đăng ký danh tính</Text>
                        </View>
                        <View style={{ backgroundColor: "#ffffff", height: "70%" }} />
                        <View style={styles.card}>
                            <View >
                                <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: 600 }}>Tên danh tính</Text>
                                <ShareInput
                                    title="Common Name"
                                    onChangeText={handleChange('common_name')}
                                    onBlur={handleBlur('common_name')}
                                    value={values.common_name}
                                    errors={errors.common_name}
                                />
                            </View>

                            <View >
                                <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: 600 }}>Tổ chức</Text>
                                <ShareInput
                                    title="Organization"
                                    onChangeText={handleChange('organization')}
                                    onBlur={handleBlur('organization')}
                                    value={values.organization}
                                    errors={errors.organization}
                                />
                            </View>

                            <View >
                                <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: 600 }}>Đơn vị</Text>
                                <ShareInput
                                    title="Organization Unit"
                                    onChangeText={handleChange('organizational_unit')}
                                    onBlur={handleBlur('organizational_unit')}
                                    value={values.organizational_unit}
                                    errors={errors.organizational_unit}
                                />
                            </View>

                            <View >
                                <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: 600 }}>Quốc gia</Text>
                                <ShareInput
                                    title="Country"
                                    onChangeText={handleChange('country')}
                                    onBlur={handleBlur('country')}
                                    value={values.country}
                                    errors={errors.country}
                                />
                            </View>
                            <View >
                                <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: 600 }}>Tỉnh hoặc Thành Phố</Text>

                                <ShareInput
                                    title="State or Province"
                                    onChangeText={handleChange('state')}
                                    onBlur={handleBlur('state')}
                                    value={values.state}
                                    errors={errors.state}
                                />
                            </View>
                            <View >
                                <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: 600 }}>Địa phươnng</Text>

                                <ShareInput
                                    title="Locality"
                                    onChangeText={handleChange('locality')}
                                    onBlur={handleBlur('locality')}
                                    value={values.locality}
                                    errors={errors.locality}
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
                                pressStyles={{ alignSelf: 'stretch' }}
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

export default Register1;