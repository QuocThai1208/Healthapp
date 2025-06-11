import { useEffect, useState } from "react";
import { Alert, FlatList, Image, TouchableOpacity, View } from "react-native"
import { Button, Card, List, Text, TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../styles/MyStyles";
import { authApis, endpoints } from "../../configs/Apis";

const EditSession = ({ route }) => {
    const scheduleId = route.params?.scheduleId
    const nav = useNavigation();

    const [selected, setSelected] = useState([]);
    const [name, setName] = useState();

    const postSession = async () => {
        if (validate() === true) {
            try {
                let token = await AsyncStorage.getItem('token')
                let exerciseId = []
                selected.forEach((item) => {
                    exerciseId.push(item.id)
                })
                let res = await authApis(token).post(endpoints['sessionList'], {
                    content_type: 'personalschedule',
                    object_id: scheduleId,
                    name: name,
                    exercise_write: exerciseId
                })

            } catch (err) {
                console.log("postsession", err)
            } finally {
                nav.goBack()
            }
        }
    }

    const validate = () => {
        if (!name || name.trim() === "") {
            Alert.alert("Thông báo", "Vui lòng nhập tên")
            return false;
        }

        if (selected.length === 0) {
            Alert.alert("Thông báo", "Vui lòng thêm bài tập")
            return false;
        }

        return true;
    }



    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, position: 'relative' }}>
            <View>
                <Text style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }}>Kế hoạch tập trong ngày:</Text>
                <TextInput
                    onChangeText={(t) => setName(t)}
                    style={{ backgroundColor: 'white' }}
                    placeholder="Nhập tên...."
                />

                <FlatList
                    data={selected}
                    renderItem={({ item }) => (
                        <Card
                            style={{ backgroundColor: 'white', marginBottom: 10, paddingHorizontal: 10 }}
                            key={item.id}>
                            <List.Item
                                title={item.name}
                                titleNumberOfLines={0}
                                titleStyle={{ flexWrap: 'wrap' }}
                                left={() => <Image style={Styles.imageExcercise} source={{ uri: item.image }} />}
                            />
                        </Card>
                    )}
                />

                <TouchableOpacity
                    onPress={() => nav.navigate("selectExercise", {
                        onSelect: (selectedExercises) => {
                            setSelected(selectedExercises);
                        }
                    })}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, padding: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 500, color: '#00CCFF' }}>Thêm bài tập mới</Text>
                    <Ionicons name="add-circle-outline" size={24} color='#00CCFF' />
                </TouchableOpacity>
            </View>

            <View style={Styles.bottomButtonBar}>
                <Button
                    onPress={() => nav.goBack()}
                    style={[MyStyles.button, Styles.buttonWhiteOutline]}
                    textColor="#36648B">Bỏ</Button>
                <Button
                    onPress={() => postSession()}
                    style={[MyStyles.button, { width: '49%' }]} textColor="white">Lưu</Button>
            </View>
        </View>
    )
}

export default EditSession;