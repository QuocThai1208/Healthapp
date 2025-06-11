import { useContext, useEffect, useState } from "react";
import { Image, Platform, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyUserContext } from "../../configs/Contexts";
import ChatList from "./ChatList";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";
import Styles from "./Styles";

const ios = Platform.OS === 'ios'
const MainChat = () => {
    const [users, setUsers] = useState([]);
    const user = useContext(MyUserContext);
    const { top } = useSafeAreaInsets();

    const getUsers = async () => {
        const q = query(usersRef, where('userId', '!=', user?._j?.id));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc => {
            data.push({ ...doc.data() });
        })
        setUsers(data)
    }

    useEffect(() => {
        if (user?._j) {
            getUsers();
        }
    }, [user?._j])

    return (
        <View style={Styles.container}>
            <View style={[Styles.header, { paddingTop: ios ? top : top + 10 }]}>
                <View>
                    <Text style={Styles.headerTitle}>Chats</Text>
                </View>

                <View>
                    <Image
                        style={Styles.avatar}
                        source={{ uri: user?._j.avatar }}
                    />
                </View>
            </View>

            {users.length > 0 ? (
                <ChatList users={users} />
            ) : (
                <View style={Styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            )}

        </View>
    )
}

export default MainChat;