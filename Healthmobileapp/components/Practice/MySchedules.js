import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../Practice/Styles";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { authApis, endpoints } from "../../configs/Apis";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from "react-native-swipe-list-view";

const imageDefault = 'https://res.cloudinary.com/dpknk0a1h/image/upload/v1745720024/sqw94yluzmffyb5ovtdg.jpg';

const MySchedules = () => {
    const [pageSchedule, setPageSchedule] = useState(1);
    const [pagePersonalSchedule, setPagePersonalSchedule] = useState(1);

    const [loading, setLoading] = useState(false);
    const [userSchedule, setUserSchedule] = useState([]);
    const [loadingPatch, setLoadingPatch] = useState(false);

    const nav = useNavigation();

    const loadUserSchedule = async () => {
        if (pageSchedule > 0) {
            try {
                setLoading(true);
                let token = await AsyncStorage.getItem("token");
                const url = `${endpoints['userSchedules']}?page=${pageSchedule}`
                const res = await authApis(token).get(url);
                setUserSchedule(prev => [...prev, ...res.data.results]);
                if (res.data.next === null) {
                    setPageSchedule(0)
                }
            } catch (err) {
                console.log("load schedule", err);
            } finally {
                setLoading(false);
            }
        }
    }

    const loadPeronalUserSchedule = async () => {
        if (pagePersonalSchedule > 0) {
            try {
                setLoading(true);
                let token = await AsyncStorage.getItem("token");
                const url = `${endpoints['personaUserlSchedules']}?page=${pagePersonalSchedule}`
                const res = await authApis(token).get(url);
                setUserSchedule(prev => [...prev, ...res.data.results]);
                if (res.data.next === null) {
                    setPagePersonalSchedule(0)
                }
            } catch (err) {
                console.log("loadPeronalSchedule", err);
            } finally {
                setLoading(false);
            }
        }
    }

    const patchUserSchedule = async (itemId, type) => {
        try {
            setLoadingPatch(true)
            let token = await AsyncStorage.getItem("token");
            let res
            if (type === 'regular') {
                res = await authApis(token).patch(endpoints['userScheduleById'](itemId));
            }
            else {
                let url = `${endpoints['personaUserlSchedules']}${itemId}/`
                res = await authApis(token).patch(url);
            }
            if (res.status === 200) {
                nav.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "mainPractice" }]
                    })
                )
            }
        } catch (err) {
            console.log("patch", err)
        } finally {
            setLoadingPatch(false)
        }
    }

    const resetUserSchedule = async () => {
        setUserSchedule([])
        setPagePersonalSchedule(1)
        setPageSchedule(1)
    }


    const deleteUserSchdedule = async (itemId, type, rowMap) => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res
            if (type === 'regular') {
                res = await authApis(token).delete(endpoints['userScheduleById'](itemId));
            } else {
                res = await authApis(token).delete(endpoints['personaUserlScheduleById'](itemId));
            }
            if (res.status === 204) {
                if (rowMap[itemId]) {
                    rowMap[itemId].closeRow();
                }
                await resetUserSchedule()
            }
        } catch (err) {
            console.log("delete user schedule", err)
        } finally {
        }
    }

    const loadMore = () => {
        if (!loading) {
            if (pageSchedule > 0) {
                setPageSchedule(prev => prev + 1)
            }
            if (pagePersonalSchedule > 0) {
                setPagePersonalSchedule(prev => prev + 1)
            }
        }
    }

    useEffect(() => {
        loadUserSchedule();
    }, [pageSchedule]);

    useEffect(() => {
        loadPeronalUserSchedule();
    }, [pagePersonalSchedule]);

    useLayoutEffect(() => {
        nav.setOptions({
            headerLeft: () => (
                <Ionicons name="close" size={30} onPress={() => {
                    nav.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "mainPractice" }]
                        })
                    )
                }} />
            )
        })
    })

    const renderSchedule = ({ item }) => {
        return (
            <TouchableOpacity
                disabled={loadingPatch}
                onPress={() => item.flag === false && patchUserSchedule(item.id, item.type)}
                activeOpacity={1}
            >
                <View style={[MyStyles.pH10, MyStyles.relative]}>
                    <Image style={Styles.forntImage} source={{ uri: item.schedule.image || imageDefault }} />

                    <View style={[Styles.overlay, { alignItems: "flex-start" }]}>
                        <View style={{ marginLeft: 30 }}>
                            <Text style={Styles.imageTitle}>{item.schedule.group_schedule || "Kế hoạch tập cá nhân"}</Text>
                            <Text style={Styles.imageSubtitle}>{item.schedule.Tags}  {item.schedule.name}</Text>
                            <Text style={Styles.imageDuration}>{item.schedule.total_day} ngày tập luyện</Text>
                        </View>
                    </View>
                    {item.flag === true && (
                        <View style={Styles.active}>
                            <Text style={Styles.overlayText}>Đang hoạt động</Text>
                        </View>)}
                </View>
            </TouchableOpacity>
        )
    }

    const renderHiddenDelete = ({ item }, rowMap) => {
        return (
            <View style={MyStyles.pH10}>
                <View style={Styles.rowBack}>
                    <TouchableOpacity
                        style={Styles.deleteButton}
                        onPress={() => deleteUserSchdedule(item.id, item.type, rowMap)}
                    >
                        <Text style={{ color: "white" }}><Ionicons name="trash-outline" size={24} /></Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={MyStyles.container}>
            <View style={{ paddingHorizontal: 10 }}>
                <TouchableOpacity
                    style={[MyStyles.button, MyStyles.mT10]}
                    onPress={() => nav.navigate('groupSchedules')
                    }
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>THÊM KẾ HOẶCH TẬP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[Styles.createButton]}
                    onPress={() => nav.navigate('createPersonalSchedule')
                    }
                >
                    <Text style={{ color: '#36648B', fontWeight: 'bold' }}>TẠO KẾ HOẶCH CÁ NHÂN</Text>
                </TouchableOpacity>
            </View>

            <SwipeListView
                data={userSchedule}
                renderItem={renderSchedule}
                renderHiddenItem={renderHiddenDelete}
                rightOpenValue={-80}
                disableRightSwipe
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 70 }}
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator />}
            />
        </SafeAreaView >
    )
}

export default MySchedules;