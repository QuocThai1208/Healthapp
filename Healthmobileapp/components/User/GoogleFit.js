import { SafeAreaView, ScrollView, Text, View } from "react-native"
import { Button, Icon } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import Apis, { endpoints } from "../../configs/Apis";
import { useCallback, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "./Styles";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";

const loginGooleFit = () => {
    Linking.openURL("https://thaipham.pythonanywhere.com" + endpoints.loginGoogleFit);
};

const GoogleFit = () => {
    const [healthData, setHealthData] = useState({});

    const logout = () => {
        AsyncStorage.removeItem("access_token_google_fit");
        setHealthData({});
    };

    const loadHealthData = async (token) => {
        try {

            let res = await Apis.get(endpoints['healthFromGoogleFit'](token));
            setHealthData(res.data)
        } catch {

        } finally {

        }
    };

    const checkStatuLogin = async () => {
        try {
            let token = await AsyncStorage.getItem("access_token_google_fit")
            if (token) {
                loadHealthData(token);
            }
        } catch (err) {

        } finally {

        }
    }
    useFocusEffect(
        useCallback(() => {
            checkStatuLogin
        }, [])
    )

    useEffect(() => {
        const handleDeepLink = (event) => {
            const data = Linking.parse(event.url);
            const token = data.queryParams?.access_token_google_fit;
            if (token) {
                AsyncStorage.setItem("access_token_google_fit", token);
                loadHealthData(token);
            }
        };
        //nếu app đang mở và được truyền vào url
        const subscription = Linking.addEventListener("url", handleDeepLink);

        return () => subscription.remove();
    }, []);

    return (
        <SafeAreaView style={Styles.container}>
            <ScrollView >
                {Object.keys(healthData).length > 0 ? <>
                    <View style={[Styles.fontItem, Styles.rowCenter]} >
                        <Ionicons name="walk-outline" size={30} color="green" />
                        <Text style={[Styles.fontItem, Styles.fontTextGoogleFit]}>Bước chân : {healthData["steps"]}</Text>
                    </View>
                    <View style={[Styles.fontItem, Styles.rowCenter]} >
                        <Icon size={30} source="water-outline" color="blue" />
                        <Text style={[Styles.fontItem, Styles.fontTextGoogleFit]} >Lượng nước uống : {healthData["water_inTake(Lit)"]}</Text>
                    </View>
                    {healthData["heart_rate()"]?.[0]?.map((val, index) => (
                        <View key={index} style={[Styles.fontItem, Styles.rowCenter]} >
                            <Ionicons size={30} name="pulse-outline" color="red" />
                            <Text style={[Styles.fontItem, Styles.fontTextGoogleFit]}>Nhịp tim đo lần {index + 1}: {val.toFixed(2)}</Text>
                        </View>
                    ))}

                    <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                        <Button onPress={logout} style={MyStyles.button} textColor="white">Đăng xuất</Button>
                    </View>
                </> : <>
                    <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                        <Button onPress={loginGooleFit} style={MyStyles.button} textColor="white">Đăng nhập google fit</Button>
                    </View>
                </>}
            </ScrollView>
        </SafeAreaView >
    )
}

export default GoogleFit;