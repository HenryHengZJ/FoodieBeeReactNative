
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  FlatList, 
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  DeviceEventEmitter,
  BackHandler,
  AsyncStorage,
} from "react-native";

import { List,SearchBar, Card, ListItem, Button } from 'react-native-elements';
import colors from '../styles/colors';
import apis from '../apis';
import deviceStorage from '../helpers/deviceStorage';

import Touchable from 'react-native-platform-touchable';
import moment from "moment";
import LottieView from 'lottie-react-native';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import ContentLoader from '@sarmad1995/react-native-content-loader';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = (height / 6) + 10;
const CARD_WIDTH = CARD_HEIGHT 

class CurrentOrders extends Component {
 
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            refreshing: false,
            empty: false,
            loading: false,
            progress: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.fetchData();
        this.startAnimation();
    }

    startAnimation() {
    
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
        }).start(() => {
            this.setState({
                progress: new Animated.Value(0),
            })    
            this.startAnimation();
        });
    }

    fetchData = () => {

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }
      
        var url = apis.GETlunchorder;
        
        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            var data = response.data;
            this.filterCurrentOrder(data)
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
        })
        .catch(err => {
            console.log("fetch error" + err);
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });

    }

    filterCurrentOrder = (data) => {
        var filtered_data = [];
        
        filtered_data = data
        .slice()
        .filter(
            datachild =>
            datachild.orderStatus === "accepted" ||
            datachild.orderStatus === "pending"
        );
        
        this.setState({
            data: filtered_data,
            empty: filtered_data.length > 0 ? false : true,
            loading: false,
            refreshing: false,
        });
    };


    onMealClicked = (navigation, {item}) => {
        
        this.props.screenProps.parentNavigation.navigate({
            routeName: 'OrderDetail',
            params: {
                selectedLunchOrder: JSON.stringify(item),
            },
        });    
    }   

    _renderItem = ({item, index}) => (

        <Touchable 
            delayPressIn = {5000}
            onPress={this.onMealClicked.bind(this, this.props.navigation, {item})}
            background={Touchable.Ripple(colors.ripplegray)}>
        
            <View style={{  marginLeft: 10, marginTop: 10, marginBottom: 20, marginRight: 10, flexDirection: 'row' }}>
            
                <Image
                    style={{ width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 5 }}
                    resizeMode={'cover'}
                    source={{uri: item.orderItem[0].src}} />
            
                <View style={{ marginLeft: 10, flexDirection: 'column', flex:1, marginRight: 10,}}>

                    <Text numberOfLines={1} style={{ color: '#454545', fontSize: 17, fontWeight: 'bold' }}>
                    {item.orderItem[0].title}</Text>

                    <Text numberOfLines={1} style={{ color: 'black', paddingTop: 5, fontSize: 15 }}>
                    {item.catererDetails[0].catererName}</Text>

                    <View 
                    style={{
                        padding: 7,
                        backgroundColor:item.orderStatus === "pickedup" ? colors.themeblue :
                                        item.orderStatus === "cancelled" ? "#BEBEBE" :
                                        item.orderStatus === "accepted" ? "green" :
                                        item.orderStatus === "rejected" ? "red" :
                                        item.orderStatus === "pending" ? "orange" : "white",
                        borderRadius: 5,
                        marginTop: 5,
                        alignSelf: 'flex-start'
                    }}>
                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 12 }}>{
                        item.orderStatus === "pickedup" ? "Picked Up" :
                        item.orderStatus === "cancelled" ? "Cancelled" :
                        item.orderStatus === "accepted" ? "Accepeted" :
                        item.orderStatus === "rejected" ? "Rejected" :
                        item.orderStatus === "pending" ? "Pending" : ""
                    }</Text>
                    </View>

                    <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: 13, fontWeight: '500', color: colors.facebookblue, opacity: 0.9 }}>
                    {moment(item.pickupTime).format("hh:mm A, ddd, DD MMM YYYY")}</Text>

                    <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: 13, fontWeight: '500', color: colors.greyBlack, opacity: 0.9 }}>
                    €{Number(item.totalOrderPrice).toFixed(2)} charged</Text>

                </View>

            </View>
            
        </Touchable>
        
    )

    renderLoadingView() {
        return (
            <View style={{ flex: 1, margin: 10, }}>

            <ContentLoader
                aShape="square"
                aSize='40%'
                avatar
                active 
                title={false}
                listSize={5}
                pHeight={[20, 15, 20, 10, 10]}
                pWidth={["70%", "50%", "20%", "100%", "80%",]}
            />
            </View>
        );
    }

    handleRefresh = () => {

        this.setState({
            data: [],
            empty: false,
            loading: false,
            refreshing: true,
        }, () => {
            this.fetchData();
        });
        
    }

    renderFooter = () => {
        return (
        <View
            style={{
            paddingVertical: 50,
            borderTopWidth: 0,
            borderColor: "#CED0CE"
            }}
        >
        </View>
        );
    };

    renderEmptyView() {
        return (
            <View>
                
                <ScrollView style={styles.scrollView}>

                    <View style={{ marginTop:70, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                        <LottieView 
                            loop={true}
                            style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                            source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
                        
                        <Text style={styles.nosavedheading}>
                        No Current Orders
                        </Text>

                        <Text style={styles.description}>
                        Browse meals offered by local restaurants near you
                        </Text>
                    </View>

                </ScrollView>

                
            </View>
        );
    }


    renderFlatListView() {
        return (
            <List  containerStyle={{ marginTop:0, paddingTop:0, paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0, }}>
            <FlatList
                data={this.state.data}
                keyExtractor={(item) => item._id}
                renderItem={this._renderItem}
                ListFooterComponent={this.renderFooter} 
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                showsVerticalScrollIndicator={false}
                />
            </List>
        );
    }

    render() {
        return (
        <View style={{ flex: 1, paddingTop: 20 }}>
            {!this.state.empty && this.renderLoadingView()}
            {this.state.empty && this.renderEmptyView()}
        </View>
        )
    }
}

const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

CurrentOrders.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentOrders);

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    padding: 50,
  },
  scrollView: {
    height: '100%',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray04,
    paddingLeft: 30,
    marginTop:10,
    textAlign: 'center',
    paddingRight: 30,
  },
  nosavedheading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.greyBlack,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 20,
  },
  findJobsButton: {
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 16,
    borderRadius: 3,
    backgroundColor: colors.themeblue,
  },
  findJobsButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray05,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

CurrentOrders.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
