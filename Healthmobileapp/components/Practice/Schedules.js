import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import Styles from "../Practice/Styles";
import MyStyles from "../../styles/MyStyles";



const Schedules = ({ route }) => {
    const groupId = route.params?.groupId;
    const tagId = route.params?.tagId;

    const nav = useNavigation();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedules] = useState([]);


    const loadSchedules = async () => {
        if (page > 0) {
            try {
                setLoading(true)
                let url = `${endpoints['groupScheduleItems'](groupId)}?page=${page}`;
                if (tagId) {
                    url = `${url}&tag_ids=${tagId}`;
                }
                let res = await Apis.get(url);
                if (res.data.results) {
                    setSchedules([...schedules, ...res.data.results])
                    if (res.data.next === null) {
                        setPage(0)
                    }
                }
                else {
                    setPage(0)
                }
            } catch (err) {
                console.log("loadSchedules", err)
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
        loadSchedules();
    }, [groupId, page])


    return (
        <SafeAreaView style={[MyStyles.container, MyStyles.bgContainer]}>
            {schedules.length === 0 ? <>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Chưa có kế hoạch tập</Text>
                </View>
            </> : <>
                <FlatList
                    onEndReached={loadMore}
                    ListFooterComponent={loading && <ActivityIndicator />}
                    data={schedules} renderItem={({ item }) => <TouchableOpacity key={item.id} onPress={() => nav.navigate("scheduleDetail", { "scheduleId": item.id })}>
                        <View style={[MyStyles.pH10, MyStyles.relative]}>
                            <Image style={Styles.forntImage} source={{ uri: item.image }} />

                            <View style={[Styles.overlay]}>
                                <Text style={[Styles.overlayText, { marginBottom: 10 }]}>{item.name}</Text>
                                <Text style={{ color: 'white' }}>{item.experience}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>} />
            </>}
        </SafeAreaView>
    )
}

export default Schedules;