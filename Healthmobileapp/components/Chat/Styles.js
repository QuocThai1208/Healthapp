import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#6495ED',
        paddingBottom: 20,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30
    },
    headerTitle: {
        fontSize: 26,
        color: 'white',
        fontWeight: '600'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    containerChatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginHorizontal: 16,
        paddingBottom: 8,
        borderColor: '#CDC9C9'
    },
    avatarChatItem: {
        width: 60,
        height: 60,
        borderRadius: 100
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10,
        gap: 1
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#4F4F4F'
    },
    time: {
        fontSize: 16,
        fontWeight: '400',
        color: '#8B8B83'
    },
    lastMessage: {
        fontSize: 16,
        fontWeight: '400',
        color: '#8B8B83'
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'white'
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-between',
        overflow: 'visible'
    },
    inputAreaWrapper: {
        marginBottom: 17,
        paddingTop: 8
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 100,
        overflow: 'hidden',
        marginHorizontal: 12
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        height: 45
    },
    sendButton: {
        backgroundColor: '#E8E8E8',
        borderRadius: 100,
        padding: 8,
        margin: 4
    },
    containerMessage: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8
    },
    messageBubble: {
        flex: 1,
        borderRadius: 100,
        padding: 12,
    },
})