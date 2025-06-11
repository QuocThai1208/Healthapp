import { Card, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({ menu }) => {
    const nav = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => nav.navigate("menuDetail", { "menu_name": menu.name, "menu_uri": menu.image, "menu_id": menu.id, "day": menu.total_day })}
        >
            <Card style={{ backgroundColor: 'white', marginBottom: 10, position: "relative" }}>
                <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{menu.name}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Image style={{ width: 200, height: 100 }} source={{ uri: menu.image }} />
                        <View style={{ width: 2, height: "100%", backgroundColor: "#36648B", marginHorizontal: 10 }}></View>
                        <View style={{ flexDirection: "row" }}>
                            <Ionicons name="today-outline" size={16} color="#36648B" />
                            <Text style={{ color: "#36648B" }}> {menu.total_day} ngày</Text>
                        </View>
                    </View>
                </View>

                <Ionicons style={{ position: 'absolute', right: 5, top: 5 }} name="bookmark-outline" size={20} color="#36648B" />
            </Card>
        </TouchableOpacity>
    )
}

export default MenuItem;