import { useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Alert, Keyboard, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { Image } from "react-native";
import { Text, TextInput } from "react-native-paper";
import MessageList from "./MessageList";
import CustomKeyboarView from "./CustomKeyboarView";
import { MyUserContext } from "../../configs/Contexts";
import { getRoomId } from "../../utils/common";
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Styles from "./Styles";

const ChatRoom = ({ route }) => {
    const item = route.params?.item
    const nav = useNavigation();
    const [messages, setMessages] = useState([]);
    const user = useContext(MyUserContext);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);


    useLayoutEffect(() => {
        nav.setOptions({
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TouchableOpacity onPress={() => nav.goBack()}>
                        <Ionicons name="chevron-back-outline" size={24} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, margin: 10 }}>
                        <Image style={{ height: 40, width: 40, borderRadius: 100, marginRight: 5 }} source={{ uri: item.avatar }} />
                        <Text style={{ fontSize: 18, fontWeight: 500 }}>{item.username}</Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="call" size={24} color='#737373' />
                    <Ionicons name="videocam" size={24} color='#737373' />
                </View>
            )
        })
    }, [])

    useEffect(() => {
        createRoomIfNoteExists();

        let roomId = getRoomId(user?._j?.id, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        const q = query(messageRef, orderBy('createdAt', 'asc'));

        //lấy dữ liệu ngay khi có thay đổi trên db
        let unsub = onSnapshot(q, (snapshot) => {
            let allMessage = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessages([...allMessage])
        });

        const KeyBoarDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )

        return () => {
            unsub;
            KeyBoarDidShowListener.remove();
        }
    }, [])

    useEffect(() => {
        updateScrollView();
    }, [messages])

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true })
        }, 100)
    }

    const createRoomIfNoteExists = async () => {
        let roomId = getRoomId(user?._j?.id, item?.userId);
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const hanldeSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let roomId = getRoomId(user?._j?.id, item?.userId);
            const docRef = doc(db, "rooms", roomId);
            const messageRef = collection(docRef, "messages");

            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();

            const newDoc = await addDoc(messageRef, {
                userId: user?._j?.id,
                text: message,
                avatar: user?._j?.avatar,
                senderName: user?._j?.username,
                createdAt: Timestamp.fromDate(new Date())
            });

        } catch (err) {
            Alert.alert("Message", err.message);
        }
    }

    return (
        <CustomKeyboarView inChat={true}>
            <View style={Styles.wrapper}>
                <StatusBar style="dark" />
                <View style={Styles.innerContainer}>
                    <View style={Styles.container}>
                        <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user?._j} />
                    </View>
                    <View style={Styles.inputAreaWrapper}>
                        <View style={Styles.inputRow}>
                            <TextInput
                                ref={inputRef}
                                onChangeText={(t) => textRef.current = t}
                                placeholder="Nhập tin nhắn..."
                                style={Styles.input}
                            />
                            <TouchableOpacity onPress={hanldeSendMessage} style={Styles.sendButton}>
                                <Ionicons name="send" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboarView>
    )
}

export default ChatRoom;