import { Image, Text, TouchableOpacity, View } from "react-native"
import { authApis, endpoints } from "../../configs/Apis";
import { Divider, } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "./Styles";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";


const MealList = ({ item, menuOfDayId }) => {
    const [ingredientMeal, setIngredientMeal] = useState();

    const nav = useNavigation();

    const loadIngredientMeal = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['userIngredients']}?menu-of-day=${menuOfDayId}`
            let res = await authApis(token).get(url)
            setIngredientMeal(res.data);
        } catch (err) {
            console.log("total nutrients", err)
        }
    }

    useEffect(() => {
        loadIngredientMeal();
    }, [])
    return (
        <View>
            <View style={Styles.mealContainer}>
                <View style={Styles.mealHeader}>
                    <View style={Styles.mealTitle}>
                        <Ionicons color="#36648B" name="restaurant-outline" size={30} />
                        <Text style={Styles.mealTitleText}>{item.name_display}</Text>
                    </View>
                    <TouchableOpacity onPress={() => nav.navigate('ingredientList', { "meal_id": item.id })} >
                        <Ionicons color="#36648B" name="add-circle-outline" size={"30"} />
                    </TouchableOpacity>
                </View>
                <View style={Styles.ingredientWrap}>
                    {ingredientMeal
                        ?.filter((i) => i.meal === item.id)
                        .map((i) => (
                            <View key={i.id} style={{ marginHorizontal: 5 }}>
                                <Image style={{ width: 50, height: 50 }} source={{ uri: i.ingredient.image }} />
                                <Text style={Styles.ingredientUnit}>{i.unit} gr</Text>
                            </View>
                        ))
                    }
                </View>
                <Text style={Styles.suggestionTitle}>Giợi ý</Text>
                {item.suggest_dish.map((i) => (
                    <View key={i.id}>
                        <Text>- {i.name}</Text>
                    </View>
                ))}
            </View>
            <Divider />
        </View>
    )
}

export default MealList;