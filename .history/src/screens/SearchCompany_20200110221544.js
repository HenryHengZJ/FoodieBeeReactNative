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

import { NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';

const closeIcon = require('../img/close-button_black.png');
const searchIcon = require('../img/search.png');

export default class SearchCompany extends Component {

  static navigationOptions = ({ navigation }) => ({
    header:null,
    
  });

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchtext: "",
    };

    this.lastTimeout = setTimeout; 
    this.editingEnd = this.editingEnd.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  componentDidMount() {
  }



  fetchData = () => {

    const { searchtext } = this.state;

    var fullapiurl = apis.GETcompany + "?companyName=" + searchtext
  
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
          })
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
      if (text !== "") this.fetchData()
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
    const companySearchText = item.companyName + " | " + item.companyFullAddress
    navigation.state.params.onSearchCompanyClose(item._id, companySearchText)
    navigation.goBack();
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
              {item.companyName} | {item.companyFullAddress}
            </Text>

        </View>

        </Touchable>

      </View>
  )

  onAddCompanyPressed = (navigation) => {
    Keyboard.dismiss()
    navigation.navigate('AddCompany')
  }

  renderFooter = () => {
    return (
      <View
        style={{
          borderTopWidth: 0,
          borderColor: "#CED0CE"
        }}
      >
        {this.state.searchtext !== "" ?
        <Touchable 
          style={{padding: 20}}
          onPress={this.onAddCompanyPressed.bind(this, this.props.navigation)}
          background={Touchable.Ripple(colors.ripplegray)}    >

        <View
          style={{ flexDirection: 'row' }}>

            <Image
              style={{ marginLeft:5, justifyContent:'center', alignSelf:'center', height: 20, width: 20, opacity: 0.7,}}
              source={searchIcon}
            />

            <Text numberOfLines={1} style={{ marginLeft:20, marginRight:20, color:colors.greyBlack, fontSize: 17}}>
              Add new company: <Text style={{color: colors.priceblue}}>{this.state.searchtext}</Text>
            </Text>

        </View>

        </Touchable> : null }
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
            placeholder="Search Company"
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

const styles = StyleSheet.create({
  heading: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 25,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderColor: colors.shadowgray,
    flexDirection: 'row',
   // backgroundColor: colors.shadowgray,
  },
});

SearchCompany.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};
