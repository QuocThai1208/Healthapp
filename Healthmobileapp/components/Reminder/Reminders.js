import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Divider, Switch, Text } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import * as Notifications from 'expo-notifications';
import Styles from "./Styles";
import MyStyles from "../../styles/MyStyles";

//thông báo ngay khi app dang mở 
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
})

const Reminder = () => {
    const reminder_type = {
        exercise: 'Luyện tập',
        rest: 'Nghỉ ngơi',
        water: 'Uống nước'
    }

    const nav = useNavigation();
    const [reminders, setReminders] = useState({});
    const [loading, setLoading] = useState(false);

    const loadReminders = async () => {
        try {
            setLoading(true)
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).get(endpoints['reminders'])
            setReminders(res.data)

            await Notifications.cancelAllScheduledNotificationsAsync();
            Object.entries(res.data).forEach(([key, items]) => {
                items.forEach((item) => {
                    if (item.active) {
                        scheduleReminderNotification(item)
                    }
                })
            })
        } catch (err) {
            console.log("load", err)
        } finally {
            setLoading(false)
        }
    }

    const toggleActie = async (id, current_avtive, key) => {
        // cập nhật local trước khi update
        setReminders(prev => {
            const newPreminder = { ...prev }
            newPreminder[key] = newPreminder[key].map(item => {
                if (item.id === id) {
                    return { ...item, active: !current_avtive }
                }
                return item
            })
            return newPreminder
        })

        //gủi api update
        try {
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['reminders']}/${id}/`
            let res = await authApis(token).patch(url, {
                active: !current_avtive
            })
            loadReminders();
        } catch (err) {
            console.log("update active", err)
            //nếu lỗi thì revert lại
            setReminders(prev => {
                const newPreminder = { ...prev }
                newPreminder[key] = newPreminder[key].map(item => {
                    if (item.id === id) {
                        return { ...item, active: current_avtive }
                    }
                    return item
                })
                return newPreminder
            })
        }


    }

    const scheduleReminderNotification = async (reminder) => {
        const [hour, minute, second = 0] = reminder.reminder_time.split(':').map(Number);

        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(hour, minute, second, 0);

        if (reminderTime >= now) {
            try {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Nhắc nhở",
                        body: reminder.message,
                        sound: true,
                    },
                    trigger: reminderTime
                })
                console.log(`Đã đặt nhắc nhở: ${reminder.message} lúc ${hour}:${minute}:${second}`);
            } catch (err) {
                console.log("Lỗi", err)
            }
        }
    }

    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Thông báo", "Ưng dụng cần quyền gửi thông báo")
            }
        }
        requestPermissions();
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadReminders();
        }, [])
    )

    useLayoutEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => nav.navigate("createReminder")}>
                    <Ionicons name="add-outline" size={24} />
                </TouchableOpacity>
            )
        })
    }, [])

    return (
        <ScrollView style={Styles.scrollView}>
            {!loading ? <>
                {Object.entries(reminders).map(([key, values]) => (
                    <View key={key}>
                        <View style={Styles.sectionContainer}>
                            <Text style={Styles.sectionTitle}>{reminder_type[key]}</Text>
                        </View>
                        {values.map((item) => (
                            <View key={item.id} >
                                <Divider />
                                <View style={Styles.reminderRow}>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Text style={{ fontSize: 50 }}>{item.reminder_time.slice(0, -3)}</Text>
                                        <Text style={{ fontSize: 16 }}>{item.message}</Text>
                                    </View>
                                    <Switch value={item.active} onValueChange={() => toggleActie(item.id, item.active, key)} />
                                </View>
                                <Divider />
                            </View>
                        ))}
                    </View>
                ))}
            </> : <>
                <View style={MyStyles.centerContent}>
                    <ActivityIndicator />
                </View>
            </>}
        </ScrollView>
    )
}
export default Reminder;