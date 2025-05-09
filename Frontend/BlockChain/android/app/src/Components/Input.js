import { TextInput, View, StyleSheet, Image } from "react-native";

export const Input = ({placeholder , icon}) => {
    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} placeholder={placeholder} placeholderTextColor="#C4C4C4"/>
            {icon && <Image source={icon} style={{ width: 20, height: 20 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical : 10
    },
    textInput: {
        flex: 1, 
        height: 40,
        borderRadius : 10,
        fontSize: 16,
        color: "#000"
    },
    
});
