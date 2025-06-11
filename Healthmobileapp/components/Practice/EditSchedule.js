import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native"
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Card, Text, TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import Styles from "./Styles";
import MyStyles from "../../styles/MyStyles";

const EditSchedule = ({ route }) => {
    const scheduleId = route.params?.scheduleId

    const nav = useNavigation();

    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [userSchedule, setUserSchedule] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [name, setName] = useState();

    const loadUserSchedule = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).get(endpoints['personalScheduleActive'])
            setUserSchedule(res.data)
            setName(res.data[0]?.schedule?.name)
        } catch (err) {
            console.log("loadUserSchedule", err)
        }
    }

    const loadSessions = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).get(endpoints["personalSessions"](scheduleId));
            setSessions(res.data);
        } catch (err) {
            console.log("load session", err);
        } finally {
        }
    }

    const deleteSession = async (itemId, rowMap) => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await authApis(token).delete(endpoints['sessionDetail'](itemId));
            if (res.status === 204) {
                if (rowMap[itemId]) {
                    rowMap[itemId].closeRow();
                }
                await loadSessions()
            }
        } catch (err) {
            console.log("delete user schedule", err)
        } finally {
        }
    }

    const renderSessions = ({ item }) => {
        return (
            <View>
                <Card style={Styles.carSessiondEdit}>
                    <Text style={MyStyles.lableText}>{item.name}</Text>
                </Card>
            </View>
        )
    }

    const renderHiddenDelete = ({ item }, rowMap) => {
        return (
            <View style={MyStyles.pH10}>
                <View style={Styles.rowBack}>
                    <TouchableOpacity
                        style={Styles.deleteButton}
                        onPress={() => deleteSession(item.id, rowMap)}
                    >
                        <Text style={{ color: "white" }}><Ionicons name="trash-outline" size={24} /></Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const updateName = async () => {
        try {
            setLoadingUpdate(true);
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).patch(endpoints['personalScheduleById'](scheduleId), {
                name: name
            })
            nav.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "mainPractice" }]
                })
            )
        } catch (err) {
            console.log("update name", err)
        } finally {
            setLoadingUpdate(false)
        }

    }

    useEffect(() => {
        loadUserSchedule();
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadSessions();
        }, [])
    )

    useLayoutEffect(() => {
        nav.setOptions({
            headerLeft: () => (
                <Ionicons name="close" size={30} onPress={() => {
                    nav.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "mainPractice" }]
                        })
                    )
                }} />
            )
        })
    })

    useLayoutEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity disabled={name === userSchedule[0]?.schedule?.name}
                    onPress={() => updateName()} >
                    <Ionicons name="checkmark-outline" size={30} />
                </TouchableOpacity>
            )
        })
    }, [name, userSchedule])

    return (
        <View style={[MyStyles.p10, MyStyles.container, { backgroundColor: 'white' }]}>
            <View>
                <Text style={[MyStyles.lableText, MyStyles.mB10]}>Tên kế hoạch tập:</Text>
                <TextInput
                    value={name}
                    onChangeText={(t) => setName(t)}
                    style={{ backgroundColor: 'white' }}
                    placeholder="Nhập tên...."
                />

                <SwipeListView
                    data={sessions}
                    renderItem={renderSessions}
                    renderHiddenItem={renderHiddenDelete}
                    rightOpenValue={-80}
                    disableRightSwipe
                    keyExtractor={(item) => item.id.toString()}
                />

                <TouchableOpacity
                    onPress={() => nav.navigate("editSession", { "scheduleId": scheduleId })}
                    style={Styles.addButtonContainer}>
                    <Text style={Styles.addButtonText}>Thêm ngày tập luyện</Text>
                    <Ionicons name="add-circle-outline" size={24} color='#00CCFF' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditSchedule;