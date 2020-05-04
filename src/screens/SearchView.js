import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { 
  KeyboardAvoidingView ,
  TextInput, 
  Button, 
  Slider,
  ScrollView, 
  Image,
  Text, 
  View, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  TouchableHighlight,
  StyleSheet,
  Platform,
  Keyboard,
  FlatList,
  ActivityIndicator,
  } 
from 'react-native';

import colors from '../styles/colors';
import apis from '../apis'; 
import ActionCreators from '../redux/actions';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';

const closeIcon = require('../img/close-button_black.png');
const searchIcon = require('../img/search.png');

class SearchView extends Component {

  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchtext: "",
      locationquerystring: "",
      customerIsPrime: null,
      customerEmail: "",
      customerPaymentAccountID: "",
      customerHasOrderedToday: null,
      subscriptionID: "",
    };

    this.lastTimeout = setTimeout; 
    this.editingEnd = this.editingEnd.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  componentDidMount() {
    const { navigation, getCustomerHasOrderedToday } = this.props;

    const locationquerystring = navigation.getParam('locationquerystring');
    const customerIsPrime = navigation.getParam('customerIsPrime');
    const customerEmail = navigation.getParam('customerEmail');
    const customerPaymentAccountID = navigation.getParam('customerPaymentAccountID');
    const subscriptionID = navigation.getParam('subscriptionID');

    var customerHasOrderedToday;
    if (getCustomerHasOrderedToday.customerHasOrderedToday) {
        customerHasOrderedToday = true;
    }
    else {
        customerHasOrderedToday = navigation.getParam('customerHasOrderedToday');
    }

    this.setState({
        locationquerystring,
        customerIsPrime,
        customerHasOrderedToday,
        customerEmail,
        customerPaymentAccountID,
        subscriptionID,
    });
  }

  fetchData = () => {

    const { searchtext, locationquerystring } = this.state;

    var fullapiurl = apis.GETlunchmenu + '?companyID=' + locationquerystring + "&mealTitle=" + searchtext;

    fetch(fullapiurl, {
            method: 'GET',
            headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json();})
        .then(responseData => {return responseData;})
        .then(data => {
          this.setState({
            data: data
          });
        })
        .catch(err => {
            console.log("fetch error" + err);
    });

  }

  submitEdit(event) {
    Keyboard.dismiss()
  }

  editingEnd(text) {    
    clearTimeout(this.lastTimeout);
    this.lastTimeout = setTimeout(() => {this._changeInput(text)} ,250)
  }

  _changeInput(text) {
    this.setState({
      searchtext: text,
    }, () => {
      this.fetchData()
    })
  }

  renderCloseButton() {
    return (
      <TouchableOpacity
          style={{ 
            position:'absolute', 
            left:10, 
            top:20, 
            zIndex:10,
            padding:10, 
            height: 50,
            width: 50,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: 'transparent'}}
            onPress={() => 
              {
                Keyboard.dismiss(),
                this.props.navigation.dispatch(NavigationActions.back())
              }
            }
        >

        <Image
            style={{ 
              height: 15,
              width: 15,
            }}
            source={closeIcon}
          />
        
        
        </TouchableOpacity>
    )
  }

  onItemPressed = (navigation, {item}) => {

    Keyboard.dismiss()

    setTimeout(function () {
      navigation.navigate({
        routeName: 'MenuDetail',
        params: {
            selectedLunchMenu: JSON.stringify(item),
            customerIsPrime: this.state.customerIsPrime,
            customerHasOrderedToday: this.state.customerHasOrderedToday,
            customerEmail: this.state.customerEmail,
            customerPaymentAccountID: this.state.customerPaymentAccountID,
            subscriptionID: this.state.subscriptionID,
        },
      });    
    }.bind(this), 50);

  }

  _renderItem = ({item}) => (
    <View style={{flex:1}}>
       
       <Touchable 
          style={{padding: 20}}
          onPress={this.onItemPressed.bind(this, this.props.navigation, {item})}
          background={Touchable.Ripple(colors.ripplegray)}    >

        <View
          style={{ flexDirection: 'row' }}>

            <Image
              style={{ marginLeft:5, justifyContent:'center', alignSelf:'center', height: 20, width: 20, opacity: 0.7,}}
              source={searchIcon}
            />

            <Text numberOfLines={1} style={{ marginLeft:20, marginRight:20, color:colors.greyBlack, fontSize: 17}}>
              {item.title}
            </Text>

        </View>

        </Touchable>

      </View>
  )

  renderFooter = () => {
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          borderColor: "#CED0CE"
        }}
      >
      </View>
    );
  };

  renderSearchFlatList() {
    return (

      <FlatList
        keyboardShouldPersistTaps='always'
        data={this.state.data}
        keyExtractor={(item) => item._id}
        renderItem={this._renderItem}
        ListFooterComponent={this.renderFooter} 
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
    ) 
  };


  render() {

    return (
      <KeyboardAvoidingView style={{backgroundColor:'white', display: 'flex', flex:1}}>

        <View 
          style={{ 
            backgroundColor: 'white', 
            paddingTop:80, paddingLeft:30, paddingRight:30, paddingBottom: 20, 
            borderLeftWidth: 0, 
            borderRightWidth: 0, 
            borderTopWidth: 0,
            borderBottomWidth: 1,
            shadowColor: '#000',
            shadowOffset: {
                width: 1,
                height: 5
            },
            shadowRadius: 5,
            shadowOpacity: 0.8,
            borderColor: '#ddd', 
            elevation: 3}}>

          {this.renderCloseButton()}

          <TextInput 
            returnKeyType="search"
            autoFocus={true}
            autoCapitalize={true}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            placeholder="Search Meals"
            placeholderTextColor={colors.lightGray}
            onChangeText={this.editingEnd}
            onSubmitEditing={this.submitEdit}
            style={{ color: colors.greyBlack, fontWeight: '500', fontSize: 24}}>
          </TextInput>

        </View>

        {this.renderSearchFlatList()}

      </KeyboardAvoidingView >

    )
  }
}

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getRefreshToken: state.getRefreshToken,
  getCustomerHasOrderedToday: state.getCustomerHasOrderedToday,
  getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

SearchView.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  setcustomerHasOrderedToday: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);