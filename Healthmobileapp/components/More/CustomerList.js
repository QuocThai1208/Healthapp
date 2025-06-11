import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { authApis, endpoints } from "../../configs/Apis";
import { Text } from "react-native-paper";
import CustomerItem from "./CustomerItem";
import MyStyles from "../../styles/MyStyles";

const CustomerList = () => {

    const [customers, setCustomers] = useState();

    const loadCustomer = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).get(endpoints['customers'])
            setCustomers(res.data)
        } catch (err) {
            console.log("loadCustomer", err)
        }
    }

    useEffect(() => {
        loadCustomer();
    }, [])

    return (
        <FlatList
            style={[MyStyles.container, MyStyles.bgContainer]}
            data={customers}
            renderItem={({ item }) => (
                <CustomerItem item={item} />
            )}
        />
    )
}

export default CustomerList;