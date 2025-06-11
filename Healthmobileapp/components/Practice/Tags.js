import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react"
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator } from "react-native-paper";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import Styles from "./Styles";

const Tags = ({ route }) => {
    const groupId = route.params?.groupId;
    const [tags, setTags] = useState([]);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const loadTags = async () => {
        try {
            setLoading(true)
            let res = await Apis.get(endpoints['tags'])
            setTags(res.data)
        } catch {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTags();
    }, []);

    return (
        <SafeAreaView style={[MyStyles.container, MyStyles.bgContainer]}>
            <FlatList ListFooterComponent={loading && <ActivityIndicator />}
                data={tags} renderItem={({ item }) => <TouchableOpacity key={item.id} onPress={() => nav.navigate('schedules', { "groupId": groupId, "tagId": item.id })}>
                    <View style={[MyStyles.pH10, MyStyles.relative]}>
                        <Image style={Styles.forntImage} source={{ uri: item.image }} />

                        <View style={[Styles.overlay]}>
                            <Text style={Styles.overlayText}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                } />
        </SafeAreaView>
    )
}

export default Tags;