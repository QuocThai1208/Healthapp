import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Card, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const defaultImage = 'https://res.cloudinary.com/dpknk0a1h/image/upload/ufue5acdumdsi2zycrqe.jpg'

const ScheduleDetail = ({ route }) => {
    const schedule_id = route.params?.scheduleId;
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const { width } = useWindowDimensions();


    const loadSchedule = async () => {
        try {
            setLoading(true)
            let url = endpoints['scheduleDetail'](schedule_id);
            let res = await Apis.get(url);
            setSchedule(res.data)
        } catch {

        } finally {
            setLoading(false)
        }
    }

    const postUserSchedule = async (schedule_id) => {
        try {
            setLoading(true)
            let token = await AsyncStorage.getItem("token");
            let payload = {
                schedule: schedule_id
            }
            let res = await authApis(token).post(endpoints['userSchedules'], payload)
            if (res.status === 200) {
                Alert.alert("Thông báo", "Chuyển kế hoạch thành công")
            }
            nav.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "mainPractice" }]
                })
            )

        } catch (err) {
            if (err.response.status === 400) {
                Alert.alert("Thông báo", "Kế hoạch này đã được thực hiện")
            }
            else {
                console.log("post userSchedule", err)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSchedule();
    }, []);

    return (
        <ScrollView style={{ flex: 1 }}>
            {!loading ? <>
                <Card>
                    <Card.Cover style={MyStyles.m15} source={{ uri: schedule.image || defaultImage }} />
                    <Card.Content>
                        <Text><Ionicons name="ellipse" color="red" size={10} /> {schedule.total_day} ngày tập luyện</Text>
                        <TouchableOpacity
                            style={[MyStyles.button, MyStyles.mV10]}
                            onPress={() => postUserSchedule(schedule_id)}
                        >
                            <Text style={Styles.textButtonBold}>THÊM</Text>
                        </TouchableOpacity>
                        <RenderHtml
                            source={{ html: schedule?.describe }}
                            contentWidth={width}
                        />
                    </Card.Content>
                </Card>
            </> : <>
                <View style={MyStyles.centerContent}>
                    <ActivityIndicator />
                </View>
            </>}
        </ScrollView>
    );
}

export default ScheduleDetail;