import { CommonActions, useNavigation } from "@react-navigation/native"
import { BlurView } from "expo-blur"
import { useContext, useEffect, useState } from "react"
import { FlatList, Image, ScrollView, Text, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { Button, Divider } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MenuOfDay from "./MenuOfDay";
import MyStyles from "../../styles/MyStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import Styles from "./Styles";

const MenuDetail = ({ route }) => {
    const menu_name = route.params?.menu_name
    const menu_uri = route.params?.menu_uri
    const menu_id = route.params?.menu_id
    const day = route.params?.day
    const dispatch = useContext(MyDispatchContext);
    const user = useContext(MyUserContext);
    const nav = useNavigation();
    const [menuOfDay, setMenuOfDay] = useState();

    const loadMenuOfDay = async () => {
        try {
            let res = await Apis.get(endpoints['menuOfDay'](menu_id))
            setMenuOfDay(res.data)
        } catch (err) {
            console.log("load menu of day", err)
        }
    }

    const postMenuUser = async (menu_id) => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).post(endpoints['currentUserMenu'], {
                menu: menu_id
            })
            if (res.status === 200) {
                dispatch({
                    type: 'update-menu',
                    payload: res.data.menu
                })
                nav.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "mainMenuEat" }]
                    })
                )
            }
        } catch (err) {
            console.log("post menuUser", err)
        }
    }


    useEffect(() => {
        loadMenuOfDay();
        nav.setOptions({
            title: menu_name
        })
    }, [])

    return (
        <ScrollView style={MyStyles.bgContainer}>
            <View>
                <Image style={{ height: 180 }} source={{ uri: menu_uri }} />
                <BlurView
                    intensity={20}
                    tint="light"
                    style={Styles.blurView}>
                    <Text style={[Styles.blurText, { textAlign: "center" }]}>{menu_name}</Text>
                </BlurView>
            </View>

            <View style={Styles.itemContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Ionicons name="today-outline" size={16} color="#36648B" />
                    <Text style={{ color: "#36648B" }}> {day} ngày</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {user?._j.menu?.id === menu_id ? <>
                        <Button
                            style={[MyStyles.button, { marginLeft: 10, backgroundColor: '#DC143C' }]}
                            textColor='white'
                        >Đã đăng ký</Button>
                    </> : <>
                        <Button
                            style={[MyStyles.button, { marginLeft: 10 }]}
                            textColor='white'
                            onPress={() => postMenuUser(menu_id)}
                        >Bắt đầu thực đơn</Button>
                    </>}
                </View>
            </View>
            <Divider />

            <FlatList
                data={menuOfDay}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={Styles.flatListItem}>
                        <MenuOfDay item={item} day={day} />
                    </View>
                )}
            />
        </ScrollView>
    )
}
export default MenuDetail;