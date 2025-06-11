import { View } from "react-native"
import Styles from "./Styles";
import { Card, Text } from "react-native-paper";

const ResultItem = ({ route }) => {
    const item = route.params?.item

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={[Styles.cardRow, { flex: 0 }]}>
                <Card style={[Styles.cardHalf, { marginRight: 15 }]}>
                    <Card.Content>
                        <Text style={Styles.cardContentCenter}>{item?.practice_time?.split('.')[0]}</Text>
                        <Text style={{ alignSelf: 'center' }} >Thời lượng tập luyện</Text>
                    </Card.Content>
                </Card>

                <Card style={Styles.cardHalf}>
                    <Card.Content>
                        <Text style={Styles.cardContentCenter}>{item?.calo}</Text>
                        <Text tyle={{ alignSelf: 'center' }} >Calo tiêu thụ</Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={{ paddingHorizontal: 10, marginVertical: 10, }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Cảm nhận buổi tập: </Text>
                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: 'black', padding: 10, marginTop: 10 }}>
                    <Text>{item.workout_notes || "Chưa có cảm nhận"}</Text>
                </View>
            </View>
        </View>
    )
}

export default ResultItem;