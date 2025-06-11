import { FlatList, Image, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";

const InstructList = ({ route }) => {
    const exercise = route.params?.exercise
    const [instructs, setInstructs] = useState();
    const [loading, setLoading] = useState(false);

    const loadInstructs = async () => {
        if (exercise?.id) {
            try {
                setLoading(true)
                let res = await Apis.get(endpoints['instructInExercise'](exercise?.id))
                setInstructs(res.data)
            } catch (err) {
                console.log("load instruct", err)
            } finally {
                setLoading(false)
            }
        }
    }

    const renderHeader = () => (
        <>
            <Image
                style={{ width: '100%', height: 250, borderRadius: 20 }}
                source={{ uri: exercise?.image }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>{exercise?.name}</Text>
            <Text style={{ fontSize: 16, marginVertical: 10, opacity: 0.7 }}>{exercise?.describe}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10, color: '#36648B' }}>Hướng dẫn</Text>
        </>
    )

    useEffect(() => {
        loadInstructs();
    }, [])

    return (
        <FlatList
            style={[MyStyles.container, MyStyles.bgContainer, { padding: 10 }]}
            data={instructs}
            ListHeaderComponent={renderHeader}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'rgba(135, 206, 235, 0.2)', alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 50, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                        <Text>{item.name}</Text>
                    </View>
                    <Text style={{ flex: 1 }}>{item.describe}</Text>
                </View>

            )}
        />
    )
}

export default InstructList;