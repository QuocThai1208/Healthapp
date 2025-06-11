import { Dimensions, View } from "react-native"
import { Text } from "react-native-paper";
import Styles from "./Styles";

const MessageItem = ({ message, currentUser }) => {
    const screenWidth = Dimensions.get('window').width;
    if (currentUser?.id === message?.userId) {
        return (
            <View style={[Styles.containerMessage, { marginRight: 12, }]}>
                <View style={{ width: screenWidth * 0.8 }} >
                    <View style={[Styles.messageBubble, { backgroundColor: '#BFEFFF', alignSelf: 'flex-end' }]}>
                        <Text>
                            {message.text}
                        </Text>
                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <View style={[Styles.containerMessage, { justifyContent: 'flex-start', marginLeft: 12 }]}>
                <View style={{ width: screenWidth * 0.8 }} >
                    <View style={[Styles.messageBubble, { backgroundColor: '#B0E2FF', alignSelf: 'flex-start' }]}>
                        <Text>
                            {message.text}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}
export default MessageItem;