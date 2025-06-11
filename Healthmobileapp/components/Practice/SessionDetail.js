import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Card, List, Text } from "react-native-paper"
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Alert, FlatList, SafeAreaView, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import Styles from "../Practice/Styles";
import MyStyles from "../../styles/MyStyles";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const sessionCache = {};
const exerciseCompleteCache = {};

const SessionDetail = ({ route }) => {
    const session_id = route.params?.session_id
    const schedule_id = route.params?.schedule_id
    const day = route.params?.day
    const intervalRef = useRef(null)
    const [sessionDetail, setSessionDetail] = useState({});
    const [loading, setLoading] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [exerciseComplete, setExerciseComplete] = useState({});
    const nav = useNavigation();

    const loadSessionDetail = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['sessionDetail'](session_id));
            if (res.status === 200) {
                setSessionDetail(res.data);
                sessionCache[session_id] = res.data;
            }
        } catch (err) {
            console.log("load sessionDetail", err);
        } finally {
            setLoading(false);
        }
    }

    const loadExerciseComplete = async (exercise_id) => {
        try {
            setLoading(true)
            let token = await AsyncStorage.getItem('token')

            let url = `${endpoints['exerciseCompleteStats']}?schedule_id=${schedule_id}&session_id=${session_id}&exercise_id=${exercise_id}&day=${day}`
            let res = await authApis(token).get(url)

            const newData = res.data
            const cachedData = exerciseCompleteCache[exercise_id]

            if (cachedData !== newData) {
                setExerciseComplete(prev => ({ ...prev, [exercise_id]: res.data }))
                exerciseCompleteCache[exercise_id] = res.data
            }
        } catch (err) {
            console.log("load excercise complete", err)
        } finally {
            setLoading(false);
        }
    }

    const postResultSession = async (seconds) => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).post(endpoints['resultSession'], {
                session: session_id,
                practice_time: seconds
            })

        } catch (err) {
            console.log("post result sesion", err)
        } finally {

        }
    }

    const startTraining = async () => {
        const startTime = Date.now()
        setIsTraining(true)
        await AsyncStorage.setItem(`trainingState_${session_id}`, JSON.stringify({
            startTime: startTime,
            isTraining: true
        }));

        intervalRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            setSeconds(elapsed)
        }, 1000)

    }

    const stopTraining = async () => {
        await AsyncStorage.removeItem(`trainingState_${session_id}`);
        clearInterval(intervalRef.current);
        setIsTraining(false);
        postResultSession(seconds);
        setSeconds(0);

        nav.navigate("sessionResult", { "session_id": session_id, "schedule_id": schedule_id, "day": day })
    }

    const formatTime = (totalSeconds) => {
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
        return `${h}:${m}:${s}`
    }

    const confirmTraining = (excercise_id) => {
        if (!isTraining) {
            Alert.alert(
                "Xác nhận",
                "Bắt đầu buổi tập ?",
                [
                    {
                        text: "Hủy",
                        style: "cancel"
                    },
                    {
                        text: "Đồng ý",
                        onPress: () => {
                            startTraining()
                            nav.navigate("exerciseDetail", { "excercise_id": excercise_id, "schedule_id": schedule_id, "session_id": session_id, "day": day })
                        }
                    }
                ]
            )
        }
        else {
            nav.navigate("exerciseDetail", { "excercise_id": excercise_id, "schedule_id": schedule_id, "session_id": session_id, "day": day })
        }
    }


    useFocusEffect(
        useCallback(() => {
            const cached = sessionCache[session_id];
            if (cached) {
                setSessionDetail(cached);
            }
            else {
                loadSessionDetail();
            }
        }, [session_id])
    )


    useFocusEffect(
        useCallback(() => {
            if (Array.isArray(sessionDetail.exercise)) {
                sessionDetail.exercise.forEach(item => {
                    loadExerciseComplete(item.id);
                })
            }
        }, [sessionDetail.exercise])
    )


    useFocusEffect(
        useCallback(() => {
            const restoreState = async () => {
                const saveState = await AsyncStorage.getItem(`trainingState_${session_id}`);
                if (saveState) {
                    const { startTime, isTraining } = JSON.parse(saveState);
                    if (startTime && isTraining) {
                        setIsTraining(isTraining);
                        const now = Date.now();
                        const elapsed = Math.floor(now - startTime) / 1000
                        setSeconds(elapsed)

                        intervalRef.current = setInterval(() => {
                            const elapsed = Math.floor(Date.now() - startTime) / 1000
                            setSeconds(elapsed)
                        }, 1000)
                    }
                }
            }
            restoreState();
            return () => clearInterval(intervalRef.current)
        }, [])
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginHorizontal: 10 }}>
                <Card style={{ marginVertical: 5 }}>
                    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ color: "#36648B" }}>{day} ngày tập luyện</Text>
                            <Text>{sessionDetail.name}</Text>
                        </View>
                        {isTraining && <Text>{formatTime(seconds)}</Text>}
                    </Card.Content>

                </Card>
            </View>
            {Object.keys(sessionDetail).length > 0 ? <>
                <FlatList
                    style={{ marginHorizontal: 10 }}
                    data={sessionDetail.exercise}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            key={`exercise${item.id}`}
                            onPress={() => confirmTraining(item.id)}
                        >
                            <List.Item
                                title={item.name}
                                titleNumberOfLines={0}
                                titleStyle={{ flexWrap: 'wrap' }}
                                left={() => <Image style={Styles.imageExcercise} source={{ uri: item.image }} />}
                                right={() => <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: "#00CCFF" }}>{Math.floor(((exerciseComplete[item.id] ?? exerciseCompleteCache[item.id]) || 0) * 100)}%</Text>
                                    <Ionicons name='chevron-forward-outline' size={18} color="#00CCFF" />
                                </View>}
                            />
                        </TouchableOpacity>
                    }
                />
                <View style={{ alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}>
                    {!isTraining ? <>
                        <Button
                            style={MyStyles.button}
                            textColor="white"
                            onPress={startTraining}
                        >BẮT ĐẦU TẬP</Button>
                    </> : <>
                        <Button
                            style={[MyStyles.button, { backgroundColor: "#DC143C", width: '100%' }]}
                            textColor="white"
                            onPress={() => {
                                Alert.alert(
                                    "Xác nhận",
                                    "Kết thúc buổi tập ?",
                                    [
                                        {
                                            text: "Hủy",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Đồng ý",
                                            onPress: () => stopTraining()
                                        }
                                    ]
                                )
                            }}
                        >KẾT THÚC TẬP</Button></>}
                </View>
            </> : <>
                <ActivityIndicator />
            </>}

        </SafeAreaView>
    );
}
export default SessionDetail;