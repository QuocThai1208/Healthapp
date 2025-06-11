import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Styles from "./Styles";

const CustomerItem = ({ item }) => {
    const nav = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => nav.navigate("mainState", { "userId": item.id })}
            style={{ padding: 10 }}
        >
            <View style={Styles.mainStateCard} >
                <Image style={Styles.mainStateAvatar} source={{ uri: item.avatar }} />

                <View style={Styles.mainStateInfo}>
                    <Text style={Styles.mainStateUsername}>{item.username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CustomerItem;