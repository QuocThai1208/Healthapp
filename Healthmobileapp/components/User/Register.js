import {
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Styles from "./Styles"
import { Avatar, Button, HelperText } from "react-native-paper";
import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import MyStyles from "../../styles/MyStyles";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";


const Register = () => {
    const info = [{
        placeholder: "Tên",
        field: "first_name",
        secureTextEntry: false,
    }, {
        placeholder: "Họ và tên lót",
        field: "last_name",
        secureTextEntry: false,
    }, {
        placeholder: "Địa chỉ",
        field: "address",
        secureTextEntry: false,
    }, {
        placeholder: "Năm sinh",
        field: "birth",
        secureTextEntry: false,
    }, {
        placeholder: "Tên đăng nhập",
        field: "username",
        secureTextEntry: false,
    }, {
        placeholder: "Mật khẩu",
        field: "password",
        secureTextEntry: true,
    }, {
        placeholder: "Xác nhận mật khẩu",
        field: "confirm",
        secureTextEntry: true,
    }]

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState();
    const nav = useNavigation();
    const defaultAvatar = 'https://res.cloudinary.com/dpknk0a1h/image/upload/istockphoto-1337144146-612x612_tqyzh8.jpg';


    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }


    const validate = () => {
        if (Object.values(user).length === 0) {
            setMsg("Vui lòng nhập thông tin!");
            return false;
        }

        if (!user.avatar) {
            setMsg('Vui lòng chọn ảnh đại diện')
            return false;
        }

        for (let i of info) {
            if (!(i.field in user)) {
                setMsg(`Vui lòng nhập ${i.placeholder}`);
                return false;
            }

            if (user[i.field].trim() === '') {
                setMsg(`Vui lòng nhập ${i.placeholder}`);
                return false;
            }

            if (i.field === "birth" && user[i.field].length < 4) {
                setMsg(`Vui lòng nhập ${i.field} đủ 4 ký tự`);
                return false;
            }
        }

        if (user.password !== user.confirm) {
            setMsg('Mật khẩu không khớp!');
            return false;
        }

        setMsg("");
        return true;
    }


    const HandleRegister = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in user) {
                    if (key !== "confirm") {
                        if (key === "avatar") {
                            form.append('avatar', {
                                uri: user.avatar?.uri,
                                name: user.avatar?.fileName,
                                type: user.avatar?.mimeType
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }
                let res = await Apis.post(endpoints['register'], form);

                if (res.status === 201) {
                    const userId = res.data.id
                    //thêm user vào db của firebase
                    await setDoc(doc(db, 'users', String(userId)), {
                        userId: userId,
                        username: res.data.username,
                        avatar: res.data.avatar
                    });
                    nav.navigate("mainLogin")
                }
            } catch (error) {
                console.error("Register failed:", error.message);

            } finally {
                setLoading(false);
            }
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
        <KeyboardAvoidingView style={[[Styles.container, MyStyles.mHl10]]} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <View >
                        <Text style={[Styles.logoText, { marginTop: 30 }]}>Health app</Text>
                        <View style={{ alignItems: "center" }}>
                            <Avatar.Image style={[Styles.avatarView, { marginTop: 0 }]} size={150}
                                source={{ uri: user.avatar?.uri || defaultAvatar }} />
                        </View>
                        <HelperText type="erroe" visible={msg}>{msg}</HelperText>
                        {info.map(i =>
                            <TextInput placeholder={i.placeholder}
                                key={`Register${i.field}`}
                                placeholderColor="#c4c3cb"
                                style={Styles.loginFormTextInput}
                                value={user[i.field]}
                                secureTextEntry={i.secureTextEntry}
                                onChangeText={t => setState(t, i.field)}
                                keyboardType={i.field === "birth" ? "number-pad" : 'default'}
                                maxLength={i.field === "birth" ? 4 : undefined}
                            />)}
                        <Button style={MyStyles.button} textColor="white" onPress={picker}>Chọn ảnh đại diện</Button>
                        <Button disabled={loading} loading={loading} style={MyStyles.button} textColor="white" onPress={HandleRegister}>Đăng ký</Button>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Register;