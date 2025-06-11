import { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native"
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, Button, Checkbox, List, Text } from "react-native-paper";
import Styles from "./Styles";
import MyStyles from "../../styles/MyStyles";
import { useNavigation, useRoute } from "@react-navigation/native";

const SelectExercise = () => {
    const route = useRoute();
    const nav = useNavigation();

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [selected, setSelected] = useState([]);

    const toggleSelection = (id, name, image) => {
        setSelected((prev) => {
            const exists = prev.find(item => item.id === id)
            if (exists) {
                return prev.filter(item => item.id !== id)
            }
            else {
                return [...prev, { id, name: name, image: image }]
            }
        })
    }


    const loadExcercises = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url = `${endpoints['exercises']}?page=${page}`
                let res = await Apis.get(url);
                setExercises([...exercises, ...res.data.results]);
                if (res.data.next === null) {
                    setPage(0)
                }
            } catch (err) {
                console.log("load excercise", err);
            } finally {
                setLoading(false)
            }
        }
    }

    const handleGoBack = () => {
        if (route.params?.onSelect) {
            route.params.onSelect(selected); // Gửi dữ liệu về màn hình trước
        }
        nav.goBack();
    };

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(prev => prev + 1)
        }
    }

    useEffect(() => {
        loadExcercises();
    }, [page])


    return (
        <View style={[MyStyles.container, MyStyles.p10, MyStyles.relative, { backgroundColor: 'white' }]}>
            <View style={MyStyles.pV10}>
                <Text style={MyStyles.lableText}>Đã chọn: {selected.length || "0"}</Text>
            </View>
            <FlatList
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator />}
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                style={{ marginBottom: 80 }}
                renderItem={({ item }) =>
                    <List.Item
                        title={item.name}
                        titleNumberOfLines={0}
                        titleStyle={{ flexWrap: 'wrap' }}
                        left={() => <Image style={Styles.imageExcercise} source={{ uri: item.image }} />}
                        right={() => <View style={Styles.checkboxContainer}>
                            <View style={Styles.checkboxWrapper}>
                                <Checkbox
                                    color="black"
                                    status={selected?.some((i) => i.id === item.id) ? 'checked' : 'unchecked'}
                                    onPress={() => toggleSelection(item.id, item.name, item.image)}
                                />
                            </View>
                        </View>}
                    />
                }
            />
            <View style={Styles.bottomButtonBar}>
                <Button
                    onPress={() => setSelected([])}
                    style={[MyStyles.button, Styles.buttonWhiteOutline]}
                    textColor="#36648B">Bỏ</Button>
                <Button
                    onPress={() => handleGoBack()}
                    style={[MyStyles.button, { width: '49%' }]} textColor="white">Lưu</Button>
            </View>
        </View>
    )
}

export default SelectExercise;