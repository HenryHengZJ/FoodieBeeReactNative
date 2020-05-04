import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';

import colors from '../styles/colors';
import CurrentOrders from './CurrentOrders';
import PastOrders from './PastOrders';

import { createMaterialTopTabNavigator } from "react-navigation";
import { connect } from 'react-redux';

class MyOrders extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {navigation, screenProps} = this.props;
        return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff",} }>
            <AppTab onNavigationStateChange={null} screenProps={{parentNavigation: navigation, ...screenProps}}/>
        </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
  getUserid: state.getUserid,
  getJWTToken: state.getJWTToken,
});

export default connect(mapStateToProps)(MyOrders);

const AppTab = createMaterialTopTabNavigator({
    Home: {
        screen:CurrentOrders,
		navigationOptions: {
            tabBarLabel: "Current Orders",
		}
	},
	Applied: {
        screen:PastOrders,
		navigationOptions: {
            tabBarLabel: "Past Orders",
		}
	}
}, 
{

	tabBarOptions: {
        labelStyle: {
            fontWeight: '600',
        },
        activeTintColor: colors.themeblue,
        indicatorStyle:{
            backgroundColor: colors.themeblue
        },
        inactiveTintColor: 'grey',
		    style:{
			    backgroundColor: "#fff"
		    }
        },
        tabBarPosition: 'top',
})


