import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { Icon, Provider } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Schedules from "./components/Practice/Schedules";
import Tags from "./components/Practice/Tags";
import { Ionicons } from '@expo/vector-icons';
import GroupSchedules from "./components/Practice/GroupSchedules";
import ScheduleDetail from "./components/Practice/ScheduleDetail";
import Profile from "./components/User/Profile";
import 'react-native-gesture-handler';
import { useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import SessionDetail from "./components/Practice/SessionDetail";
import ExerciseDetail from "./components/Practice/ExerciseDetail";
import MySchedules from "./components/Practice/MySchedules";
import SessionResult from "./components/Practice/SessionResult";
import MainPractice from "./components/Practice/MainPractice";
import MainMenuEat from "./components/MenuEat/MainMenuEat";
import DietList from "./components/MenuEat/DietList";
import MenuList from "./components/MenuEat/MenuList";
import MenuDetail from "./components/MenuEat/MenuDetail";
import HealthDiary from "./components/MenuEat/HealthDiary";
import Reminders from "./components/Reminder/Reminders";
import CreateReminder from "./components/Reminder/CreateReminder";
import MainStats from "./components/Stats/MainStats";
import MainChat from "./components/Chat/MainChat";
import ChatRoom from "./components/Chat/ChatRoom";
import UpdateInfo from "./components/User/UpdateInfo";
import RegisterRole from "./components/More/RegisterRole";
import More from "./components/More/More";
import Experts from "./components/More/Experts";
import ExpertProfile from "./components/More/ExpertProfile";
import CustomerList from "./components/More/CustomerList";
import CreatePersonalSchedule from "./components/Practice/CreatePersonalSchedule";
import EditSchedule from "./components/Practice/EditSchedule";
import EditSession from "./components/Practice/EditSession";
import SelectExercise from "./components/Practice/SelectExercise";
import IngredientList from "./components/MenuEat/IngredientList";
import InstructList from "./components/Practice/InstructList";
import Resultlist from "./components/Practice/ResultList";
import ResultItem from "./components/Practice/ResultItem";



const Stack = createNativeStackNavigator();

const PracticeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="mainPractice" component={MainPractice} options={{ title: "Kế hoạch tập" }} />
      <Stack.Screen name="schedules" component={Schedules} options={{ title: "Cấp độ khó" }} />
      <Stack.Screen name="createPersonalSchedule" component={CreatePersonalSchedule} options={{ title: "Tuỳ chỉnh kế hoạch tập" }} />
      <Stack.Screen name="mySchedules" component={MySchedules} options={{ title: "Kế hoạch tập của tôi" }} />
      <Stack.Screen name="scheduleDetail" component={ScheduleDetail} options={{ title: "Kế hoạch tập" }} />
      <Stack.Screen name="sessionDetail" component={SessionDetail} options={{ title: "Bài tập" }} />
      <Stack.Screen name="sessionResult" component={SessionResult} options={{ title: "Kết quả tập luyện" }} />
      <Stack.Screen name="editSchedule" component={EditSchedule} options={{ title: "Chỉnh sửa" }} />
      <Stack.Screen name="editSession" component={EditSession} options={{ title: "Chỉnh sửa" }} />
      <Stack.Screen name="selectExercise" component={SelectExercise} options={{ title: "Thêm bài tập" }} />
      <Stack.Screen name="exerciseDetail" component={ExerciseDetail} options={{ title: "Bài tập" }} />
      <Stack.Screen name="instructList" component={InstructList} options={{ title: "Hướng dẫn" }} />
      <Stack.Screen name="tags" component={Tags} options={{ title: "Nơi tập luyện" }} />
      <Stack.Screen name="resultList" component={Resultlist} options={{ title: "Kết quả tập luyện" }} />
      <Stack.Screen name="resultItem" component={ResultItem} options={{ title: "Kết quả tập luyện" }} />
      <Stack.Screen name="groupSchedules" component={GroupSchedules} options={({ navigation }) => (
        {
          title: "Kế họach tập",
          headerLeft: () => (
            <Ionicons name='close' size={24} onPress={() => navigation.goBack()} />
          )
        }
      )} />
    </Stack.Navigator>
  )
}

const MenuEatStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="mainMenuEat" component={MainMenuEat} options={{ title: "Chế độ ăn " }} />
      <Stack.Screen name="dietList" component={DietList} options={{ title: "Chế độ ăn " }} />
      <Stack.Screen name="menuList" component={MenuList} />
      <Stack.Screen name="menuDetail" component={MenuDetail} />
      <Stack.Screen name="ingredientList" component={IngredientList} options={{ title: "Danh sách nguyên liệu" }} />
      <Stack.Screen name="healthDiary" component={HealthDiary} options={{ title: "Nhật ký sức khỏe" }} />
    </Stack.Navigator>
  )
}

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="mainLogin" component={Login} options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="register" component={Register} options={{ title: "Đăng ký" }} />
      <Stack.Screen name="updateInfo" component={UpdateInfo} />
    </Stack.Navigator>
  )
}


const ChatStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="mainChat" component={MainChat} />
      <Stack.Screen name="chatRoom" component={ChatRoom} options={{ title: "", headerShown: true, }} />
    </Stack.Navigator>
  )
}

const MoreStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="main" component={More} options={{ title: "Thêm" }} />

      <Stack.Screen name="profile" component={Profile} options={{ title: "Profile" }} />
      <Stack.Screen name="updateInfo" component={UpdateInfo} options={{ title: "Cập nhật thông tin" }} />
      <Stack.Screen name="registerRole" component={RegisterRole} options={{ title: "Đăng ký vai trò" }} />

      <Stack.Screen name="reminder" component={Reminders} options={{ title: "Nhắc nhở" }} />
      <Stack.Screen name="createReminder" component={CreateReminder} options={{ title: "Tạo nhắc nhở" }} />

      <Stack.Screen name="experts" component={Experts} options={{ title: "Danh sách các chuyên gia" }} />
      <Stack.Screen name="expertProfile" component={ExpertProfile} options={{ title: "Thông tin chi tiết" }} />

      <Stack.Screen name="customerList" component={CustomerList} options={{ title: "Danh sách khách hàng" }} />
      <Stack.Screen name="mainState" component={MainStats} options={{ title: "Thống kê" }} />

    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>

      {(user === null || user?._j === null) ? <>
        <Tab.Screen name="login" component={LoginStackNavigator} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon size={20} source="account" /> }} />
      </> : <>
        <Tab.Screen name="pratice" component={PracticeStackNavigator} options={{ title: "Tập luyện", tabBarIcon: () => <Icon size={20} source="home" /> }} />
        <Tab.Screen name="menuEat" component={MenuEatStackNavigator} options={{ title: "Ăn uống", tabBarIcon: () => <Icon size={20} source="food" /> }} />
        <Tab.Screen name="chat" component={ChatStackNavigator} options={{ tabBarIcon: () => <Ionicons size={20} name="chatbubble-ellipses-outline" /> }} />
        <Tab.Screen name="stats" component={MainStats} initialParams={{ userId: user?._j?.id }} options={{ title: "Thống kê", tabBarIcon: () => <Ionicons size={20} name="stats-chart-outline" />, headerShown: true, }} />
        <Tab.Screen name="more" component={MoreStackNavigator} options={{ title: "Thêm", tabBarIcon: () => <Ionicons name="ellipsis-horizontal-outline" size={20} /> }} />
      </>}
    </Tab.Navigator>
  )
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <Provider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </Provider>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>

  )
}

export default App;