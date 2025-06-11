import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginTop: 150,
        marginBottom: 30,
        textAlign: "center",
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eaeaea",
        backgroundColor: "#fafafa",
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    avatarView: {
        marginVertical: 10,
    },
    usernameText: {
        fontSize: 25,
        fontWeight: "500",
        marginBottom: 5,
    },
    ageText: {
        fontSize: 15,
    },
    segmentedContainer: {
        marginTop: 10,
        marginHorizontal: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    drawerContainer: {
        backgroundColor: 'white',
        height: '100%',
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    fontText: {
        fontSize: 18
    },
    fontTextGoogleFit: {
        fontSize: 16,
        fontWeight: 600
    },
    fontItem: {
        marginVertical: 10,
        marginLeft: 15,
    },
    healthModal: {
        backgroundColor: 'white',
        width: '85%',
        height: '85%',
        paddingTop: 10,
    },
    centerView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    button: {
        backgroundColor: "#3897f1",
        position: 'absolute',
        bottom: 0,
        right: 0
    }


});