import { StyleSheet } from "react-native";

export default StyleSheet.create({
    table: {
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    header: {
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        paddingVertical: 10,
        justifyContent: 'center',
    },
    inputRow: {
        flexDirection: "row",
        padding: 6,
        marginBottom: 5,
        justifyContent: "space-between",
    },
    inputBox: {
        backgroundColor: "white",
        width: '49%',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "600",
        alignSelf: 'center',
        marginVertical: 10

    },
    chartStyle: {
        borderRadius: 16,
    },
});

export const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726",
    },
};
