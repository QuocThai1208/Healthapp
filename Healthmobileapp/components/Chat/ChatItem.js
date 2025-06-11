import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Image } from "react-native";
import { FlatList, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper";
import { formatDate, getRoomId } from "../../utils/common";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { MyUserContext } from "../../configs/Contexts";
import { db } from "../../firebaseConfig";
import Styles from "./Styles";

const ChatItem = ({ item }) => {
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [lastMessage, setLastMessage] = useState(undefined);


    useEffect(() => {
        let roomId = getRoomId(user?._j?.id, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        const q = query(messageRef, orderBy('createdAt', 'desc'));

        //lấy dữ liệu ngay khi có thay đổi trên db
        let unsub = onSnapshot(q, (snapshot) => {
            let allMessage = snapshot.docs.map(doc => {
                return doc.data();
            });
            setLastMessage(allMessage[0] ? allMessage[0] : null)
        });

        return unsub;
    }, [])

    const renderTime = () => {
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    }

    const renderLastMessage = () => {
        if (typeof lastMessage === 'undefined') return 'Loading...';
        if (lastMessage) {
            if (user?._j?.id === lastMessage?.userId) return "Bạn: " + lastMessage?.text;
            return lastMessage?.text;
        }
        else {
            return 'Hãy nói xin chào...';
        }
    }

    return (
        <TouchableOpacity
            onPress={() => nav.navigate("chatRoom", { "item": item })}
            style={Styles.containerChatItem} >
            <Image style={Styles.avatarChatItem} source={{ uri: item.avatar }} />

            <View style={Styles.infoContainer}>
                <View style={Styles.topRow}>
                    <Text style={Styles.username}>{item.username}</Text>
                    <Text style={Styles.time}>{renderTime()}</Text>
                </View>
                <Text style={Styles.lastMessage}>{renderLastMessage()}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatItem;