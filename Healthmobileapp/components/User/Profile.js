import { Text, TouchableOpacity, View, Modal, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Avatar, Divider, Drawer, SegmentedButtons } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import Styles from "./Styles";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import GoogleFit from "./GoogleFit";
import HealthView from "./HealthView";
import InfoView from "./InfoView";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";

const values = ['google-fit', 'infomation', 'health'];
const screenWidth = Dimensions.get('window').width;
const currentYear = new Date().getFullYear();

const Profile = () => {
    const pagerRef = useRef(null);

    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const [expert, setExpert] = useState();
    const [value, setValue] = useState('google-fit');
    const [index, setIndex] = useState(0);
    const [settingVisible, setSettingVisible] = useState(false);

    const nav = useNavigation();


    const handleSegmentChange = (val) => {
        setValue(val);
        const index = values.indexOf(val);
        setIndex(index);
        pagerRef.current?.setPage(index);
    };

    const handlePageSelected = (e) => {
        const index = e.nativeEvent.position;
        setIndex(index);
        setValue(values[index]);
    };

    const logout = async () => {
        dispatch({
            "type": "logout",
        });
    };

    const loadExpert = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).get(endpoints['expertDetail'])
            setExpert(res.data)
        } catch (err) {
            console.log("load expert", err)
        } finally {
        }
    }

    useEffect(() => {
        loadExpert()
    }, [])

    useLayoutEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setSettingVisible(true)}>
                    <Ionicons name='settings-outline' size={24} />
                </TouchableOpacity>
            )
        });
    }, [nav]);


    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={90}
            style={{ flex: 1 }}
            behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[Styles.container, { backgroundColor: 'white' }]}>
                    <View style={{ alignItems: 'center' }}>
                        <Avatar.Image style={Styles.avatarView} size={150} source={{ uri: user?._j?.avatar }} />
                        <Text style={Styles.usernameText}>{user?._j?.username}</Text>
                        <Text style={Styles.ageText}>{currentYear - user?._j?.birth} tuổi</Text>

                        <SegmentedButtons
                            value={value}
                            onValueChange={handleSegmentChange}
                            density="medium"
                            mode="single"
                            style={Styles.segmentedContainer}
                            theme={{
                                colors: {
                                    secondaryContainer: '#36648B',
                                    onSecondaryContainer: 'white',
                                }
                            }}
                            buttons={[
                                { value: 'google-fit', label: 'Google-fit' },
                                { value: 'infomation', label: 'Thông tin' },
                                { value: 'health', label: 'Sức khỏe' }
                            ]}
                        />
                    </View>

                    <PagerView
                        ref={pagerRef}
                        style={Styles.container}
                        initialPage={index}
                        onPageSelected={handlePageSelected}
                        scrollEnabled={true}
                        orientation="horizontal"
                    >
                        <View style={Styles.container} key="google-fit">
                            <GoogleFit />
                        </View>
                        <View style={Styles.container} key="infomation">
                            <InfoView user={user?._j} />
                        </View>
                        <View style={Styles.container} key="health">
                            <HealthView />
                        </View>
                    </PagerView>

                    <Modal
                        visible={settingVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setSettingVisible(false)}
                    >
                        <TouchableOpacity style={Styles.overlay} activeOpacity={1} onPress={() => setSettingVisible(false)}>
                            <View style={[Styles.drawerContainer, { width: screenWidth / 1.5 }]}>
                                <Drawer.Section style={{ marginTop: 20 }} title="Cài đặt">
                                    <Divider />
                                    {
                                        (user?._j?.user_role === 3 || user?._j?.user_role === 4) && <Drawer.Item
                                            label="Thông tin chuyên gia"
                                            icon={() => (<Ionicons name="ribbon-outline" size={24} />)}
                                            onPress={() => {
                                                setSettingVisible(false)
                                                nav.navigate("expertProfile", { "item": expert })
                                            }} />
                                    }
                                    <Divider />
                                    <Drawer.Item
                                        label="Đăng xuất"
                                        icon={() => (<Ionicons name="log-out-outline" size={24} />)}
                                        onPress={logout} />
                                </Drawer.Section>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Profile;
