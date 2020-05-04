import { createStackNavigator } from 'react-navigation';
import Main from '../screens/Main';
import LogIn from '../screens/LogIn';
import ForgotPassword from '../screens/ForgotPassword';
import Home from '../screens/Home';
import SearchView from '../screens/SearchView';
import SearchCompany from '../screens/SearchCompany';
import MenuDetail from '../screens/MenuDetail';
import Filter from '../screens/Filter';
import MapHome from '../screens/MapHome';
import Account from '../screens/Account';
import Prime from '../screens/Prime';
import MyOrders from '../screens/MyOrders';
import CompanyAddress from '../screens/CompanyAddress';


import { StatusBar, Platform } from 'react-native';

const AppRouteConfigs = createStackNavigator({
Main: { 
    screen: Main,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
LogIn: {
    screen: LogIn,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
Home: {
    screen: Home,
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
MapHome: {
    screen: MapHome,
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
    }
},
SearchView: {
    screen: SearchView,
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
SearchCompany: {
    screen: SearchCompany,
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
Filter: {
    screen: Filter,
    navigationOptions: {
        title: 'Filters',
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
MenuDetail: {
    screen: MenuDetail,
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
Account: {
    screen: Account,
    navigationOptions: {
        title: 'Account',
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
Prime: {
    screen: Prime,
    navigationOptions: {
        title: 'Prime',
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
CompanyAddress: {
    screen: CompanyAddress,
    navigationOptions: {
        title: 'CompanyAddress',
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
MyOrders: {
    screen: MyOrders,
    navigationOptions: {
        title: 'My Orders',
        headerStyle: {
            ...Platform.OS === 'android' ? { paddingTop: StatusBar.currentHeight, height: StatusBar.currentHeight + 56 } : {},
        },
    }
},
},
{initialRouteName:'Main'}
);




export default AppRouteConfigs;
  