import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import Apis, { authApis, endpoints } from '../../configs/Apis'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Styles from './Styles'
import { Image } from 'react-native'
import { ActivityIndicator, Card } from 'react-native-paper'
import * as Progress from 'react-native-progress';
import MyStyles from '../../styles/MyStyles';

const imageDefault = 'https://res.cloudinary.com/dpknk0a1h/image/upload/v1745720024/sqw94yluzmffyb5ovtdg.jpg';
let sessionCompleteCache = {};

const MainPractice = () => {
    const [isStart, setIsStart] = useState(0);
    const [session, setSession] = useState({});
    const [loading, setLoading] = useState(false);
    const [userSchedule, setUserSchedule] = useState({});
    const [sessionComplete, setSessionComplete] = useState({});
    const [repeadtedSessions, setRepeadtedSessions] = useState([]);

    const nav = useNavigation();

    const loadSession = async () => {
        try {
            setLoading(true);
            let id = userSchedule[0]?.schedule.id;
            if (id) {
                if (userSchedule[0]?.type === 'regular') {
                    let res = await Apis.get(endpoints["sessionsInSchedule"](id));
                    if (res.status === 200) {
                        setSession(res.data);
                        let total_day = userSchedule[0]["schedule"]["total_day"];
                        setRepeadtedSessions(Array.from({ length: total_day }, (_, index) => ({
                            ...res.data[index % res.data.length],
                            day: index + 1
                        })
                        ));
                    }
                }
                else {
                    let token = await AsyncStorage.getItem('token')
                    let res = await authApis(token).get(endpoints["personalSessions"](id));
                    if (res.status === 200) {
                        setSession(res.data);
                        setRepeadtedSessions(Array.from({ length: res.data.length }, (_, index) => ({
                            ...res.data[index % res.data.length],
                            day: index + 1
                        })
                        ));
                    }
                }
            }
        } catch (err) {
            console.log("load session", err);
        } finally {
            setLoading(false);
        }
    }

    const loasSessionComplete = async (session_id, day) => {
        try {
            let token = await AsyncStorage.getItem('token')
            let schedule_id = userSchedule[0]?.schedule?.id
            if (!schedule_id) return

            let url = `${endpoints['sessionCompleteStats']}?session_id=${session_id}&schedule_id=${schedule_id}&day=${day}`
            let res = await authApis(token).get(url)
            setSessionComplete(prev => ({ ...prev, [day]: res.data }))

        } catch (err) {
        }
    }

    const loadUserSchedule = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['userScheduleActive']);
            if (res.data.length === 0) {
                res = await authApis(token).get(endpoints['personalScheduleActive']);
            }
            setUserSchedule(res.data);
        } catch (err) {
            console.log("load schedule", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUserSchedule();
    }, []);

    useEffect(() => {
        loadSession();
    }, [userSchedule]);



    useFocusEffect(
        useCallback(() => {
            if (Array.isArray(repeadtedSessions)) {
                repeadtedSessions.map(item => {
                    loasSessionComplete(item.id, item.day);
                })
            }
        }, [repeadtedSessions])
    );

    useLayoutEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', width: 100, justifyContent: 'flex-end' }}>
                    {userSchedule[0]?.type === "personal" && <Ionicons style={{ marginRight: 15 }}
                        name="create-outline"
                        size={26}
                        onPress={() => nav.navigate('editSchedule', { "scheduleId": userSchedule[0]?.schedule?.id })} />}
                    <Ionicons name="list-outline" size={26} onPress={() => nav.navigate('mySchedules')} />
                </View>
            ),
            headerLeft: () => (
                <Ionicons name="time-outline" size={26} onPress={() => nav.navigate("resultList")} />
            )
        })
    }, [nav, userSchedule])


    return (
        <SafeAreaView style={MyStyles.container} >
            {Object.keys(userSchedule).length > 0 ? <>
                {!loading ? <>

                    <View style={[MyStyles.pH10, MyStyles.relative]}>
                        <Image style={Styles.forntImage} source={{ uri: userSchedule[0]?.schedule?.image || imageDefault }} />

                        <View style={[Styles.overlay, { alignItems: "flex-start" }]}>
                            <View style={{ marginLeft: 30 }}>
                                <Text style={Styles.imageTitle}>{userSchedule[0]?.schedule.group_schedule || userSchedule[0]?.schedule.name}</Text>
                                <Text style={Styles.imageSubtitle}>{userSchedule[0]?.schedule?.Tags} {userSchedule[0]?.schedule.name}</Text>
                                <Text style={Styles.imageDuration}>{userSchedule[0]?.schedule?.total_day || repeadtedSessions.length} ngày tập luyện</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[MyStyles.mHl10, Styles.container]}>
                        <Text style={Styles.sectionTitle}>Huấn luyện tiếp theo</Text>

                        <ScrollView style={Styles.container}>
                            {Object.keys(session).length > 0 && repeadtedSessions.slice(0, isStart + 3).map((i, index, arr) => {
                                const prev = index > 0 ? arr[index - 1] : null;
                                const canAccess = index === 0 || (prev && sessionComplete[prev.day] > 0.5)
                                const opacity = canAccess ? 1 : 0.5
                                if (index === arr.length - 1 && opacity === 1 && (isStart + 3) < repeadtedSessions.length) { setIsStart(prev => prev + 3) }
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            if (opacity === 1) {
                                                nav.navigate("sessionDetail", { "session_id": i.id, "day": i.day, "schedule_id": userSchedule[0]["schedule"]["id"] });
                                            }
                                            else {
                                                Alert.alert("Thông báo", "Bạn phải hoàn thành bài tập trước")
                                            }
                                        }}
                                    >
                                        <Card style={[Styles.sessionCard, { opacity: opacity }]}>
                                            <View style={Styles.cardContent}>
                                                {opacity === 1 ? <>
                                                    <Progress.Circle
                                                        size={50}
                                                        progress={sessionComplete[i.day]}
                                                        color="#00CCFF"
                                                        unfilledcolor="#00CCFF"
                                                        showsText={true}
                                                    />
                                                </> : <>
                                                    <Ionicons name="lock-closed-outline" size={40} color="#00CCFF" />
                                                </>}
                                                <View style={{ marginLeft: 10 }} >
                                                    <Text style={Styles.sessionDay}>{i.day} ngày tập luyện</Text>
                                                    <Text style={Styles.sessionName}>{i.name}</Text>
                                                </View>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                )
                            }
                            )}
                        </ScrollView>
                    </View>
                </> : <>
                    <View style={MyStyles.centerContent}>
                        <ActivityIndicator />
                    </View>
                </>}
            </> : <>
                <View style={MyStyles.centerContent}>
                    <Text>Bạn chưa có kế hoạch tập</Text>
                </View>
            </>}
        </SafeAreaView>
    );
}
export default MainPractice; 