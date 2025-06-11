import { CommonActions, useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native"
import { Text, TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import MyStyles from "../../styles/MyStyles";

const CreatePersonalSchedule = () => {
    const nav = useNavigation();

    const [name, setName] = useState();


    const postPersonalSchedule = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).post(endpoints['personalSchedules'], {
                name: name
            })
            if (res.status === 201) {
                await postPersonalUserSchedule(res.data.id)
                nav.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "mainPractice" }]
                    })
                )
            }
        } catch (err) {
            console.log("postPersonalSchedule", err)
        }
    }

    const postPersonalUserSchedule = async (scheduleId) => {
        try {
            let token = await AsyncStorage.getItem('token')
            console.log(endpoints['personaUserlSchedules'])
            console.log(scheduleId)
            let res = await authApis(token).post(endpoints['personaUserlSchedules'], {
                schedule: scheduleId
            })
        } catch (err) {
            console.log("postPersonalUserSchedule", err)
        }
    }

    useLayoutEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => postPersonalSchedule()}
                    disabled={(!name || name.trim() === "") ? true : false}
                >
                    <Ionicons name="checkmark-outline" size={30} />
                </TouchableOpacity>
            )
        })
    }, [name])

    return (
        <View style={MyStyles.p10}>
            <Text style={[MyStyles.lableText, MyStyles.mB10]}>Tên kế hoạch tập:</Text>
            <TextInput
                onChangeText={(t) => setName(t)}
                style={{ backgroundColor: 'white' }}
                placeholder="Nhập tên...."
            />
        </View>
    )
}

export default CreatePersonalSchedule;