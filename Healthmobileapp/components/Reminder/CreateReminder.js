import { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider, RadioButton, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";

const CreateReminder = () => {
    const info = [{
        field: "reminder_time",
        label: "Thời gian"
    }, {
        field: "reminder_type",
        label: "Chủ đề nhắc nhở"
    }, {
        field: "message",
        label: "Lời nhắc"
    },]

    const type = [{
        field: "water",
        label: "Uống nước"
    }, {
        field: "exercise",
        label: "Tập luyện"
    }, {
        field: "rest",
        label: "Nghỉ ngơi"
    },]
    const nav = useNavigation();
    const [data, setData] = useState({});
    const [time, setTime] = useState(new Date())

    const setState = (value, field) => {
        setData({ ...data, [field]: value })
    }

    const postReminder = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).post(endpoints['reminders'], {
                ...data
            })
            nav.goBack()
        } catch (err) {
            console.log("Lỗi:", err.response?.data || err.message)
            nav.goBack()
        }
    }

    useEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={postReminder}>
                    <Text>Lưu</Text>
                </TouchableOpacity>
            )
        })
    }, [data])




    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ padding: 10 }}>
                {info.map((item) => (
                    <View key={item.field}>
                        <Text style={{ fontSize: 15, fontWeight: 600, marginVertical: 10 }}>{item.label}</Text>
                        {item.field === "reminder_time" && <View style={{ alignItems: 'center' }}>
                            <DateTimePicker
                                value={time}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) {
                                        setTime(selectedTime)
                                        const h = selectedTime.getHours().toString().padStart(2, '0')
                                        const m = selectedTime.getMinutes().toString().padStart(2, '0')
                                        setState(`${h}:${m}:00`, item.field)
                                    }
                                }}
                            />
                        </View>}

                        {item.field === "reminder_type" && <RadioButton.Group onValueChange={(v) => setState(v, item.field)} value={data?.[item.field] || type[0].field}>
                            {type.map((t) => (
                                <View key={t.field}>
                                    <RadioButton.Item label={t.label} value={t.field} />
                                    <Divider />
                                </View>
                            ))}
                        </RadioButton.Group>}

                        {item.field === "message" && <TextInput
                            style={{ backgroundColor: 'white' }}
                            value={data?.[item.field] || ''}
                            onChangeText={(t) => setState(t, item.field)}
                            mode="outlined" />}
                    </View>
                ))}
            </View>



        </View>
    )
}
export default CreateReminder;