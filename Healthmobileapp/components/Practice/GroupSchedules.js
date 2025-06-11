import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import MyStyles from "../../styles/MyStyles"
import { useEffect, useState } from "react"
import Apis, { endpoints } from '../../configs/Apis'
import { ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Styles from '../Practice/Styles'

const GroupSchedules = () => {
    const nav = useNavigation();

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [groupSchedules, setGroupSchedules] = useState([]);

    const loadGruopSchedules = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                const url = `${endpoints['groupSchedules']}?page=${page}`
                let res = await Apis.get(url)
                setGroupSchedules([...groupSchedules, ...res.data.results]);
                if (res.data.next === null) {
                    setPage(0)
                }
            } catch (err) {
                console.log("loadGruopSchedules", err)
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
        loadGruopSchedules();
    }, [page]);


    return (
        <SafeAreaView style={[MyStyles.container, MyStyles.bgContainer]}>

            <FlatList
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator />}
                keyExtractor={(item) => item.id.toString()}
                data={groupSchedules} renderItem={({ item }) => <TouchableOpacity onPress={() => nav.navigate('tags', { "groupId": item.id })}>
                    <View style={[MyStyles.pH10, MyStyles.relative]}>
                        <Image style={Styles.forntImage} source={{ uri: item.image }} />

                        <View style={[Styles.overlay]}>
                            <Text style={Styles.overlayText}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>} />

        </SafeAreaView>
    );
}
export default GroupSchedules; 