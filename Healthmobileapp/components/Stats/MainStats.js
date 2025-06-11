import { useRef, useState } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { SegmentedButtons } from "react-native-paper";
import StatsPractice from "./StatsPratice";
import StatsHealth from "./StatsHealth";
import MyStyles from "../../styles/MyStyles";

const MainStats = ({ route }) => {
    const userId = route.params?.userId
    const values = ['practice', 'health'];
    const [value, setValue] = useState('practice');
    const [index, setIndex] = useState(0);
    const pagerRef = useRef(null);

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


    return (
        <View style={[MyStyles.container, MyStyles.bgContainer]}>
            <SegmentedButtons
                value={value}
                onValueChange={handleSegmentChange}
                density="medium"
                mode="single"
                theme={{
                    colors: {
                        secondaryContainer: '#36648B',
                        onSecondaryContainer: 'white',
                    }
                }}
                buttons={[
                    { value: 'practice', label: 'Tập luyện' },
                    { value: 'health', label: 'Sức khỏe' },
                ]}
            />
            <PagerView
                style={MyStyles.container}
                ref={pagerRef}
                initialPage={index}
                onPageSelected={handlePageSelected}
                scrollEnabled={true}
                orientation="horizontal"
            >
                <View style={MyStyles.container} key="practice">
                    <StatsPractice userId={userId} />
                </View>
                <View key="health">
                    <StatsHealth userId={userId} />
                </View>
            </PagerView>
        </View>
    )
}

export default MainStats;