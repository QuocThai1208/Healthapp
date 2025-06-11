import { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator } from "react-native-paper";
import { MyUserContext } from "../../configs/Contexts";
import ExpertItem from "./ExpertItem";
import MyStyles from "../../styles/MyStyles";

const Experts = () => {
    const [experts, setExperts] = useState();
    const [loading, setLoading] = useState(false);

    const user = useContext(MyUserContext);

    const loadExperts = async () => {
        try {
            setLoading(true)
            let res = await Apis.get(endpoints['experts'])
            setExperts(res.data)
        } catch (err) {
            console.log("load expert", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadExperts();
    }, [])


    return (
        !loading ? <>
            <FlatList
                style={[MyStyles.container, MyStyles.bgContainer]}
                data={experts}
                renderItem={({ item }) => (
                    item?.user?.id !== user?._j?.id && <ExpertItem item={item} />
                )}
            />
        </> : <>
            <View style={[MyStyles.bgContainer, MyStyles.centerContent]}>
                <ActivityIndicator size='large' />
            </View>
        </>
    )
}

export default Experts;