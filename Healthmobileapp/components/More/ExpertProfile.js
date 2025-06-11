import { useContext } from "react";
import { ScrollView, View } from "react-native"
import { Avatar, Button, Card, Text } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import Styles from "./Styles";

const ExpertProfile = ({ route }) => {
    const roleEN = {
        3: 'nutritionist',
        4: 'coach'
    }
    const item = route.params?.item

    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const nav = useNavigation();

    const expertUnConnect = async (role_name) => {
        try {
            console.log(role_name)
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).patch(endpoints['currentUser'], {
                [role_name]: null
            })
            await dispatch({
                "type": "update",
                "payload": res.data,
            });
            nav.goBack();

        } catch (err) {
            console.log("expertUnConnect", err)
        }
    }

    return (
        <ScrollView style={Styles.expertDetailContainer}>
            <View style={Styles.expertHeader}>
                <Avatar.Image source={{ uri: item?.user?.avatar }} size={150} />
                <Text style={Styles.expertName} >{item?.user?.username}</Text>
            </View>
            <Card style={{ margin: 10 }}>
                <Card.Cover style={{ margin: 10 }} source={{ uri: item?.certification }} />
                <Card.Content>
                    <Text><Text style={Styles.expertLabel}>Kinh nghiệm: </Text>{item?.experience_years} năm</Text>
                    <Text style={Styles.expertLabel}>Chuyên ngành: </Text>
                    <Text style={{ marginTop: 10 }}>{item?.specialties}</Text>
                </Card.Content>
            </Card>
            {(user?._j?.coach === item?.user?.id || user?._j?.nutritionist === item?.user?.id) &&
                <Button
                    onPress={() => expertUnConnect(roleEN[item?.user?.user_role])}
                    style={Styles.disconnectButton}
                    textColor="white">Hủy kết nối</Button>}
        </ScrollView >
    )
}

export default ExpertProfile;