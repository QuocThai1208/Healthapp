import { Image, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import Styles from "./Styles";
import MyStyles from "../../styles/MyStyles";

const IngredientInMenu = ({ item }) => {
    return (
        <View >
            <View style={Styles.itemContainer}>
                <Image style={{ width: 40, height: 40, marginRight: 20 }} source={{ uri: item.ingredient.image }} />
                <View style={[Styles.infoRow, MyStyles.container]}>
                    <Text style={{ fontWeight: 500 }}>{item.ingredient.name}</Text>
                    <Text style={{ fontWeight: 500 }}>{item.unit} gr</Text>
                </View>
            </View>
            <Divider />
        </View>
    )
}

export default IngredientInMenu;