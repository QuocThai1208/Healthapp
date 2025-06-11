import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Button, Card, Dialog, Portal, TextInput } from 'react-native-paper';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';
import MyStyles from '../../styles/MyStyles';
import Styles from './Styles';

const HealthDiary = () => {
    const info = [{
        filed: 'calo_burned',
        label: 'Calo đốt'
    }, {
        filed: 'weight',
        label: 'Cân nặng'
    }, {
        filed: 'calo_intake',
        label: 'Calo nạp vào'
    }]

    const today = new Date();


    const [dataInput, setDataInput] = useState();
    const [visible, setVisible] = useState(false);
    const [tempDate, setTempDate] = useState(null);
    const [dataWeight, setDataWeight] = useState();
    const [healthDiary, setHealthDiary] = useState();
    const [selectedDate, setSelectedDate] = useState(today);
    const [visibleInput, setVisibleInput] = useState(false);
    const [visibleWeight, setVisibleWeight] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const showInput = () => setVisibleInput(true);
    const hideInput = () => setVisibleInput(false);

    const showWeight = () => setVisibleWeight(true);
    const hideWeight = () => setVisibleWeight(false);

    const increaseDay = () => {
        const next = new Date(selectedDate)
        next.setDate(next.getDate() + 1)

        if (next < today) {
            setSelectedDate(next)
        }
    }

    const decreaseDay = () => {
        const prev = new Date(selectedDate)
        prev.setDate(prev.getDate() - 1)
        setSelectedDate(prev)
    }

    const onDayPress = (day) => {
        if (day.dateString <= today.toISOString().split('T')[0]) {
            setTempDate(day.dateString);
        } else {
            console.log('Không thể chọn ngày tương lai');
        }
    };

    const handleSave = () => {
        if (tempDate) {
            setSelectedDate(new Date(tempDate));
        }
    };

    const loadHealthDieary = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let url = `${endpoints['healthDiary']}?day=${format(selectedDate, 'yyyy-MM-dd')}`
            let res = await authApis(token).get(url)
            setHealthDiary(res.data)
            setDataInput(res.data[0].notes)
        } catch (err) {
            console.log("healthdiary", err)
        }
    }

    const postWeight = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).post(endpoints['healthDiary'], {
                weight: dataWeight
            })
            await loadHealthDieary();
            hideWeight();
        } catch (err) {
            console.log("post weight", err)
        }
    }

    const postNotes = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            let res = await authApis(token).post(endpoints['healthDiary'], {
                notes: dataInput
            })
            await loadHealthDieary();
            hideInput();
        } catch (err) {
            console.log("post weight", err)
        }
    }

    useEffect(() => {
        loadHealthDieary();
    }, [selectedDate]);

    return (
        <KeyboardAvoidingView style={[MyStyles.bgContainer, MyStyles.container]} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <View style={{ padding: 5 }}>
                        <View style={Styles.headerRow}>
                            <TouchableOpacity onPress={decreaseDay}>
                                <Ionicons name="chevron-back-outline" size={25} style={{ marginRight: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showDialog} style={Styles.headerRow}>
                                <Ionicons name="calendar" size={25} style={{ marginHorizontal: 10 }} />
                                <Text>{format(selectedDate, 'yyyy-MM-dd')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={increaseDay}>
                                <Ionicons name="chevron-forward-outline" size={25} style={{ marginLeft: 10, opacity: selectedDate === today ? 0.3 : 1 }} />
                            </TouchableOpacity>
                        </View>

                        <Portal>
                            <Dialog style={MyStyles.bgContainer} visible={visible} onDismiss={hideDialog}>
                                <Calendar
                                    onDayPress={onDayPress}
                                    markedDates={{
                                        [today.toISOString().split('T')[0]]: {
                                            marked: true,
                                            dotColor: 'red',
                                        },
                                        [tempDate]: {
                                            marked: true,
                                            dotColor: 'green',
                                        },
                                    }}
                                    monthFormat={'yyyy MM'}
                                    markingType={'interactive'}
                                    maxDate={today.toISOString().split('T')[0]}
                                />
                                <Dialog.Actions>
                                    <Button onPress={() => { handleSave(); hideDialog(); }}>Chọn</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>

                        <View style={Styles.infoContainer}>
                            <View style={Styles.infoRow}>
                                {info.map((item) => (
                                    <View key={item.filed} style={[Styles.infoBox, { borderWidth: item.filed === 'weight' ? 2 : 0, borderRadius: 50, borderColor: 'white' }]}>
                                        <Text style={Styles.infoText}>{healthDiary?.[0]?.[item.filed] || 0}</Text>
                                        <Text style={Styles.infoText}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity onPress={showWeight} style={Styles.pencilButton}>
                                <Ionicons name="pencil-outline" size={25} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Portal>
                            <Dialog style={Styles.dialogWeight} visible={visibleWeight} onDismiss={hideWeight}>
                                <Dialog.Title>
                                    <Text>Nhập cân nặng của bạn</Text>
                                </Dialog.Title>
                                <TextInput
                                    keyboardType='number-pad'
                                    onChangeText={(t) => setDataWeight(t)}
                                    style={{ backgroundColor: 'white' }}
                                    mode='outlined'
                                />
                                <Dialog.Actions>
                                    <Button onPress={() => postWeight()}>Lưu</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>

                        <View>
                            <Text style={Styles.notesTitle}>Cảm nhận trong hôm nay</Text>
                            <Card style={Styles.notesCard}>
                                <Card.Content>
                                    <Text>{healthDiary?.[0]?.notes || ''}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Button onPress={showInput}  >Cập nhật cảm nhận</Button>
                                </Card.Actions>
                            </Card>

                            <Portal>
                                <Dialog style={{ backgroundColor: 'white', paddingHorizontal: 10 }} visible={visibleInput} onDismiss={hideInput}>
                                    <Dialog.Title>
                                        <Text>Cập nhật cảm nhận của bạn</Text>
                                    </Dialog.Title>
                                    <TextInput
                                        value={dataInput}
                                        onChangeText={(t) => setDataInput(t)}
                                        style={{ backgroundColor: 'white' }}
                                        multiline={true}
                                        numberOfLines={10}
                                    />
                                    <Dialog.Actions>
                                        <Button onPress={() => postNotes()}>Lưu</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};

export default HealthDiary;
