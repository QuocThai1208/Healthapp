import { Text, TouchableOpacity, View, Modal, ScrollView } from "react-native";
import { Button, Card, Divider, Portal, TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import Styles from "./Styles";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../styles/MyStyles";
import { Picker } from "@react-native-picker/picker";


const HealthView = () => {
    const infoHealth = [{
        label: "Chiều cao",
        field: "height"
    }, {
        label: "Cân nặng",
        field: "weight"
    },
    {
        label: "Mục tiêu sức khỏe",
        field: "health_goal"
    }]
    const [healthVisible, setHealthVisible] = useState(false);
    const [health, setHealth] = useState({});
    const [tempHealth, setTempHealth] = useState({});
    const [healthGoals, setHealthGoals] = useState([]);
    const [loading, setLoading] = useState(false);

    const setStateTempHealth = (value, field) => {
        if (field === "health_goal") {
            const selected = healthGoals.find((h) => String(h.id) === value);
            setTempHealth(prev => ({ ...prev, [field]: selected?.id }));
        } else {
            setTempHealth(prev => ({ ...prev, [field]: value }));
        }
    }

    const loadHealth = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            if (token) {
                let res = await authApis(token).get(endpoints['healthInfo']);
                setHealth(res.data[0]);
            }
        } catch (err) {
            console.error("loadHealth", err)
        } finally {

        }
    };


    const loadHealthGoals = async () => {
        try {
            let res = await Apis.get(endpoints['healthGoals']);
            setHealthGoals(res.data);
        } catch (err) {
            console.log("loadHealthGoal: ", err)
        } finally {

        }
    };

    const patchHealth = async () => {
        try {
            setLoading(true)
            let token = await AsyncStorage.getItem("token");
            if (token) {
                let res = await authApis(token).patch(endpoints['updateHealthInfo'](health['id']), {
                    ...tempHealth
                });
                loadHealth();
            }
        } catch (err) {
            console.log("patch", err)
        } finally {
            setLoading(false)
            setHealthVisible(false)
        }
    }

    const postHealth = async () => {
        try {
            setLoading(true)
            let token = await AsyncStorage.getItem("token");

            if (token) {
                let res = await authApis(token).post(endpoints['healthInfo'], {
                    ...tempHealth
                });
                loadHealth();
            }
        } catch (err) {
            console.error("post", err)
        } finally {
            setLoading(false)
            setHealthVisible(false)
        }
    }

    useEffect(() => {
        loadHealth();
        loadHealthGoals();
    }, []);

    return (
        <ScrollView>
            {health ? <>
                {infoHealth.map(i =>
                    <View key={`Profile${i.field}`} >
                        <Text style={[Styles.fontText, Styles.fontItem]} >{i.label + " : " + (health?.[i.field]?.name || health?.[i.field] || "Không có")}</Text>
                        <Divider />
                    </View>
                )}
                <View>
                    <Text style={[Styles.fontText, Styles.fontItem]}>BMI : {Math.round(health['weight'] / ((health['height'] / 100) ** 2) * 100) / 100}</Text>
                    <Divider />
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <Button style={[MyStyles.button]} textColor="white" onPress={() => setHealthVisible(true)}>
                        <Ionicons name='create-outline' size={24} />
                    </Button>
                </View>
            </> : <>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <Button style={[MyStyles.button]} textColor="white" onPress={() => setHealthVisible(true)}>
                        Thêm thông tin
                    </Button>
                </View>
            </>}

            <Portal>
                <Modal
                    visible={healthVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setHealthVisible(false)}
                >
                    <View style={Styles.centerView}>
                        <Card style={[Styles.healthModal, { position: 'relative' }]}>
                            <Card.Content style={{ width: '100%', height: '100%' }}>
                                <TouchableOpacity onPress={() => setHealthVisible(false)}>
                                    <Ionicons name='close-outline' size={24} style={{ marginBottom: 20 }} />
                                </TouchableOpacity>
                                {infoHealth.map(i =>
                                    <View key={`Profile${i.field}`} >
                                        <Text style={{ marginVertical: 20 }}>{i.label}</Text>
                                        {i.field === "health_goal" ? <>
                                            <Picker
                                                selectedValue={String(tempHealth?.[i.field])}
                                                onValueChange={itemValue => {
                                                    setStateTempHealth(itemValue, i.field);
                                                }}
                                            >
                                                {healthGoals.map((h) => (
                                                    <Picker.Item key={h.id} label={h.name} value={String(h.id)} />
                                                ))}
                                            </Picker>
                                        </> : <>
                                            <TextInput
                                                placeholder={String(tempHealth?.[i.field]?.name || tempHealth?.[i.field] || "")}
                                                onChangeText={t => setStateTempHealth(t, i.field)}
                                            />
                                        </>}
                                    </View>
                                )}
                            </Card.Content>
                            <Button disabled={loading} loading={loading}
                                style={Styles.button}
                                onPress={health?.id ? patchHealth : postHealth}
                                textColor="white">Lưu</Button>
                        </Card>
                    </View>
                </Modal>
            </Portal>

        </ScrollView>
    )
}

export default HealthView;