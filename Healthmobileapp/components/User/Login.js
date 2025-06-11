import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Styles from "./Styles"
import { Button, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import qs from "qs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/Contexts";
import MyStyles from "../../styles/MyStyles";
import Constants from 'expo-constants';

const { clientId, clientSecret } = Constants.expoConfig.extra;

const Login = () => {
    const info = [{
        placeholder: "Tên đăng nhập",
        field: "username",
        secureTextEntry: false,
    }, {
        placeholder: "Mật khẩu",
        field: "password",
        secureTextEntry: true,
    }];
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState();
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);


    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }


    const validate = () => {
        if (Object.values(user).length === 0) {
            setMsg("Vui lòng nhập thông tin!");
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
        }

        setMsg("");
        return true;
    }

    const checkStatuLogin = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            if (token) {
                let u = await authApis(token).get(endpoints['currentUser']);

                dispatch({
                    "type": "login",
                    "payload": u.data,
                });
            }
        } catch (err) {
            console.log("Home", err);
        }
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let res = await Apis.post(endpoints['login'],
                    qs.stringify({
                        ...user,
                        client_id: clientId,
                        client_secret: clientSecret,
                        grant_type: 'password'
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                await AsyncStorage.setItem('token', res.data.access_token);

                let u = await authApis(res.data.access_token).get(endpoints['currentUser']);

                dispatch({
                    "type": "login",
                    "payload": u.data,
                });

            } catch (error) {
                Alert.alert("Thông báo", "Tài khoản hoặc mật khẩu không đúng")
                console.log("Register failed:", error.message);

            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        checkStatuLogin();
    }, [])

    return (
        <KeyboardAvoidingView style={[Styles.container, MyStyles.mHl10]} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={Styles.container}>
                    <View >
                        <Text style={Styles.logoText}>Health app</Text>
                        <HelperText type="erroe" visible={msg}>{msg}</HelperText>
                        {info.map(i =>
                            <TextInput placeholder={i.placeholder}
                                key={`Login${i.field}`}
                                placeholderColor="#c4c3cb"
                                style={Styles.loginFormTextInput}
                                value={user[i.field]}
                                secureTextEntry={i.secureTextEntry}
                                onChangeText={t => setState(t, i.field)}
                            />)}
                        <Button disabled={loading} loading={loading} style={MyStyles.button} textColor="white" onPress={login}>Login</Button>
                        <Button disabled={loading} loading={loading} style={MyStyles.button} textColor="white" onPress={() => nav.navigate("register")}>Register</Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
export default Login;