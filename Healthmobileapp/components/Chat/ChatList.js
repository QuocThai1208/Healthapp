import { FlatList, View } from "react-native"
import ChatItem from "./ChatItem";
import Styles from "./Styles";

const ChatList = ({ users }) => {

    return (
        <View style={Styles.container}>
            <FlatList
                data={users}
                contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
                keyExtractor={item => item.userId}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => <ChatItem
                    item={item}
                    index={index} />}
            />
        </View>
    )
}

export default ChatList;