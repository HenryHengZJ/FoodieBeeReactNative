
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
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
import img from "../img/s3"
import deviceStorage from '../helpers/deviceStorage';
import ActionCreators from '../redux/actions';
import Tag from '../components/Home/Tag'
import Category from '../components/Home/Category'

import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import moment from "moment";
import ContentLoader from '@sarmad1995/react-native-content-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Home extends Component {

    constructor(props) {
        super(props);

        this.onSearchCompanyClose = this.onSearchCompanyClose.bind(this);
        this.onFilterClose = this.onFilterClose.bind(this);
        
        this.state = {
            data: [],
            refreshing: false,
            empty: false,
            loading: true,
            progress: new Animated.Value(0),
            locationquerystring: "",
            cuisinequerystring: "",
            searchtxt: "",
            selectedCompany: null,
            isMenuExpired: false,
            currentDateString: "",
            descripString: "",
            filterlist: [],
            customerIsPrime: false,
            customerHasOrderedToday: false,
            customerEmail: "",
            customerPaymentAccountID: "",
            subscriptionID: ""
        };
    }

    componentWillMount() {
        
        this.scrollY = new Animated.Value(0)
    
        this.startHeaderHeight = 80
    
        this.endHeaderHeight = 50
    
        if (Platform.OS == 'android') {
            this.startHeaderHeight = 100 + StatusBar.currentHeight
            this.endHeaderHeight = 70 + StatusBar.currentHeight
        }
    
        this.animatedHeaderHeight = this.scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [this.startHeaderHeight, this.endHeaderHeight],
            extrapolate: 'clamp'
        })
    
        this.animatedOpacity = this.animatedHeaderHeight.interpolate({
            inputRange: [this.endHeaderHeight, this.startHeaderHeight],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        this.animatedTagTop = this.animatedHeaderHeight.interpolate({
            inputRange: [this.endHeaderHeight, this.startHeaderHeight],
            outputRange: [-30, 10],
            extrapolate: 'clamp'
        })
        this.animatedMarginTop = this.animatedHeaderHeight.interpolate({
            inputRange: [this.endHeaderHeight, this.startHeaderHeight],
            outputRange: [50, 30],
            extrapolate: 'clamp'
        })
    }

    componentDidMount() {
        var currentDate = moment().toDate();

        var currentDateString = moment(currentDate).format("ddd, DD MMM YYYY")

        this.setState({
            currentDateString,
            descripString: "Tomorrow lunch menus will be available at 5pm today until 11am tomorrow."
        }, () => {
            this.checkIfMenuExpired()
            this.checkIfUserHasMadeOrderToday()
        })

        this.fetchUserCompany();
        this.startAnimation();
    }

    checkIfMenuExpired = () => {

        var activeDayIndex = new Date().getDay();
        
        var timenow = parseInt(moment(new Date()).format("HHmm"));
       
        if (activeDayIndex === 0 || activeDayIndex === 6 || activeDayIndex === 7 ) {
            var currentDateString = null

            var numofDaysToAdd = (activeDayIndex === 0 || activeDayIndex === 7) ? 1 : activeDayIndex === 6 ? 2 : 0
           
            currentDateString = moment().add(numofDaysToAdd, 'days').format("ddd, DD MMM YYYY")

            this.setState({
                isMenuExpired: false,
                currentDateString
            })
        }
        else if (activeDayIndex === 5) {
            if (timenow > 1100 && timenow < 1700) {
                this.setState({
                  isMenuExpired: true
                })
            }
              else {
                var currentDateString = null
          
                if (timenow >= 1700) {
                  currentDateString = moment().add(3, 'days').format("ddd, DD MMM YYYY")
                }
                else {
                  currentDateString = moment().format("ddd, DD MMM YYYY")
                }
          
                this.setState({
                  isMenuExpired: false,
                  currentDateString
                })
            }
        }
        else {
            if (timenow > 1100 && timenow < 1700) {
                this.setState({
                  isMenuExpired: true
                })
            }
              else {
                var currentDateString = null
          
                if (timenow >= 1700) {
                  currentDateString = moment().add(1, 'days').format("ddd, DD MMM YYYY")
                }
                else {
                  currentDateString = moment().format("ddd, DD MMM YYYY")
                }
          
                this.setState({
                  isMenuExpired: false,
                  currentDateString
                })
            }
        }    
    }

    
    checkIfUserHasMadeOrderToday = () => {

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }
      
        var datequery = null

        var timenow = parseInt(moment(new Date()).format("HHmm"));
        if (timenow > 1700) {
        //Add 1 day
            datequery = moment().add(1, 'days').format("ddd, DD MMM YYYY");
        }
        else {
            datequery = moment().format("ddd, DD MMM YYYY");
        }

        var url = apis.GETlunchorder + "?lteDate=" + datequery + "&gteDate=" + datequery;

        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
            if (response.status === 200) {
                if (response.data.length > 0) {
                    for (let i = 0; i < response.data.length; i++) {
                    var orderStatus = response.data[i].orderStatus
                        if (orderStatus === "pending" || orderStatus === "accepted" || orderStatus === "pickedup") {
                            this.setState({
                                customerHasOrderedToday: true
                            })
                            return;
                        }
                    }
                }
            } 
        })
        .catch((error) => {
        });
    }

    fetchUserCompany = () => {
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }
      
        var url = apis.GETcustomerprofile
      
        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.setJWTAsync(response.headers['x-auth']).done();
            }
            if (response.status === 200) {
                this.setState({
                    locationquerystring: typeof response.data[0].customerCompanyID !== 'undefined' ? response.data[0].customerCompanyID : "",
                    customerIsPrime: typeof response.data[0].customerIsPrime !== 'undefined' ? response.data[0].customerIsPrime : false,
                    customerEmail: typeof response.data[0].customerEmail !== 'undefined' ? response.data[0].customerEmail : "",
                    customerPaymentAccountID: typeof response.data[0].customerPaymentAccountID !== 'undefined' ? response.data[0].customerPaymentAccountID : "",
                    subscriptionID: typeof response.data[0].subscriptionID !== 'undefined' ? response.data[0].subscriptionID : "",
                }, () => {
                    this.fetchCompanyName();
                    this.fetchData();
                })
            }
        })
        .catch(err => {
            this.setState({
                locationquerystring: "5d8ca11c88211f271c35ba32",
            }, () => {
                this.fetchData();
            })
        });
    }

    setJWTAsync = async (jwt) => {
        try {
            this.props.setJWT(jwt)
        } catch (error) {
        }
    };

    fetchCompanyName = () => {

        var url = apis.GETcompany + "?companyID=" + this.state.locationquerystring 
    
        axios.get(url)
        .then((response) => {
          var data = response.data;
          if (data.length> 0) {
            this.setState({
                selectedCompany: data[0].companyName + " | " +  data[0].companyFullAddress
            })
          }
        })
        .catch(err => {
         
        });
    
      };

    fetchData = () => {

        const {locationquerystring, cuisinequerystring} = this.state;

        var url = apis.GETlunchmenu+'?companyID=' + locationquerystring + cuisinequerystring;

        axios.get(url)
        .then((response) => {
        var data = response.data;
            this.setState({
                data: data,
                empty: data.length > 0 ? false : true,
                loading: false,
                refreshing: false,
            });
        })
        .catch(err => {
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });

    }

    onSearchPressed = (navigation) => {
        navigation.navigate('SearchView', { 
            locationquerystring: this.state.locationquerystring,
        });
    }

    onSearchCompanyPressed = (navigation) => {
        navigation.navigate('SearchCompany', { 
            onSearchCompanyClose: this.onSearchCompanyClose 
        });
    }

    onSearchCompanyClose( companyID, companySearchText ) {
        this.setState({
            data: [],
            empty: false,
            loading: false,
            refreshing: true,
            locationquerystring: companyID,
            selectedCompany: companySearchText,
        }, () => {
            this.fetchData();
        });  
    }

    onFilterPressed = (navigation) => {
        navigation.navigate('Filter', { 
            selectedCuisines: JSON.stringify(this.state.filterlist),
            onFilterClose: this.onFilterClose 
        });
    }

    onFilterClicked = (filtername) => {
        var filteritem = [{
            label: filtername,
            value: filtername
        }]
        this.onFilterClose(JSON.stringify(filteritem))
    }

    onFilterClose( filteritems ) {
        var filterlist = JSON.parse(filteritems)

        var filterquery = ""
        for (let i = 0; i < filterlist.length; i ++) {
            filterquery = filterquery + "&cuisine=" + filterlist[i].value
        }
        this.setState({
            cuisinequerystring: filterquery,
            filterlist: filterlist,
            data: [],
            empty: false,
            loading: false,
            refreshing: true,
        }, () => {
            this.fetchData()
        })
    }

    removeFilter = (index) => {
        
        var newfilterlist = this.state.filterlist.slice().filter(m => m['value'] !== this.state.filterlist[index].value)
   
        var filterquery = ""
        for (let i = 0; i < newfilterlist.length; i ++) {
            filterquery = filterquery + "&cuisine=" + newfilterlist[i].value
        }

        this.setState({
            cuisinequerystring: filterquery,
            filterlist: newfilterlist,
            data: [],
            empty: false,
            loading: false,
            refreshing: true,
        }, () => {
            this.fetchData()
        })
    }

    onMapHomePressed = (navigation) => {
        navigation.navigate('MapHome', { 
            locationquerystring: this.state.locationquerystring,
        });
    }

    onAccountPressed = (navigation) => {
        if (typeof this.props.getUserid.userid === 'undefined' || this.props.getUserid.userid === "") {
            navigation.navigate('LogIn');
        }
        else {
            navigation.navigate('Account');
        }
    }

    onMealClicked = (navigation, {item}) => {
        navigation.navigate({
            routeName: 'MenuDetail',
            params: {
                selectedLunchMenu: JSON.stringify(item),
                customerIsPrime: this.state.customerIsPrime,
                customerHasOrderedToday: this.state.customerIsPrime,
                customerEmail: this.state.customerEmail,
                customerPaymentAccountID: this.state.customerPaymentAccountID,
                subscriptionID: this.state.subscriptionID,
            },
        });    
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

    _renderItem = ({item, index}) => (

        <Touchable 
            delayPressIn = {5000}
            onPress={this.onMealClicked.bind(this, this.props.navigation, {item})}
            background={Touchable.Ripple(colors.ripplegray)}>
        
            <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, marginRight: 20,  }}>
            
                <Image
                    style={{ width: '100%', height: 180, borderRadius: 5, opacity: this.state.isMenuExpired ? 0.4 : 1 }}
                    source={{uri: item.src}} />
            
                <View style={{ flex: 1, alignItems: 'flex-start', marginTop: 10 }}>

                    <View style={{ flex: 1, flexDirection: 'row'}}>

                        <View style={{ flex: 1, flexDirection: 'column'}}>

                            <Text numberOfLines={1} style={{ color: '#454545', fontSize: 17, fontWeight: 'bold' }}>
                            {item.title}</Text>

                            <Text numberOfLines={1} style={{ color: 'black', paddingTop: 5, fontSize: 15 }}>
                            {item.catererDetails[0].catererName}</Text>

                            <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: 13, color: colors.greyBlack, opacity: 0.9 }}>
                            {item.catererDetails[0].catererAddress}</Text>

                            <View style={{ flexDirection: 'row'}}>

                                <Text numberOfLines={1} style={{ color: 'black', marginTop: 7,  fontWeight: '500', fontSize: 16 }}>
                                €{Number(item.priceperunit).toFixed(2)}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 20
                                }}>

                                    <View style={{
                                        padding: 5,
                                        backgroundColor: '#FF5722',
                                        borderRadius: 5,
                                        marginTop: 5,
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 12 }}>PRIME</Text>

                                    </View>

                                    <Text style={{ marginLeft: 5, color: '#FF5722', marginTop: 7, fontWeight: '500', fontSize: 16 }}>€{Number(item.discountedprice).toFixed(2)}</Text>

                                </View>

                            </View>

                        </View>

                    </View>

                </View>

            </View>
            
        </Touchable>
    )

    renderHeader = () => {

        return (

        <View style={{ backgroundColor: 'white', paddingTop: this.state.isMenuExpired ? 0 : 20, paddingBottom: 10 }}>
  
            {this.state.isMenuExpired ? null :

            this.state.filterlist.length !== 0 ? null :
  
            <View style={{ height: 135, marginTop: 10  }}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <Category imageUri={{uri: img.salad}}
                        name="Salad"
                        rightmargin = "0"
                        handleOnPress={this.onFilterClicked.bind(this, "Salad")}
                    />
                    <Category imageUri={{uri:  img.asian}}
                        name="Asian"
                        rightmargin = "0"
                        handleOnPress={this.onFilterClicked.bind(this, "Asian")}
                    />
                    <Category imageUri={{uri:  img.mexican}}
                        name="Mexican"
                        rightmargin = "0"
                        handleOnPress={this.onFilterClicked.bind(this, "Mexican")}
                    />
                    <Category imageUri={{uri:  img.pizza}}
                        name="Pizza"
                        rightmargin = "20"
                        handleOnPress={this.onFilterClicked.bind(this, "Pizza")}

                    />
                </ScrollView>
            </View> }
            
            <Text style={{ paddingTop: this.state.filterlist.length !== 0 ? 0 : 20 , color: colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                {this.state.currentDateString}
            </Text>

            <Text style={{ paddingTop: 10 , paddingBottom: 10, color: colors.greyBlack, fontSize: 15, fontWeight: '500', paddingHorizontal: 20, opacity: 0.7                                                                                                                                                                                                                                                                                                                                                                              }}>
                {this.state.descripString}
            </Text>

        </View>
        );
    };  

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
                     
                    <Text style={{ paddingTop: 20 , color: colors.greyBlack, fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                        {this.state.currentDateString}
                    </Text>

                    <Text style={{ paddingTop: 10 , paddingBottom: 10, color: colors.greyBlack, fontSize: 15, fontWeight: '500', paddingHorizontal: 20, opacity: 0.7                                                                                                                                                                                                                                                                                                                                                                              }}>
                        {this.state.descripString}
                    </Text>

                    <View style={{ marginTop:70, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                        <LottieView 
                            loop={true}
                            style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                            source={Platform.OS == 'android' ? "empty_box.json" : require('../animation/empty_box.json')} progress={this.state.progress} />
                        
                        <Text style={styles.nosavedheading}>
                        Its Empty!
                        </Text>

                        <Text style={styles.description}>
                        Sorry, we are unable to find any meals and restaurants at the moment.
                        </Text>
                    </View>

                </ScrollView>

                
            </View>
        );
    }

    renderFlatListView() {
        return (
            <List  containerStyle={{ marginTop:0, paddingTop:0, paddingHorizontal: 5, borderBottomWidth: 0, borderTopWidth: 0, marginBottom: this.state.filterlist.length > 0 ? 80 : 50 }}>
            <FlatList
                data={this.state.data}
                keyExtractor={(item) => item._id}
                renderItem={this._renderItem}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter} 
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                showsVerticalScrollIndicator={false}
                />
            </List>
        );
    }

    renderLoadingView() {
        return (
            <View style={{ flex: 1, margin: 10, }}>
              
                <ContentLoader
                    active 
                    title={false}
                    listSize={5}
                    pHeight={[180, 20, 10, 10]}
                    pWidth={["100%", "50%", "100%", "80%",]}
                />
               
            </View>
        );
    }

    render() {
        return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
                <View style={{ backgroundColor: 'white', paddingTop: 20, flex: 1 }}>
                    <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#dddddd' }}>
                        <View style={{ flexDirection: 'row'}} >
                            <View style={{
                                padding: 10,
                                backgroundColor: 'white',
                                borderTopWidth: 0,
                                borderBottomWidth: 1,
                                borderLeftWidth: 0.5,
                                borderRightWidth: 0.5,
                                borderRadius: 5,
                                borderColor: '#dddddd', 
                                marginLeft: 20,
                                marginRight: 10,
                                shadowOffset: { width: 1, height: 1 },
                                shadowColor: '#000',
                                shadowOpacity: 0.3,
                                elevation: 1,
                                flex: 0.9,
                                marginTop: Platform.OS == 'android' ? 20 : null
                            }}>
                                <View style={{ flexDirection: 'row' }}>

                                    <TouchableOpacity
                                        disabled={true}
                                        style={{ alignSelf:'center',  justifyContent: 'center', alignItems: 'center', marginRight: 10,}}>
                                    
                                        <Image style={{ opacity: .5, height: 20, width: 20 }} source={require('../img/search.png')}/> 
                                        
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{ flex: 1, padding:5,}}
                                        onPress={this.onSearchPressed.bind(this, this.props.navigation)}>

                                        <Text style={{  fontWeight: '400', color:  'grey', backgroundColor: 'white', opacity: 0.7 }}>
                                            Search Meals
                                        </Text>

                                    </TouchableOpacity>

                                </View>

                            </View>

                            <TouchableOpacity onPress={this.onAccountPressed.bind(this, this.props.navigation)} style={{flex: 0.1, marginRight: 10, padding: 7,}} >
                                <Image style={{ opacity: 0.7, alignSelf:'center', marginTop: 23, justifyContent: 'center', height: 25, width: 25, }} source={{uri: img.profileimg}}/>
                            </TouchableOpacity>

                        </View>
                    

                        <View
                            style={{ flexDirection: 'row', marginHorizontal: 20, position: 'relative', marginTop: 10, marginBottom: 10 }}
                        >
                            <Image style={{ alignSelf:'center', marginRight: 10, justifyContent: 'center', height: 20, width: 20 }} source={require('../img/location2.png')}/>
                            
                            <TouchableOpacity onPress={this.onSearchCompanyPressed.bind(this, this.props.navigation)} style={{flex: 1}}>
                                <View style={{
                                    padding: 10,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    borderColor: '#dddddd', 
                                }}>
                                    {this.state.selectedCompany ? 
                                    <Text numberOfLines={1} style={{ marginLeft: 10, marginRight: 10, fontWeight: '500', color:  'black', backgroundColor: 'white', opacity: 0.7 }}>
                                        {this.state.selectedCompany}
                                    </Text>
                                    :
                                    <Text style={{ marginLeft: 10, marginRight: 10, fontWeight: '400', color:  'grey', backgroundColor: 'white', opacity: 0.7 }}>
                                        Seach Company
                                    </Text>
                                    }
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.onFilterPressed.bind(this, this.props.navigation)} >
                                <Image style={{ alignSelf:'center',  marginTop:5, marginRight: 5, marginLeft: 10, justifyContent: 'center', height: 25, width: 25 }} source={require('../img/filter.png')}/>
                            </TouchableOpacity>

                        </View>

                        <ScrollView
                            style={{ marginBottom: 10}}
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            
                            {this.state.filterlist.map((filter, index) => (
                                <Tag isLeft={index === 0 ? true : false} isRight={index === this.state.filterlist.length - 1 ? true : false} name={filter.value} handleButtonPress={this.removeFilter.bind(this, index)}></Tag>
                            ))}
                            
                        </ScrollView>


                    </View>
                    
                    {this.state.loading ? this.renderLoadingView() : this.state.empty ? this.renderEmptyView() : this.renderFlatListView()}

                </View>

                <TouchableOpacity
                    onPress={this.onMapHomePressed.bind(this, this.props.navigation)}
                    style={{
                        borderLeftWidth: 0.5, 
                        borderRightWidth: 0.5, 
                        borderTopWidth: 0,
                        borderBottomWidth: 1,
                        borderColor: '#dddddd', 
                        borderRadius:60/2,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 1,
                            height: 2,
                        },
                        shadowOpacity: 0.5,
                        elevation:4,
                        alignItems:'center',
                        justifyContent:'center',
                        width:60,
                        position: 'absolute',                                          
                        bottom: 25,                                                    
                        right: 20,
                        height:60,
                        backgroundColor:'#fff',
                    }}
                >
                    <Icon name="map-marker" color={colors.priceblue} size={30} />
                </TouchableOpacity>

            </View>
        )

    }
}

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
    textAlign: 'center',
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

const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Home.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
  