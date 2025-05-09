import { StyleSheet, Text, TouchableOpacity } from "react-native"

export const Button = ({ title, type }) => {
    return (
        <TouchableOpacity
            style={[styles.button, type === "primary" ? styles.primary : styles.secondary]}
        >
            <Text style={[styles.text, type === "primary" ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        justifyContent: "center",
        marginVertical: 5
    },
    primary: {
        backgroundColor: "#3B5998",
        color: "#fff",
        borderRadius: 5
    },
    secondary: {
        backgroundColor: "#fff",
        color: "#3B5998",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#3B5998"
    },
    textPrimary: {
        fontWeight: "semibold",
        color: "#fff"
    },
    textSecondary: {
        fontWeight: "semibold",
        color: "#3B5998"
    }
})