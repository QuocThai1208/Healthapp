import { StyleSheet } from "react-native";

export default StyleSheet.create({
    forntImage: {
        height: 150,
        width: '100%',
        marginVertical: 5,
        borderRadius: 20,
        resizeMode: "cover"
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 700,
    },
    imageExcercise: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    circle: {
        width: 80,
        height: 80,
        borderColor: "#00CCFF",
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
    },
    mb: {
        marginBottom: 10,
    },
    bold: {
        fontWeight: "bold",
        fontSize: 18,
        color: "black"
    },
    fontInput: {
        marginHorizontal: 5,
        width: 150,
        backgroundColor: 'transparent',
        opacity: 0.5,
        backgroundColor: "white",

    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 5,
        backgroundColor: "#00CCFF",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    active: {
        position: 'absolute',
        right: 0,
        backgroundColor: '#FA8072',
        marginRight: 10,
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    rowBack: {
        backgroundColor: "#DC143C",
        borderRadius: 20,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    deleteButton: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageTextContainer: {
        marginLeft: 30,
    },
    imageTitle: {
        marginBottom: 15,
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
    },
    imageSubtitle: {
        color: 'white',
        marginBottom: 5,
    },
    imageDuration: {
        color: '#00CCFF',
    },
    sectionContainer: {
        marginHorizontal: 10,
        flex: 1,
    },
    sectionTitle: {
        color: '#36648B',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    sessionCard: {
        marginVertical: 5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    sessionDay: {
        marginBottom: 5,
        color: '#36648B',
    },
    sessionName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        borderColor: 'black',
        borderWidth: 1,
    },
    textButtonBold: {
        color: 'white',
        fontWeight: 'bold'
    },
    addButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 10,
    },

    addButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#00CCFF',
    },
    carSessiondEdit: {
        marginVertical: 5,
        backgroundColor: 'white',
        height: 70,
        padding: 10,
        justifyContent: 'center'
    },
    checkboxWrapper: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 50,
    },

    checkboxContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },

    bottomButtonBar: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        padding: 10,
        width: '100%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        backgroundColor: 'white',
    },

    buttonWhiteOutline: {
        width: '49%',
        backgroundColor: 'white',
        borderColor: "black",
        borderWidth: 1,
    },
    workoutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },

    cardContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginVertical: 10,
    },

    cardRow: {
        flex: 1,
        paddingHorizontal: 10,
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
    },

    cardHalf: {
        alignItems: 'center',
        width: '48%',
    },

    cardContentCenter: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 5,
    },

    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
    },

    progressTitle: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },

    progressSubtitle: {
        color: '#36648B',
    },

    feedbackLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },

    feedbackInput: {
        backgroundColor: 'white',
        height: 100,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },

    infoRow: {
        margin: 10,
        flexDirection: "row",
    },

    dateHeader: {
        backgroundColor: '#F8F8FF',
        height: 30,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },

    entryRow: {
        backgroundColor: 'white',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
});