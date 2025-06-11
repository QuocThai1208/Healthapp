import { StyleSheet } from "react-native";

export default StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    sectionContainer: {
        borderRadius: 20,
        backgroundColor: '#DCDCDC',
        alignSelf: 'flex-start',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        padding: 10,
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})