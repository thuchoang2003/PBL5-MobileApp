import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Homepage from './Homepage';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="home">
      <Tab.Screen
        name="home"
        component={Homepage}
        options={{
          title: 'Home',
          tabBarIcon: ({size, color}) => (
            <Ionicons name="caret-forward-circle" size={20} color="#4838D1" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
