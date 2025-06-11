import { Text, View, ScrollView } from "react-native";
import { Button, Divider } from "react-native-paper";
import Styles from "./Styles";
import MyStyles from "../../styles/MyStyles";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";


const InfoView = ({ user }) => {
    const info = [{
        label: "Tên",
        field: "first_name"
    }, {
        label: "Họ",
        field: "last_name"
    }, {
        label: "Địa chỉ",
        field: "address"
    }]
    const roleMap = {
        1: "Người quản trị",
        2: "Khách hàng",
        3: "Chuyên gia dinh dưỡng",
        4: "Huấn luyện viên"
    }

    const nav = useNavigation();


    return (
        <ScrollView>
            {info.map(i =>
                <View key={`Profile${i.field}`} >
                    <Text style={[Styles.fontText, Styles.fontItem]} >{i.label + " : " + (user?.[i.field] ? user?.[i.field] : "Không có")}</Text>
                    <Divider />
                </View>
            )}
            <View>
                <Text style={[Styles.fontText, Styles.fontItem]}>Thực đơn : {user?.menu?.name} </Text>
                <Divider />
            </View>
            <View>
                <Text style={[Styles.fontText, Styles.fontItem]} >Vai trò : {roleMap[user?.user_role]} </Text>
                <Divider />
            </View>
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <Button
                    style={MyStyles.button}
                    textColor="white"
                    onPress={() => nav.navigate('updateInfo', { "user": user?._j })}>
                    <Ionicons name='create-outline' size={24} />
                </Button>
            </View>
        </ScrollView >
    )
}

export default InfoView;