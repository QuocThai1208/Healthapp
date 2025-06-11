import { useContext } from "react";
import { Image, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import Styles from "./Styles";

const ExpertItem = ({ item }) => {
    const roleVN = {
        3: 'Chuyên gia dinh dưỡng',
        4: 'Huấn luyện viên'
    }

    const roleEN = {
        3: 'nutritionist',
        4: 'coach'
    }

    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const nav = useNavigation();

    const expertConnect = async (role_name, id) => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).patch(endpoints['currentUser'], {
                [role_name]: id
            })
            await dispatch({
                "type": "update",
                "payload": res.data,
            });

        } catch (err) {
            console.log("expertConnect", err)
        }
    }

    return (
        <TouchableOpacity onPress={() => nav.navigate("expertProfile", { "item": item })}>
            <View style={Styles.expertItemWrapper} >
                <Image style={Styles.expertAvatar} source={{ uri: item?.user?.avatar }} />

                <View style={Styles.expertInfoContainer}>
                    <View>
                        <Text style={Styles.expertUsername}>{item?.user?.username}</Text>
                        <Text style={Styles.expertRole}>{roleVN[item?.user?.user_role]}</Text>
                    </View>
                    {
                        (user?._j?.coach === item?.user?.id || user?._j?.nutritionist === item?.user?.id) ? <>
                            <Button style={{ backgroundColor: 'white' }} textColor="#3897f1">Đã kết nối</Button>
                        </> : <>
                            <Button
                                onPress={() => expertConnect(roleEN[item?.user?.user_role], item?.user?.id)}
                                style={{ backgroundColor: '#3897f1' }}
                                textColor="white">Kết nối</Button>
                        </>
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ExpertItem;