import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Icon, Text } from "react-native-paper"
import MyStyles from "../../styles/MyStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/Contexts";
import Apis, { endpoints } from "../../configs/Apis";
import MenuOfDay from "./MenuOfDay";
import Styles from "./Styles";

const MainMenuEat = () => {
    const nav = useNavigation();
    const user = useContext(MyUserContext)
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [menuOfDay, setMenuOfDay] = useState();

    const loadMenuOfDay = async () => {
        try {
            setLoadingMenu(true)
            let res = await Apis.get(endpoints['menuOfDay'](user?._j.menu?.id))
            setMenuOfDay(res.data)
        } catch (err) {
            console.log("load menu of day", err)
        } finally {
            setLoadingMenu(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (user?._j) {
                loadMenuOfDay();
            }
        }, [user?._j])
    )

    return (
        <ScrollView style={MyStyles.bgContainer}>
            <View style={Styles.headerContainer}>
                <View style={Styles.buttonWrapper}>
                    <Button
                        style={[MyStyles.button]}
                        textColor="white"
                        onPress={() => nav.navigate("dietList")}
                    >Xem chế độ ăn phù hợp</Button>
                </View>
                <View style={Styles.diaryWrapper}>
                    <TouchableOpacity onPress={() => nav.navigate('healthDiary')}>
                        <Icon size={30} source="book" color="#3897f1" />
                    </TouchableOpacity>
                    <Text style={Styles.diaryText}>Nhật ký sức khỏe</Text>
                </View>

            </View >
            <View style={{ padding: 20 }}>
                {menuOfDay ? <>
                    <Text style={Styles.menuTitleText}>Thực đơn đang thực hiện</Text>
                </> : <>
                    <Text style={Styles.menuTitleText}>Bạn chưa đăng ký thực đơn</Text>
                </>}
            </View>
            {!loadingMenu ? <>
                <FlatList
                    data={menuOfDay}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={Styles.flatListItem}>
                            <MenuOfDay item={item} day={user?._j.menu?.total_day} />
                        </View>
                    )}
                />
            </> : <>
                <ActivityIndicator />
            </>}
        </ScrollView>
    )
}

export default MainMenuEat;