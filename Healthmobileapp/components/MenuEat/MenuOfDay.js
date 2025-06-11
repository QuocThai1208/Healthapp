import { useEffect, useState } from "react";
import { Text, View } from "react-native"
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { PaperProvider, ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../styles/MyStyles";
import Styles from "./Styles";
import IngredientInMenu from "./IngredientInMenu";
import MealList from "./MealList";

const MenuOfDay = ({ item, day }) => {
    const info = [{
        field: "kcal",
        label: "Kcal",
    }, {
        field: "fat",
        label: "Fat"
    }, {
        field: "protein",
        label: "Protein"
    }, {
        field: "starch",
        label: "Starch"
    }]
    const menuOfDayId = item.id
    const [ingredient, setIngredient] = useState();
    const [meals, setMeals] = useState();
    const [totalNutrients, setTotalNutrients] = useState();
    const [nutrientIntake, setNutrientIntake] = useState();

    const loadNutrientsIntake = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['nutrientIntake']}?menu-of-day=${item.id}`
            let res = await authApis(token).get(url)
            setNutrientIntake(res.data);
        } catch (err) {
            console.log("total nutrients", err)
        }
    }

    const loadTotalNutrients = async () => {
        try {
            let url = `${endpoints['totalNutrients']}?menu-of-day=${item.id}`
            let res = await Apis.get(url)
            setTotalNutrients(res.data);
        } catch (err) {
            console.log("total nutrients", err)
        }
    }

    const loadMeals = async () => {
        try {
            let url = `${endpoints['meals']}?menu-of-day=${menuOfDayId}`
            let res = await Apis.get(url)
            setMeals(res.data)
        } catch (err) {
            console.log("load ingredient", err)
        }
    }

    const loadIngredient = async () => {
        try {
            let url = `${endpoints['ingredientInMenu']}?menu_id=${item.id}`
            let res = await Apis.get(url)
            setIngredient(res.data)
        } catch (err) {
            console.log("load ingredient", err)
        }
    }

    useEffect(() => {
        loadIngredient();
        loadMeals();
        loadTotalNutrients();
        loadNutrientsIntake();
    }, [])

    return (
        <PaperProvider>
            <View style={[MyStyles.bgContainer, { paddingHorizontal: 20 }]}>
                <View style={Styles.headerBox}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Ngày {item.day}/{day}</Text>
                </View>
                <View>
                    <Text style={Styles.sectionTitle}>Tổng dinh dưỡng cần nạp</Text>
                    {info.map((i) => (
                        <View key={i.field} style={Styles.nutrientRow}>
                            <Text style={Styles.nutrientLabel}>{i.label}</Text>
                            <View style={Styles.nutrientBar}>
                                <ProgressBar
                                    progress={nutrientIntake?.[i.field] / totalNutrients?.[i.field] || 0}
                                    style={{ height: 5, borderRadius: 5 }} color="#4CAF50" />
                            </View>
                            <Text style={Styles.nutrientValue}>{nutrientIntake?.[i.field]}/{totalNutrients?.[i.field]} gr</Text>
                        </View>
                    ))}
                </View>

                {ingredient?.map((item) => (
                    <IngredientInMenu key={item.id} item={item} />
                ))}

                {meals?.map((item) => (
                    <MealList key={item.id} item={item} menuOfDayId={menuOfDayId} />
                ))}

            </View>
        </PaperProvider>
    )
}

export default MenuOfDay;