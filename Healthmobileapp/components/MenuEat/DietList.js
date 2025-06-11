import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../styles/MyStyles";
import Styles from "./Styles";
import DietItem from "./DietItem";

const DietList = () => {
    const [loading, setLoading] = useState(false);
    const [health, setHealth] = useState();

    const [isFilterMode, setIsFilterMode] = useState(false);

    const [dietsAll, setDietsAll] = useState([]);
    const [pageAll, setPageAll] = useState(1);
    const [hasMoreAll, setHasMoreAll] = useState(true);

    const [dietsSuggested, setDietsSuggested] = useState([]);
    const [pageSuggested, setPageSuggested] = useState(0);
    const [hasMoreSuggested, setHasMoreSuggested] = useState(true);

    const loadHealth = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            if (token) {
                let res = await authApis(token).get(endpoints['healthInfo']);
                setHealth(res.data[0]);
            }
        } catch (err) {
            console.log("load health", err);
        }
    };

    const loadDiets = async (mode) => {
        try {
            setLoading(true);

            const page = mode === "filter" ? pageSuggested : pageAll;
            let url = `${endpoints['diets']}?page=${page}`;

            if (mode === "filter" && health?.health_goal?.id) {
                url += `&health_goal=${health.health_goal.id}`;
            }

            const res = await Apis.get(url);
            const results = res.data.results;

            if (mode === "filter") {
                setDietsSuggested(prev => [...prev, ...results]);
                setHasMoreSuggested(res.data.next !== null);
            } else {
                setDietsAll(prev => [...prev, ...results]);
                setHasMoreAll(res.data.next !== null);
            }

        } catch (err) {
            console.log("fetch diets error:", err);
            if (mode === "filter") setHasMoreSuggested(false);
            else setHasMoreAll(false);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (loading) return;

        if (isFilterMode && hasMoreSuggested) {
            setPageSuggested(prev => prev + 1);
        } else if (!isFilterMode && hasMoreAll) {
            setPageAll(prev => prev + 1);
        }
    };

    const handleToggleFilter = () => {
        setIsFilterMode(prev => !prev);

        if (!isFilterMode) {
            setDietsSuggested([]);
            setPageSuggested(1);
            setHasMoreSuggested(true);
        }
    };

    useEffect(() => {
        loadHealth();
    }, []);

    useEffect(() => {
        if (!isFilterMode) {
            loadDiets("all");
        }
    }, [pageAll]);

    useEffect(() => {
        if (isFilterMode) {
            loadDiets("filter");
        }
    }, [pageSuggested]);

    return (
        <SafeAreaView style={MyStyles.container}>
            <View style={Styles.headerDietContainer}>
                <Text style={Styles.headerText}>
                    Mục tiêu sức khỏe: {health?.health_goal?.name || "Chưa xác định"}
                </Text>
                <Button
                    style={[
                        MyStyles.button,
                        isFilterMode ? { backgroundColor: "#DC143C" } : null,
                    ]}
                    textColor="white"
                    onPress={handleToggleFilter}
                >
                    {isFilterMode ? "Tắt gợi ý" : "Gợi ý chế độ ăn"}
                </Button>
            </View>
            <View style={{ padding: 10 }}>
                <FlatList
                    data={isFilterMode ? dietsSuggested : dietsAll}
                    onEndReached={loadMore}
                    ListFooterComponent={loading && <ActivityIndicator />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <DietItem item={item} />}
                />
            </View>
        </SafeAreaView>
    );
};

export default DietList;
