import { Image, Text, View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import ShareInput from "../components/ShareInput";
import ShareButton from "../components/ShareButton";
import { APP_COLOR } from "../utils/constant";
import { RootStackParamList } from "../utils/type.navigate";
import { createPinAPI } from "../utils/api";
import { pinSchema } from "../utils/validate.schema";

const LoginImage = require("../../assets/image/Login.png");

type NavigationProps = StackNavigationProp<RootStackParamList, "CreatePinScreen">;
type RouteProps = RouteProp<RootStackParamList, "CreatePinScreen">;


export const CreatePinScreen = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>(); 
    const { username} = route.params;  // Nhận username từ LoginScreen

    const handleCreatePin = async (pin: string) => {
        try {
            if (!username) {
                Alert.alert("Lỗi", "Không tìm thấy tài khoản đăng nhập.");
                return;
            }

            const response = await createPinAPI(username, pin);
            console.log(response);
            if (response) {
                await AsyncStorage.setItem("pin", pin);
                Alert.alert("Thành công", "Mã PIN đã được tạo thành công!");
                await AsyncStorage.multiSet([
                    ["username", username],
                ]);
                navigation.navigate("Home", { username, commonName: "defaultCommonName" });
            } else {
                Alert.alert("Lỗi", "Không thể tạo mã PIN.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo mã PIN.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Formik
                initialValues={{ pin: "" }}
                validationSchema={pinSchema}  // Thêm validation
                onSubmit={(values) => handleCreatePin(values.pin)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View>
                        <View style={styles.imageContainer}>
                            <Image source={LoginImage} style={styles.image} />
                        </View>

                        <View style={styles.title}>
                            <Text style={styles.text}>Tạo Mã PIN</Text>
                        </View>

                        <View style={{ padding: 28 }}>
                            <ShareInput
                                title="Nhập Mã PIN"
                                secureTextEntry
                                onChangeText={handleChange("pin")}
                                onBlur={handleBlur("pin")}
                                value={values.pin}
                                errors={errors.pin}
                            />
                        </View>

                        <ShareButton
                            name="Xác nhận"
                            onPress={handleSubmit}
                            textStyles={{ textTransform: "uppercase", color: "#fff", paddingVertical: 5 }}
                            pressStyles={{ alignSelf: "stretch" }}
                            btnStyles={{
                                backgroundColor: APP_COLOR.PRIMARY,
                                justifyContent: "center",
                                marginHorizontal: 50,
                                paddingVertical: 10,
                                borderRadius: 30,
                            }}
                        />
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 10,
    },
    title: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    image: {
        marginVertical: 20,
    },
    text: {
        fontSize: 36,
        fontWeight: "bold",
        fontFamily: "Poppins",
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
});
