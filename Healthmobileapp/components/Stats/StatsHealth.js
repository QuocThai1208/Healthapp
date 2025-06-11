import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, DataTable, TextInput } from "react-native-paper"
import { authApis, endpoints } from "../../configs/Apis";
import { ScrollView, View } from "react-native";
import Styles from "./Styles";


const StatsHealth = ({ userId }) => {
    const infos = [{
        field: "label",
        label: ""
    }, {
        field: "calo_burned",
        label: "Calo đốt"
    }, {
        field: "calo_intake",
        label: "Calo nạp vào"
    }, {
        field: "weight",
        label: "Cân nặng(kg)"
    },]
    const [healthProgress, setHealthProgress] = useState();
    const [loading, setLoading] = useState();
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');


    const loadHealProgress = async () => {
        try {
            setLoading(true)
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['healthProgressStats']}?id=${userId}&month=${month}&year=${year}`
            let res = await authApis(token).get(url)
            setHealthProgress(res.data)
        } catch (err) {
            console.log("load", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadHealProgress();
    }, [month, year])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: "row", padding: 6, marginBottom: 5, justifyContent: 'space-between' }}>
                <TextInput
                    style={{ backgroundColor: 'white', width: '49%', marginRight: 5 }}
                    mode="outlined"
                    label="Tháng"
                    keyboardType="number-pad"
                    onChangeText={(t) => setMonth(t)}
                />
                <TextInput
                    style={{ backgroundColor: 'white', width: '49%' }}
                    mode="outlined"
                    label="Năm"
                    keyboardType="number-pad"
                    onChangeText={(t) => setYear(t)}
                />
            </View>

            <View style={{ paddingHorizontal: 10 }}>
                <DataTable style={Styles.table}>
                    <DataTable.Header style={Styles.header}>
                        {infos.map(item => (
                            <DataTable.Title style={Styles.cell} key={`titleData${Math.random()}`}>{item.label}</DataTable.Title>
                        ))}
                    </DataTable.Header>

                    {!loading ? <>
                        {healthProgress?.map(item => (
                            <DataTable.Row style={Styles.row} key={`rowData${Math.random()}`}>
                                {infos.map(info => (
                                    <DataTable.Cell key={`cellData${Math.random()}`} style={Styles.cell}>{item[info.field]}</DataTable.Cell>
                                ))}
                            </DataTable.Row>
                        ))}
                    </> : <>
                        <ActivityIndicator />
                    </>}
                </DataTable>
            </View>

            <View style={{ paddingHorizontal: 10 }}>
                <DataTable style={Styles.table}>
                    <DataTable.Header style={Styles.header}>
                        <DataTable.Title style={[Styles.cell, { flex: 3 }]}></DataTable.Title>
                        <DataTable.Title style={[Styles.cell, { flex: 7 }]}>Ngày</DataTable.Title>
                    </DataTable.Header>

                    {!loading ? <>
                        {healthProgress?.map(item => (
                            <DataTable.Row style={Styles.row} key={`titleDate${Math.random()}`}>
                                <DataTable.Cell style={[Styles.cell, { flex: 3 }]}>{item.label}</DataTable.Cell>
                                <DataTable.Cell style={[Styles.cell, { flex: 7 }]}>{item.date}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </> : <>
                        <ActivityIndicator />
                    </>}
                </DataTable>
            </View>
        </ScrollView>
    )
}

export default StatsHealth;