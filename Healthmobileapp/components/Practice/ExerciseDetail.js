import { useCallback, useEffect, useMemo, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import Apis, { authApis, endpoints } from "../../configs/Apis"
import { Button, Card, Divider, TextInput } from "react-native-paper"
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import Styles from "../Practice/Styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from 'date-fns';
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";

const ExerciseDetail = ({ route }) => {
    const infoPredictedInput = [{
        field: "weight",
        label: "Kilogram",
    }, {
        field: "rep",
        label: "rep",
    }]
    const today = format(new Date(), 'dd/MM/yyyy')
    const session_id = route.params?.session_id
    const exercise_id = route.params?.excercise_id
    const schedule_id = route.params?.schedule_id
    const day = route.params?.day

    const [predictedInput, setPredictedInput] = useState({});
    const [predictedResult, setPredictedResult] = useState({});
    const [loading, setLoading] = useState(false);
    const [actual, setActual] = useState({});
    const [exercise, setExercise] = useState({});

    const nav = useNavigation();

    const todaySet = useMemo(() => {
        return predictedResult?.[today]?.length || 0
    }, [today, predictedResult])

    const setState = useCallback((value, field) => {
        setPredictedInput(prev => ({ ...prev, [field]: value }))
    }, [])

    const loadActual = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints["actualResult"](exercise_id, schedule_id))
            setActual(res.data)
        } catch (err) {
            console.log("loadActual", err)
        } finally {
            setLoading(false);
        }
    }

    const loadExcercise = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['exercisesDetail'](exercise_id));
            setExercise(res.data);
        } catch (err) {
            console.log("load excercise", err);
        } finally {
            setLoading(false);
        }
    }

    const postPredictedResult = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem("token");
            let payload = {
                rep: predictedInput.rep,
                weight: predictedInput.weight,
                session: session_id,
                exercise: exercise_id,
                day: day
            };
            let res = await authApis(token).post(endpoints['predictedResult'], payload);
            if (res.status === 201) {
                loadPredictedResult();
            }
        } catch (err) {
            console.log("post predictedResult", err);
        } finally {
            setLoading(false);
        }
    }

    const loadPredictedResult = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem("token");
            let url = `${endpoints['predictedResult']}?exercise_id=${exercise_id}&session_id=${session_id}&day=${day}`
            let res = await authApis(token).get(url);
            setPredictedResult(res.data);
        } catch (err) {
            console.log("load predicted result", err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadActual();
    }, [schedule_id, exercise_id])

    useEffect(() => {
        loadExcercise();
    }, [exercise_id])

    useEffect(() => {
        loadPredictedResult();
    }, [])
    return (
        <ScrollView style={[MyStyles.container, MyStyles.bgContainer]}>
            <Card>
                <View style={{ position: 'relative' }}>
                    <Card.Cover style={{ margin: 10 }} source={{ uri: exercise?.image }} />
                    <View style={{ position: 'absolute', backgroundColor: 'white', borderRadius: 10, right: 10, top: 10 }}>
                        <Ionicons
                            onPress={() => nav.navigate("instructList", { exercise })}
                            name="information-circle-outline"
                            size={40}
                            color="#36648B" />
                    </View>
                </View>
                <Card.Title titleStyle={Styles.bold} title={exercise?.name} />
                <Card.Content>
                    {actual[0]?.weight && <Text style={Styles.mb}>Mức tạ khuyến nghị: <Text style={Styles.bold}>{actual[0]?.weight}</Text></Text>}
                    <View style={Styles.statsRow}>
                        <View>
                            <View style={[Styles.circle, Styles.mb]}>
                                <Text style={Styles.bold}>{actual[0]?.rep || '-'}</Text>
                            </View>
                            <Text>Rep yêu cầu</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Progress.Circle
                                style={Styles.mb}
                                size={80}
                                progress={actual[0]?.set ? todaySet / actual[0]?.set : 1}
                                color="#00CCFF"
                                unfilledcolor="#00CCFF"
                                showsText={true}
                                formatText={() => actual[0]?.set ? `${todaySet}/${actual[0]?.set}` : predictedResult?.[today]?.length}
                                textStyle={Styles.bold}
                            />
                            <Text>Set tập</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
            <View style={Styles.infoRow}>
                {infoPredictedInput.map(i =>
                    <TextInput
                        key={`PredictedResult${i.field}`}
                        mode="outlined"
                        style={Styles.fontInput}
                        label={i.label}
                        onChangeText={t => setState(t, i.field)}
                    />
                )}
                <Button
                    disabled={loading}
                    loading={loading}
                    onPress={() => {
                        postPredictedResult();
                    }}
                    style={Styles.button}>
                    <Ionicons name="add-outline" color="white" style={{ fontWeight: "bold" }} size={24} />
                </Button>
            </View>
            {Object.keys(predictedResult).length > 0 ? <>
                {Object.entries(predictedResult).map(([date, items]) => (
                    <View key={date} style={{ margin: 10 }}>
                        <View style={{ borderRadius: 5, overflow: 'hidden', borderWidth: 1, borderColor: 'balck' }}>
                            <View style={Styles.dateHeader}>
                                <Text>{date}</Text>
                            </View>
                            <Divider />
                            {items.map(i => (
                                <View key={i.id}>
                                    <View style={Styles.entryRow}>
                                        <Text style={{ color: "#36648B" }}>#{i.set}</Text>
                                        <Text>{i.weight} kg x {i.rep} rep</Text>
                                        <Text>{i.created_time_only}</Text>
                                    </View>
                                    <Divider />
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </> : <>
                <View style={MyStyles.centerContent}>
                    <Text>Chưa có kết quả </Text>
                </View>
            </>}

        </ScrollView>
    )
}
export default ExerciseDetail;