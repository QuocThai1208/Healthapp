import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native"
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Card, Text } from "react-native-paper";
import Styles from "./Styles";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";

const Resultlist = () => {
    const [resultList, setResultList] = useState();

    const nav = useNavigation();

    const loadResultList = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['resultSession']);
            if (res.status === 200) {
                setResultList(res.data);
            }
        } catch (err) {
            console.log("loadResultSession", err);
        } finally {

        }
    }

    const loadSessionList = async (session_id) => {
        try {
            let res = await Apis.get(endpoints['sessionDetail'](session_id));
            if (res.status === 200) {
                setResultList(prev => prev.map(item => {
                    if (item.session === session_id) {
                        return { ...item, session_name: res.data.name };
                    }
                    return item;
                }))
            }
        } catch (err) {
            console.log("load session", err);
        } finally {

        }
    }

    useEffect(() => {
        loadResultList();
    }, [])

    useEffect(() => {
        if (resultList) {
            resultList.forEach(item => {
                loadSessionList(item.session)
            })
        }
    }, [resultList])

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <FlatList
                data={resultList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => nav.navigate("resultItem", { "item": item })}>
                        <Card style={[Styles.carSessiondEdit, { marginHorizontal: 10 }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={MyStyles.lableText}>{item.session_name || ''}</Text>
                                <Text style={MyStyles.lableText}>{item.created_date}</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Resultlist;