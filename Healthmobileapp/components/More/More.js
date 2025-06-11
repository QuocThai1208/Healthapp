import { FlatList, ScrollView, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { Divider, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import MyStyles from "../../styles/MyStyles";
import Styles from "./Styles";

const More = () => {
    const info = [{
        field: "profile",
        label: "Profile của tôi",
        icon: "person-circle-outline",
    }, {
        field: "reminder",
        label: "Nhắc nhở",
        icon: "alarm-outline",
    }, {
        field: "experts",
        label: "Chuyên gia",
        icon: "ribbon-outline",
    },]

    const user = useContext(MyUserContext);
    if (user?._j?.user_role === 3 || user?._j?.user_role === 4) info.push({
        field: "customerList",
        label: "Thống kê sức khỏe của khách hàng",
        icon: "stats-chart-outline",
    })

    if (user?._j?.user_role === 1 || user?._j?.user_role === 2) info.push({
        field: "registerRole",
        label: "Đăng ký vai trò",
        icon: "create-outline",
    })

    const nav = useNavigation();

    return (
        <ScrollView style={[MyStyles.container, MyStyles.bgContainer]}>
            {info.map((item) => (
                <TouchableOpacity
                    onPress={() => nav.navigate(item.field)}
                    style={{ flex: 1 }}
                    key={item.field} >
                    <View style={Styles.itemContainer}>
                        <Ionicons name={item.icon} size={24} />
                        <View style={Styles.itemContent}>
                            <Text style={MyStyles.lableText}>{item.label}</Text>
                            <Ionicons name="chevron-forward-outline" size={18} />
                        </View>
                    </View>
                    <Divider />
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

export default More;