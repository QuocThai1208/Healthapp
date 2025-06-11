import { View } from "react-native";
import { Card, Chip, Divider, Text } from "react-native-paper"
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";

const DietItem = ({ item }) => {
    const nav = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => nav.navigate("menuList", {
                "diet_id": item.id,
                "diet_name": item.name,
                "diet_url": item.image,
                "diet_des": item.describe
            })} >
            <Card style={Styles.cardContainer}>
                <View style={{ position: 'relative' }}>
                    <Card.Cover style={Styles.cardCover} source={{ uri: item.image }} />
                    <BlurView
                        intensity={20}
                        tint="light"
                        style={Styles.blurView}>
                        <Text style={Styles.blurText}>{item.name}</Text>
                    </BlurView>

                </View>
                <Card.Content style={{ marginVertical: 5 }}>
                    <Text numberOfLines={2} ellipsizeMode="tail" >{item.describe}</Text>
                </Card.Content>
                <Divider />
                <Chip icon="tag" style={Styles.chipStyle}>{item.health_goal.name}</Chip>
            </Card>
        </TouchableOpacity>
    )
}
export default DietItem;