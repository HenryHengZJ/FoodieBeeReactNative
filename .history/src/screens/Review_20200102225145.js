
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
import StarRating from 'react-native-star-rating';

class Review extends Component {
 
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            refreshing: false,
            empty: false,
            loading: true,
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
            duration: 2000,
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
      
        var url = apis.GETreview;
        
        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
            if (response.status === 200) {
                this.setState({
                    data: response.data,
                    empty: response.data.length > 0 ? false : true,
                    loading: false,
                    refreshing: false,
                });
            }
        })
        .catch(err => {
            alert(err)
            console.log("fetch error" + err);
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });

    }


    onReviewClicked = (navigation, {item}) => {
 
    }   

    _renderItem = ({item, index}) => (

        <Touchable 
            style={{ margin: 10, borderWidth: 1, borderColor: '#ECECEC', padding:15, elevation:1, borderRadius: 10, backgroundColor: 'white' }}
            delayPressIn = {5000}
            onPress={this.onReviewClicked.bind(this, this.props.navigation, {item})}
            background={Touchable.Ripple(colors.ripplegray)}>
        
            <View style={{ flexDirection: 'column' }}>

                <Text numberOfLines={1} style={{ color: '#454545', fontSize: 17, fontWeight: 'bold' }}>
                {item.catererDetails[0].catererName}</Text>

                <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: 13, fontWeight: '500', color: colors.greyBlack, opacity: 0.9 }}>
                {moment(item.createdAt).format("DD MMM, YYYY")}</Text>

                <Text numberOfLines={1} style={{ color: 'black', paddingTop: 5, fontSize: 15 }}>
                {item.customerComment}</Text>

                <View style={{marginTop: 10}}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    fullStarColor="orange"
                    starSize={20}
                    rating={item.customerRating}
                />
                </View>
            
            </View>
            
        </Touchable>
        
    )

    renderLoadingView() {
        return (
            <View style={{ flex: 1, margin: 10, }}>

            <ContentLoader
                aShape="square"
                aSize={130}
                avatar
                active 
                title={false}
                listSize={5}
                pRows={5}
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
            <View style={{flex: 1, backgroundColor: 'white' }}>
                
                <ScrollView style={styles.scrollView}>

                    <View style={{ marginTop:70, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                        <LottieView 
                            loop={true}
                            style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 150, width: 150 }}
                            source={Platform.OS == 'android' ? "pointsrewards.json" : require('../animation/pointsrewards.json')} progress={this.state.progress} />
                        
                        <Text style={styles.nosavedheading}>
                        No Reviews Yet
                        </Text>

                        <Text style={styles.description}>
                        You can rate and review restaurants after every meal
                        </Text>
                    </View>

                </ScrollView>

                
            </View>
        );
    }


    renderFlatListView() {
        return (
            <List containerStyle={{ backgroundColor:'transparent', marginTop:0, paddingTop:0, paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0, }}>
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
        <View style={{ flex: 1, paddingTop: 10, backgroundColor: this.state.empty ? 'white' : '#F5F5F5',}}>
            {this.state.loading ? this.renderLoadingView() : this.state.empty ? this.renderEmptyView() : this.renderFlatListView()}
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

Review.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);

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

Review.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
