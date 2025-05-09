import React, { useState, useRef } from 'react';
import { Alert, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ShareButton from '../components/ShareButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/type.navigate';
import { getPinAPI } from '../utils/api';  // Import API lấy mã PIN

type NavigationProps = StackNavigationProp<RootStackParamList, 'PinScreen'>;
type RouteProps = RouteProp<RootStackParamList, 'PinScreen'>;

export const PinScreen = () => {
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();
    const { username ,actionType} = route.params; // Nhận username từ màn hình trước
    const pinRefs = useRef([]);

    const handlePinChange = (value: string, index: number) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Tự động chuyển sang ô tiếp theo
        if (value && index < 5) {
            pinRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (event.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
            const newPin = [...pin];
            newPin[index - 1] = "";
            setPin(newPin);
            pinRefs.current[index - 1].focus();
        }
    };

    const handleComplete = async () => {
        const enteredPin = pin.join("").trim(); // Xóa khoảng trắng thừa
    
        if (!username) {
            Alert.alert("Lỗi", "Vui lòng nhập tên đăng nhập.");
            return;
        }
    
        try {
            const response = await getPinAPI(username); 
    
            if (!response.success) {
                Alert.alert("Lỗi", response.message || "Không thể lấy mã PIN.");
                return;
            }
    
            const serverPin = response.pin?.toString().trim();
    
            if (enteredPin === serverPin) {
                Alert.alert("✅ Thành công", "Mã PIN chính xác!");
                if (actionType === "certificate") {
                    navigation.navigate("Verification");
                  } else if (actionType === "history") {
                    navigation.navigate("CertificateHistory");
                  }
            } else {
                Alert.alert("❌ Lỗi", "Mã PIN không chính xác. Vui lòng thử lại.");
                setPin(["", "", "", "", "", ""]); 
                pinRefs.current[0].focus(); 
            }
        } catch (error) {
            console.error("❌ Lỗi API:", error);
            Alert.alert("Lỗi", "Không thể xác thực mã PIN.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nhập mã PIN của bạn</Text>
            <View style={styles.pinContainer}>
                {pin.map((p, index) => (
                    <TextInput
                        key={index}
                        ref={input => { pinRefs.current[index] = input; }}
                        style={styles.pinInput}
                        keyboardType="numeric"
                        secureTextEntry={true}
                        textContentType="oneTimeCode"
                        maxLength={1}
                        onChangeText={value => handlePinChange(value, index)}
                        onKeyPress={event => handleKeyPress(event, index)}
                        value={p}
                    />
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <ShareButton
                    name="Xác nhận"
                    onPress={handleComplete}
                    textStyles={styles.buttonText}
                    btnStyles={styles.confirmButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    pinInput: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 18,
        borderRadius: 100,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 50,
        alignItems: 'center',
    },
    buttonText: {
        textTransform: 'uppercase',
        color: '#fff',
        paddingVertical: 5,
    },
    confirmButton: {
        backgroundColor: '#3B5998',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
});

export default PinScreen;
