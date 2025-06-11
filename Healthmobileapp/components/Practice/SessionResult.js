import { useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import * as Progress from 'react-native-progress';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import MyStyles from "../../styles/MyStyles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Styles from "./Styles";

const SessionResult = ({ route }) => {
    const session_id = route.params?.session_id
    const schedule_id = route.params?.schedule_id
    const day = route.params?.day

    const nav = useNavigation();

    const [session, setSession] = useState({});
    const [sessionComplete, setSessionComplete] = useState(0);
    const [resultSession, setResultSession] = useState({});
    const [totalResultSession, setTotalResultSession] = useState({});
    const [actualResultSession, setActualResultSession] = useState({});
    const [workoutNotes, setWorkoutNotes] = useState();



    const loadActualResultSession = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let url = `${endpoints['actualSessionResult']}?&session_id=${session_id}&day=${day}`
            let res = await authApis(token).get(url);
            if (res.status === 200) {
                setActualResultSession(res.data);
            }
        } catch (err) {
            console.log("loadResultSession", err);
        } finally {

        }
    }

    const patchResultSession = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let id = resultSession[0]?.id
            let res = await authApis(token).patch(endpoints['resultSessionDetail'](id), {
                workout_notes: workoutNotes
            });
            if (res.status === 200) {
                Alert.alert(
                    "Thông báo",
                    "Lưu cảm nhận thành công",
                    [
                        {
                            text: "Đồng ý",
                            onPress: () => {
                                nav.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: "mainPractice" }]
                                    })
                                )
                            }
                        }
                    ]
                )
            }
        } catch (err) {
            console.log("loadResultSession", err);
        } finally {

        }
    }

    const loadResultSession = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let url = `${endpoints['resultSession']}?&session_id=${session_id}`
            let res = await authApis(token).get(url);
            if (res.status === 200) {
                setResultSession(res.data);
            }
        } catch (err) {
            console.log("loadResultSession", err);
        } finally {

        }
    }

    const loadTotalResultSession = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let url = `${endpoints['expectedSessionResult']}?schedule_id=${schedule_id}&session_id=${session_id}`
            let res = await authApis(token).get(url);
            if (res.status === 200) {
                setTotalResultSession(res.data);
            }
        } catch (err) {
            console.log("loadResultSession", err);
        } finally {

        }
    }

    const loadSession = async () => {
        try {
            let res = await Apis.get(endpoints['sessionDetail'](session_id));
            if (res.status === 200) {
                setSession(res.data);
            }
        } catch (err) {
            console.log("load session", err);
        } finally {

        }
    }

    const loasSessionComplete = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['sessionCompleteStats']}?session_id=${session_id}&schedule_id=${schedule_id}&day=${day}`
            let res = await authApis(token).get(url)

            setSessionComplete(res.data)
        } catch (err) {
            console.log("load session complete", err)
        }
    }


    useEffect(() => {
        loadSession();
        loasSessionComplete();
        loadTotalResultSession();
        loadResultSession();
        loadActualResultSession();

        nav.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() =>
                    nav.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "mainPractice" }]
                        })
                    )
                }>
                    <Ionicons name="close-outline" size={24} />
                </TouchableOpacity>
            )
        });
    }, [])


    return (
        <KeyboardAvoidingView behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <View>
                        <Text style={Styles.workoutTitle}>Kết quả tập luyện</Text>
                    </View>

                    <View style={Styles.cardContainer}>
                        <Card >
                            <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ color: "#36648B", marginBottom: 10, }}>{day} ngày tập luyện</Text>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{session.name}</Text>
                                </View>
                                <Progress.Circle
                                    size={50}
                                    progress={sessionComplete || 0}
                                    color="#00CCFF"
                                    unfilledcolor="#00CCFF"
                                    showsText={true}
                                />
                            </Card.Content>
                        </Card>
                    </View>

                    <View style={Styles.cardRow}>
                        <Card style={[Styles.cardHalf, { marginRight: 15 }]}>
                            <Card.Content>
                                <Text style={Styles.cardContentCenter}>{resultSession[0]?.practice_time?.split('.')[0]}</Text>
                                <Text style={{ alignSelf: 'center' }} >Thời lượng tập luyện</Text>
                            </Card.Content>
                        </Card>

                        <Card style={Styles.cardHalf}>
                            <Card.Content>
                                <Text style={Styles.cardContentCenter}>{resultSession[0]?.calo}</Text>
                                <Text tyle={{ alignSelf: 'center' }} >Calo tiêu thụ</Text>
                            </Card.Content>
                        </Card>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={Styles.progressRow}>
                            <Progress.Circle
                                size={50}
                                progress={(actualResultSession?.total_reps / totalResultSession?.total_rep) || 0}
                                color="#00CCFF"
                                unfilledcolor="#00CCFF"
                                showsText={true}
                            />
                            <View style={{ marginLeft: 10 }} >
                                <Text style={Styles.progressTitle}>Rep thực hiện</Text>
                                <Text style={{ color: '#36648B' }}>{actualResultSession?.total_reps} reps của {totalResultSession?.total_rep} reps dự kiến</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={Styles.progressRow}>
                            <Progress.Circle
                                size={50}
                                progress={(actualResultSession?.total_weight / totalResultSession?.total_weight) || 0}
                                color="#00CCFF"
                                unfilledcolor="#00CCFF"
                                showsText={true}
                            />
                            <View style={{ marginLeft: 10 }} >
                                <Text style={Styles.progressTitle}>Tổng khối lượng tạ</Text>
                                <Text style={{ color: '#36648B' }}>{actualResultSession?.total_weight} kg của {totalResultSession?.total_weight} kg dự kiến</Text>
                            </View>
                        </View>
                    </View>
                    <View style={Styles.cardContainer}>
                        <Text style={Styles.feedbackLabel}>Hãy nêu cảm nhận của bạn</Text>
                        <TextInput
                            multiline
                            style={Styles.feedbackInput}
                            mode="outlined"
                            onChangeText={(t) => setWorkoutNotes(t)}
                        />
                        <Button
                            disabled={!workoutNotes}
                            style={[MyStyles.button, { width: '100%', opacity: !workoutNotes ? 0.5 : 1 }]}
                            textColor="white"
                            onPress={patchResultSession}
                        >LƯU</Button>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SessionResult;