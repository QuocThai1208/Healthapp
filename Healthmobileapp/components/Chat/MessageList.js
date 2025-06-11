import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper"
import MessageItem from "./MessageItem";

const MessageList = ({ messages, currentUser, scrollViewRef }) => {
    return (
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
        >
            {
                messages.map((message, index) => {
                    return (
                        <MessageItem currentUser={currentUser} message={message} key={index} />
                    )
                })
            }
        </ScrollView>
    )
}

export default MessageList;