import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, DataTable, Text, TextInput } from "react-native-paper";
import { authApis, endpoints } from "../../configs/Apis";
import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Styles, { chartConfig } from "./Styles";

const StatsPractice = ({ userId }) => {
    const [healthPractice, setHealthPractice] = useState([])
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);

    const loadHealthProgress = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['practiceStats']}?id=${userId}&month=${month}&year=${year}`
            let res = await authApis(token).get(url)
            setHealthPractice(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHealthProgress();
    }, [month, year])


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={Styles.inputRow}>
                <TextInput
                    style={[Styles.inputBox, { marginRight: 5 }]}
                    mode="outlined"
                    label="Tháng"
                    keyboardType="number-pad"
                    onChangeText={(t) => setMonth(t)}
                />
                <TextInput
                    style={Styles.inputBox}
                    mode="outlined"
                    label="Năm"
                    keyboardType="number-pad"
                    onChangeText={(t) => setYear(t)}
                />
            </View>

            {healthPractice.length > 0 ? <>
                <View style={{ marginBottom: 10 }}>
                    <Text style={Styles.chartTitle}>Biểu đồ lượng calo tiêu thụ</Text>
                    <LineChart
                        data={{
                            labels: healthPractice?.map(item => item.label),
                            datasets: [
                                {
                                    data: healthPractice?.map(item => item.calo)
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width}
                        height={220}
                        yAxisInterval={1}
                        chartConfig={chartConfig}
                    />
                </View>

                <View >
                    <Text style={Styles.chartTitle}>Biểu đồ thời gian tập luyện:</Text>
                    <LineChart
                        data={{
                            labels: healthPractice?.map(item => item.label),
                            datasets: [
                                {
                                    data: healthPractice.map(item => item.practice_time)
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width}
                        height={220}
                        yAxisInterval={1}
                        chartConfig={chartConfig}
                        bezier
                    />
                </View>

                <View style={{ paddingHorizontal: 10 }}>
                    <DataTable style={Styles.table}>
                        <DataTable.Header style={Styles.header}>
                            <DataTable.Title style={[Styles.cell, { flex: 3 }]}></DataTable.Title>
                            <DataTable.Title style={[Styles.cell, { flex: 7 }]}>Ngày</DataTable.Title>
                        </DataTable.Header>

                        {!loading ? <>
                            {healthPractice?.map(item => (
                                <DataTable.Row style={Styles.row} key={Math.random()}>
                                    <DataTable.Cell style={[Styles.cell, { flex: 3 }]}>{item.label}</DataTable.Cell>
                                    <DataTable.Cell style={[Styles.cell, { flex: 7 }]}>{item.date}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </> : <>
                            <ActivityIndicator />
                        </>}
                    </DataTable>
                </View>
            </> : <>
                <Text style={{ fontSize: 16, fontWeight: 600, marginVertical: 5, padding: 5 }}>Không có dữ kiệu</Text>
            </>}

        </ScrollView>
    )
}

export default StatsPractice;