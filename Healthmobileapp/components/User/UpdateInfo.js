import { useContext, useState } from "react";
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";

const UpdateInfo = () => {
    const info = [{
        label: "Ảnh đại diện",
        field: "avatar"
    }, {
        label: "Tên",
        field: "first_name"
    }, {
        label: "Họ",
        field: "last_name"
    }, {
        label: "Tên đăng nhập ",
        field: "username"
    }, {
        label: "Địa chỉ",
        field: "address"
    }, {
        label: "Mật khẩu",
        field: "password"
    },]

    const nav = useNavigation();
    const [dataInfo, setDataInfo] = useState();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);


    const setState = (value, field) => {
        setDataInfo(prev => ({ ...prev, [field]: value }));
    }

    const updateInfo = async () => {
        try {
            let token = await AsyncStorage.getItem('token')

            let form = new FormData();
            for (let key in dataInfo) {
                if (key === "avatar") {
                    form.append('avatar', {
                        uri: dataInfo.avatar?.uri,
                        name: dataInfo.avatar?.fileName,
                        type: dataInfo.avatar?.mimeType
                    });
                } else {
                    form.append(key, dataInfo[key]);
                }
            }

            let res = await authApis(token).patch(endpoints['currentUser'], form)
            await dispatch({
                "type": "update",
                "payload": res.data,
            });

            nav.goBack();
        } catch (err) {
            console.log("update info", err)
        }
    }

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
            Linking.openSettings();
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setState(result.assets[0], 'avatar');
        }
    }

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={90}
            style={{ flex: 1 }}
            behavior="padding">
            <ScrollView style={[MyStyles.bgContainer, { padding: 20 }]}>
                {info?.map((i) => (
                    <View key={i.field}>
                        {i.field === 'avatar' ? <>
                            <TouchableOpacity onPress={picker} style={{ alignSelf: 'center' }}>
                                <Avatar.Image size={150} source={{ uri: dataInfo?.avatar?.uri ?? user?._j?.avatar }} />
                            </TouchableOpacity>
                        </> : <>
                            <Text style={{ fontSize: 15, fontWeight: 600 }}>{i.label}</Text>
                            <TextInput
                                value={dataInfo?.[i.field] ?? user?._j?.[i.field]}
                                mode="outlined"
                                style={{ backgroundColor: 'white', marginVertical: 10 }}
                                onChangeText={(t) => setState(t, i.field)}
                            /></>}
                    </View>
                ))}

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Button style={[MyStyles.button, { width: '100%' }]} textColor="white" onPress={() => updateInfo()}> LƯU </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default UpdateInfo;