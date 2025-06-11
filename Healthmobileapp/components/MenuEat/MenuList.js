import { useEffect, useState } from "react";
import { ActivityIndicator, Divider, Text } from "react-native-paper";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, ScrollView, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from '@expo/vector-icons';
import MenuItem from "./MenuItem";
import Styles from "./Styles";

const MenuList = ({ route }) => {
    const diet_id = route.params?.diet_id
    const diet_name = route.params?.diet_name
    const diet_url = route.params?.diet_url
    const diet_des = route.params?.diet_des

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [menus, setMenus] = useState([]);
    const nav = useNavigation();

    const loadMenus = async () => {
        if (page > 0) {
            try {
                setLoading(true)
                const url = `${endpoints['dietMenu'](diet_id)}?page=${page}`
                let res = await Apis.get(url);
                setMenus([...menus, ...res.data.results])
                if (res.data.next === null) {
                    setPage(0)
                }
            } catch (err) {
                console.log("load menu", err)
            } finally {
                setLoading(false)
            }
        }
    }

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(prev => prev + 1)
        }
    }

    useEffect(() => {
        loadMenus();
        nav.setOptions({
            title: diet_name
        })
    }, [diet_name])

    const renderHeader = () => (
        <>
            <View>
                <Image style={{ height: 180 }} source={{ uri: diet_url }} />
                <BlurView
                    intensity={20}
                    tint="light"
                    style={Styles.blurView}>
                    <Text style={Styles.menuTitleText}>{diet_name}</Text>
                </BlurView>
            </View>

            <View style={{ backgroundColor: "white", padding: 20 }}>
                <Text>{diet_des}</Text>
            </View>
            <Divider />
            <View style={Styles.headerDietContainer}>
                <View style={{ width: 100, alignItems: "center" }}>
                    <Ionicons name="newspaper-outline" size={50} color="#36648B" />
                    <Text style={{ textAlign: 'center' }}>Phương pháp ăn uống</Text>
                </View>
            </View>
        </>
    )

    return (
        <FlatList
            data={menus}
            onEndReached={loadMore}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={loading && <ActivityIndicator />}
            renderItem={({ item }) => <MenuItem menu={item} />}
        />
    )
}

export default MenuList;