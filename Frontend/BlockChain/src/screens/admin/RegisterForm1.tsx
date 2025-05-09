import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/type.navigate";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { StyleSheet, Text, View } from "react-native";
import ShareInput from "../../components/ShareInput";
import ShareButton from "../../components/ShareButton";
import { APP_COLOR } from "../../utils/constant";
import { RegisterSchema1 } from "../../utils/validate.schema";




type NavigationProps = StackNavigationProp<RootStackParamList, 'RegisterForm1'>;


export const RegisterForm1 = () => {
    const navigation = useNavigation<NavigationProps>();

    // const [loading, setLoading] = useState<boolean>(false)


    const handleRegister = async (username: string, password: string) => {

        console.log("Register")

    }
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
                onSubmit={(values) => console.log(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

                    <View style={styles.container}>
                        <View style={{ backgroundColor: APP_COLOR.PRIMARY, height: "30%", alignItems: "center", justifyContent: "center" }}>
                            <Text style={styles.text}>Đăng ký danh tính</Text>
                        </View>
                        <View style={{ backgroundColor: "#ffffff", height: "70%" }} />
                        <View style={styles.card}>
                            <ShareInput
                                title="Common Name"
                                onChangeText={handleChange('commonName')}
                                onBlur={handleBlur('commonName')}
                                value={values.commonName}
                                errors={errors.commonName}
                            />
                            <ShareInput
                                title="Organization"
                                onChangeText={handleChange('organization')}
                                onBlur={handleBlur('organization')}
                                value={values.organization}
                                errors={errors.organization}
                            />
                            <ShareInput
                                title="Organization Unit"
                                onChangeText={handleChange('organizationUnit')}
                                onBlur={handleBlur('organizationUnit')}
                                value={values.organizationUnit}
                                errors={errors.organizationUnit}
                            />
                            <ShareInput
                                title="Country"
                                onChangeText={handleChange('country')}
                                onBlur={handleBlur('country')}
                                value={values.country}
                                errors={errors.country}
                            />
                            <ShareInput
                                title="State or Province"
                                onChangeText={handleChange('state')}
                                onBlur={handleBlur('state')}
                                value={values.state}
                                errors={errors.state}
                            />
                            <ShareInput
                                title="Locality"
                                onChangeText={handleChange('locality')}
                                onBlur={handleBlur('locality')}
                                value={values.locality}
                                errors={errors.locality}
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
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.PRIMARY,
    },
    card: {
        backgroundColor: "#D3D3D3",
        height: 627,
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        padding: 28,
        borderRadius: 20,
    },
    text: {
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