import { useContext, useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Button, HelperText, RadioButton, Text, TextInput } from "react-native-paper"
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import MyStyles from "../../styles/MyStyles";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";

const ios = Platform.OS == 'ios'
const imageDefault = 'https://res.cloudinary.com/dpknk0a1h/image/upload/istockphoto-1491873210-612x612_gxqvhl.jpg';
const role = {
    3: 'Chuyên gia dinh dưỡng',
    4: 'Huấn luyện viên'
}

const RegisterRole = () => {
    const [selectedRole, setSelectedRole] = useState('3');
    const [expert, setExpert] = useState({});
    const [msg, setMsg] = useState();

    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const nav = useNavigation();

    const setState = (value, field) => {
        setExpert({ ...expert, [field]: value })
    }


    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
            Linking.openSettings();
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setState(result.assets[0], 'certification');
        }
    }

    const registerRole = async () => {
        if (validate() === true) {
            try {
                let token = await AsyncStorage.getItem('token')

                let res = await authApis(token).patch(endpoints['currentUser'], {
                    user_role: selectedRole
                })
                await dispatch({
                    "type": "update",
                    "payload": res.data,
                });

                await postExpert()

                nav.goBack();
            } catch (err) {
                console.log("update info", err)
            }
        }
    }

    const postExpert = async () => {
        try {
            let form = new FormData();
            form.append('user', user?._j?.id)
            for (let key in expert) {
                if (key === 'certification') {
                    form.append('certification', {
                        uri: expert.certification?.uri,
                        name: expert.certification?.fileName,
                        type: expert.certification?.mimeType
                    });
                }
                else {
                    form.append(key, expert[key])
                }
            }

            let res = await Apis.post(endpoints['experts'], form)
        } catch (err) {
            console.log("postExpert", err)
        }
    }

    const validate = () => {
        if (Object.values(expert).length === 0) {
            setMsg("Vui lòng nhập thông tin!");
            return false;
        }

        if (!expert.experience_years) {
            setMsg("Vui lòng nhập kinh nghiệm!");
            return false;
        }

        if (!expert.specialties) {
            setMsg("Vui lòng nhập lĩnh vực!");
            return false;
        }

        if (!expert.certification) {
            setMsg("Vui lòng thêm bằng cấp!");
            return false;
        }

        setMsg("");
        return true;
    }

    useEffect(() => {
        console.log(expert)
    }, [expert])

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={90}
            style={MyStyles.container}
            behavior={ios ? 'padding' : 'height'}            >
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[MyStyles.bgContainer, { padding: 10 }]}>
                <View style={{ alignSelf: 'center' }}>
                    <HelperText type="erroe" visible={msg}>{msg}</HelperText>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={Styles.label}>Hình ảnh bằng cấp <Text style={{ color: 'red' }}>*</Text></Text>
                    <Button style={[MyStyles.button, { width: '100%', marginBottom: 10 }]} textColor="white" onPress={picker}>Thêm hình ảnh</Button>
                    <Image style={Styles.image} source={{ uri: expert?.certification?.uri || imageDefault }} />
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={Styles.label}>Kinh nghiệm <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        onChangeText={(t) => setState(t, 'experience_years')}
                        mode="outlined"
                        keyboardType="number-pad"
                        placeholderTextColor="Số năm kinh nghiệm"
                    />
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={Styles.label}>Lĩnh vực <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        onChangeText={(t) => setState(t, 'specialties')}
                        mode="outlined"
                        multiline={true}
                        numberOfLines={10}
                        placeholderTextColor="Lĩnh vực của bạn..."
                    />
                </View>

                <Text style={Styles.label}>Chọn vai trò <Text style={{ color: 'red' }}>*</Text></Text>
                <RadioButton.Group
                    onValueChange={(value) => setSelectedRole(value)}
                    value={selectedRole}
                >
                    <View style={Styles.radioGroup}>
                        <View style={Styles.radioItem}>
                            <View style={{ borderWidth: 1, borderRadius: 100, marginRight: 5 }}>
                                <RadioButton value="3" />
                            </View>
                            <Text>{role[3]}</Text>
                        </View>

                        <View style={Styles.radioItem}>
                            <View style={{ borderWidth: 1, borderRadius: 100, marginRight: 5 }}>
                                <RadioButton color="black" value="4" />
                            </View>
                            <Text>{role[4]}</Text>
                        </View>
                    </View>
                </RadioButton.Group>

                <Button style={[MyStyles.button, { width: '100%', marginBottom: 10 }]} textColor="white" onPress={() => registerRole()}>Hoàn tất</Button>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default RegisterRole;