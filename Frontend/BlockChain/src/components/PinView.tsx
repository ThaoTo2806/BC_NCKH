import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ReactNativePinView from 'react-native-pin-view';

// Forward ref để có thể dùng ref từ parent
export const PinViewInterface = forwardRef<
    ReactNativePinView,
    { oncomplete: (value: string) => void }
>(({ oncomplete }, ref) => {
    const pinViewRef = useRef<ReactNativePinView>(null);

    useImperativeHandle(ref, () => ({
        clearAll: () => pinViewRef.current?.clearAll(),
    }));
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nhập vào mã pin</Text>
            <ReactNativePinView
                ref={pinViewRef}
                buttonTextStyle={{ color: "#000" }}
                pinLength={6}
                onValueChange={oncomplete}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    }
});