import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Checkbox, Divider, PaperProvider, RadioButton, Searchbar, Text, TextInput } from "react-native-paper"
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { FlatList, Image, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";

const IngredientList = ({ route }) => {
    const meal_id = route.params?.meal_id
    const nav = useNavigation();

    const [searchQuery, setSearchQuery] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);

    const toggleSelection = (id) => {
        setSelected((prev) => {
            const exists = prev.find(item => item.id === id)
            if (exists) {
                return prev.filter(item => item.id !== id)
            }
            else {
                return [...prev, { id, unit: 0 }]
            }
        })
    }

    const updateUnit = (id, unit) => {
        setSelected((prev) =>
            prev?.map(item => item.id === id ? { ...item, unit: parseInt(unit) || 0 } : item)
        )
    }

    const postSelected = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            for (const item of selected) {
                const res = await authApis(token).post(endpoints['userIngredients'], {
                    meal: meal_id,
                    ingredient: item.id,
                    unit: item.unit
                })
            }
        } catch (err) {
            console.log("post selected", err)
        } finally {
            nav.goBack()

        }
    }

    const loadIngredients = async () => {
        if (page > 0) {
            try {
                setLoading(true)
                let url = `${endpoints['ingredients']}?page=${page}`
                if (searchQuery) {
                    url += `&q=${searchQuery}`
                }
                const res = await Apis.get(url)
                setIngredients([...ingredients, ...res.data.results])
                if (res.data.next === null) {
                    setPage(0)
                }
            } catch (err) {
                console.log("load ingredient", err)
            } finally {
                setLoading(false)
            }
        }
    }

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(prev => prev + 1)
        }
    }

    const search = (value, callback) => {
        callback(value)
        setPage(1)
        setIngredients([])
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            loadIngredients();
        }, 500)
        return () => clearTimeout(timer)
    }, [page, searchQuery])

    return (
        <PaperProvider>
            <View style={{ backgroundColor: 'white', padding: 10, flex: 1 }}>
                <Searchbar
                    style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'black' }}
                    placeholder="Nhập tên nguyên liệu..."
                    onChangeText={t => search(t, setSearchQuery)}
                    value={searchQuery}
                />
                <FlatList
                    data={ingredients}
                    onEndReached={loadMore}
                    ListFooterComponent={loading && <ActivityIndicator />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <View style={Styles.itemContainer}>
                                <View style={Styles.checkboxWrapper}>
                                    <Checkbox
                                        color="black"
                                        status={selected?.some((i) => i.id === item.id) ? 'checked' : 'unchecked'}
                                        onPress={() => toggleSelection(item.id)}
                                    />
                                </View>
                                <Image style={Styles.ingredientImage} source={{ uri: item.image }} />
                                <View style={Styles.itemContent}>
                                    <Text style={{ fontWeight: 500 }}>{item.name}</Text>
                                    <View style={Styles.inputWrapper}>
                                        <TextInput
                                            disabled={!selected?.some((i) => i.id === item.id)}
                                            style={Styles.input}
                                            mode="outlined"
                                            keyboardType="number-pad"
                                            value={selected?.find(i => i.id === item.id)?.unit?.toString() || ''}
                                            onChangeText={(t) => updateUnit(item.id, t)}
                                        />
                                        <Text style={Styles.unitText}>gr</Text>
                                    </View>
                                </View>
                            </View>
                            <Divider />
                        </View>
                    )}
                />
                <Button
                    disabled={selected.length === 0}
                    style={[MyStyles.button, { alignSelf: 'center' }]}
                    textColor="white"
                    onPress={() => postSelected()}
                >LƯU</Button>
            </View>
        </PaperProvider>
    )
}

export default IngredientList;