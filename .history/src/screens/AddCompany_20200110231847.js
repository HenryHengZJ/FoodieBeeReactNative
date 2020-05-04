import React, { Component } from "react";
import { PropTypes } from 'prop-types';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard
} from "react-native";

import colors from '../styles/colors';
import apis from '../apis';
import deviceStorage from '../helpers/deviceStorage';
import ActionCreators from '../redux/actions';
import Notification from '../components/Notification';

import axios from 'axios';
import MapView from "react-native-maps";
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const GOOGLE_API_KEY = 'AIzaSyCFHrZBb72wmg5LTiMjUgI_CLhsoMLmlBk';

class AddCompany extends Component {

    constructor(props) {
		super(props);

        this.state = {
            region: null,
            initialRegion: null,
            center: {
              latitude: 53.3498053,
              longitude: -6.2603097,
            },
            isCollapse: false,
            companyName: '',
            companyFullAddress: '',
            companyAddress: '',
            companyCity: '',
            companyCounty: '',
            companyCountry: '',
            isSearched: false,
            hideAddButton: false,
            isSearchAddressMissing: false,
            showNotification: true,
          };
    }

    componentDidMount() {
        Geocoder.init(GOOGLE_API_KEY);
        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          this.updateMap(this.state.center);
        }, 10);
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            hideAddButton: true
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            hideAddButton: false
        })
    }

    addCompanyPressed = () => {
        if (typeof this.props.getUserid.userid === 'undefined' || this.props.getUserid.userid === "") {
            navigation.navigate('LogIn');
        }
        else {
            this.addNewCompany()
        }
    }

    addNewCompany = () => {

        const {center, companyName, companyAddress, companyFullAddress, companyCity, companyCountry, companyCounty} = this.state

        var data = {
            location: {
                type: "Point",
                coordinates: [center.latitude, center.longitude]
            },
            companyName: companyName,
            companyAddress: companyAddress,
            companyFullAddress: companyFullAddress,
            companyCity: companyCity,
            companyCountry: companyCountry,
            companyCounty: companyCounty,
        }

        var headers = {
            'Content-Type': 'application/json',
        }
    
        var url = apis.POSTcompany;
    
        axios.post(url, data, {withCredentials: true}, {headers: headers})
        .then((response) => {
            if (response.status === 200) {
                Keyboard.dismiss()
                const newcompanyID = response.data._id
                const companySearchText = companyName + " | " + companyFullAddress
                this.props.navigation.state.params.onAddCompanyClose(newcompanyID, companySearchText)
                this.props.navigation.goBack();
            } 
        })
        .catch((error) => {
            this.setState({
                showNotification: true
            })
        });
        
    }
    
    updateMap = center => {
        var newRegion = {
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.04864195044303443,
          longitudeDelta: 0.040142817690068,
        };
        this.setState({ initialRegion: newRegion })
    };
    
    onPanDrag(region) {
         if (this.state.isSearched) {
           this.setState({
             isSearched: false
           })
         }
    }
    
    onRegionChange(region) {
    
        if (this.state.isSearched) {
          return
        }
        var newRegion = {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        };
        var newCenter = {
          latitude: region.latitude,
          longitude: region.longitude,
        };
        this.setState({
          region: newRegion,
          center: newCenter,
        });
        Geocoder.from(region.latitude, region.longitude)
          .then(response => {
           // console.log(response);
            
            var results = response.results
            var companyCountry = ""
            var companyCounty = ""
            var companyCity = ""
            var companyAddress = ""
            var companyFullAddress = ""
            var isStreetAddressAppeared = false
            
            for (var x = 0; x < results.length; x++) {
            
              //Check for country
              if (results[x].types.includes('country')) {
                companyCountry = results[x].address_components[0].long_name
              }
              
              //Check for county
              if (results[x].types.includes('administrative_area_level_1')) {
                companyCounty = results[x].address_components[0].long_name
              }
              
              //Check for city
              if (results[x].types.includes('locality')) {
                companyCity = results[x].address_components[0].long_name
              }
              
              //Check for street_address
              if (results[x].types.includes('street_address') && !isStreetAddressAppeared) {
                
                var street_address_components = results[x].address_components
    
                for (var i = 0; i < street_address_components.length; i++) {
                
                  //Check for street_number
                  if (street_address_components[i].types.includes('street_number')) {
                    companyAddress = companyAddress + street_address_components[i].long_name + ", "
                  }
                  
                  //Check for route
                  if (street_address_components[i].types.includes('route')) {
                    companyAddress = companyAddress + street_address_components[i].long_name + ", "
                  }
                  
                  //Check for sublocality
                  if (street_address_components[i].types.includes('sublocality')) {
                    companyAddress = companyAddress + street_address_components[i].long_name + ", "
                  }
                
                }
                
                //Remove last 2 substrings of companyAddress
                companyAddress = companyAddress.substring(0, companyAddress.length - 2);
    
                companyFullAddress = results[x].formatted_address
    
                //Set isStreetAddressAppeared to true to ensure only 1 address
                isStreetAddressAppeared = true
    
              }
                
            }
            
            this.GooglePlacesRef.setAddressText(companyFullAddress);
    
            this.setState({
              companyFullAddress,
              companyAddress,
              companyCity,
              companyCounty, 
              companyCountry, 
              isSearchAddressMissing: companyAddress === "" ? true : false
            });
    
          })
          .catch(error => console.log(error));
    }
    
    onSearchListPress = (data, details = null) => {
    
        const lat = details.geometry.location.lat
        const lng = details.geometry.location.lng
        
        var newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.006181453364597189,
          longitudeDelta: 0.005662478506565982,
        };
        var newCenter = {
          latitude: lat,
          longitude: lng,
        };
    
        Geocoder.from(lat, lng)
          .then(response => {
           // console.log(response);
            
            var results = response.results
            var companyCountry = ""
            var companyCounty = ""
            var companyCity = ""
            var companyAddress = ""
            var companyFullAddress = ""
      
            for (var x = 0; x < results.length; x++) {
            
              //Check for country
              if (results[x].types.includes('country')) {
                companyCountry = results[x].address_components[0].long_name
              }
              
              //Check for county
              if (results[x].types.includes('administrative_area_level_1')) {
                companyCounty = results[x].address_components[0].long_name
              }
              
              //Check for city
              if (results[x].types.includes('locality')) {
                companyCity = results[x].address_components[0].long_name
              }
    
            }
    
            for (var i = 0; i < details.address_components.length; i++) {
                
                  //Check for street_number
                  if (details.address_components[i].types.includes('street_number')) {
                    companyAddress = companyAddress + details.address_components[i].long_name + ", "
                  }
                  
                  //Check for route
                  if (details.address_components[i].types.includes('route')) {
                    companyAddress = companyAddress + details.address_components[i].long_name + ", "
                  }
                  
                  //Check for sublocality
                  if (details.address_components[i].types.includes('sublocality')) {
                    companyAddress = companyAddress + details.address_components[i].long_name + ", "
                  }
                
            }
                
            //Remove last 2 substrings of companyAddress
            companyAddress = companyAddress.substring(0, companyAddress.length - 2);
    
            companyFullAddress = details.formatted_address
            
            this.GooglePlacesRef.setAddressText(companyFullAddress);
    
            this.setState({
              companyFullAddress,
              companyAddress,
              companyCity,
              companyCounty, 
              companyCountry, 
              isSearchAddressMissing: companyAddress === "" ? true : false,
              isSearched: true,
            }, () => {
              this.setState({
                region: newRegion,
                center: newCenter,
              })
                clearTimeout(this.regionTimeout);
                this.regionTimeout = setTimeout(() => {
                  
                  this.map.animateToRegion(
                    newRegion,
                    350
                  );
                  
                }, 10);
            })
    
          })
          .catch(error => console.log(error));
    }
    
    expandIt = () => {
        this.setState({
          isCollapse: false,
        });
    };
    
    collapseIt = () => {
        this.setState({
          isCollapse: true,
        });
    };
    
    renderCollapseButton() {
        return (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              top: 10,
              zIndex: 10,
              padding: 10,
              height: 30,
              width: 30,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onPress={this.collapseIt.bind(this)}>
            <Icon name="chevron-up" color={colors.white} size={10} />
          </TouchableOpacity>
        );
    }
    
    renderExpandeButton() {
        return (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              top: 10,
              zIndex: 10,
              padding: 10,
              height: 30,
              width: 30,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onPress={this.expandIt.bind(this)}>
            <Icon name="chevron-down" color={colors.white} size={10} />
          </TouchableOpacity>
        );
    }

    render() {

        return (

            <View style={{ flex: 1, paddingTop: 120 }}>
                <View
                    style={{
                        width: '100%',
                        borderRadius: 10,
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 0,
                        alignSelf: 'center',
                        zIndex: 1,
                    }}>
                <Text
                    style={{
                        color: 'black',
                        paddingTop: 20,
                        fontWeight: '500',
                        paddingLeft: 25,
                        paddingRight: 25,
                        fontSize: 15,
                    }}>
                    Company Name
                </Text>

                {this.state.isCollapse ? this.renderExpandeButton() : this.renderCollapseButton()}

                <View
                    style={{
                        marginVertical: 20,
                        marginHorizontal: 25,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#d6d7da',
                        padding: 10,
                    }}>
                    <TextInput
                        lineHeight={30}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        multiline={true}
                        placeholder="Enter company name"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        onChangeText={value => this.setState({ companyName: value })}
                        value={this.state.companyName}
                        style={{
                            padding: 0,
                            color: 'black',
                            marginHorizontal: 10,
                            fontSize: 15,
                        }}
                    />
                </View>

                {this.state.isCollapse ? null : (
                <View>
                    <Text
                        style={{
                            color: 'black',
                            paddingTop: 0,
                            fontWeight: '500',
                            paddingLeft: 25,
                            paddingRight: 25,
                            fontSize: 15,
                        }}>
                        Company Address
                    </Text>

                    <View
                        style={{
                            marginVertical: 20,
                            marginHorizontal: 25,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#d6d7da',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                        <GooglePlacesAutocomplete
                            ref={(instance) => { this.GooglePlacesRef = instance }}
                            placeholder="Enter company address"
                            minLength={2} // minimum length of text to search
                            autoFocus={false}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            listViewDisplayed={false} // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => this.onSearchListPress(data, details)}
                            getDefaultValue={() => {
                                return this.state.companyFullAddress; // text input default value
                            }}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyCFHrZBb72wmg5LTiMjUgI_CLhsoMLmlBk',
                                language: 'en', // language of the results
                            }}
                            styles={{
                                textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                },
                                textInput: {
                                marginLeft: 0,
                                marginRight: 0,
                                color: 'black',
                                fontSize: 15,
                                },
                                predefinedPlacesDescription: {
                                color: '#1faadb',
                                },
                            }}
                        />
                    </View>

                    {this.state.isSearchAddressMissing ? 
                       <Text
                            style={{
                                color: 'red',
                                paddingTop: 0,
                                paddingLeft: 25,
                                paddingRight: 25,
                                fontSize: 14,
                                paddingBottom: 10,
                            }}>
                            * Please enter address with street name
                        </Text>

                   : null }

                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.5)',
                            paddingTop: 0,
                            paddingLeft: 25,
                            paddingRight: 25,
                            fontSize: 14,
                            paddingBottom: 20,
                        }}>
                        Or drag the map to pin your company's location
                    </Text>
                </View>
                )}
                </View>

                <MapView
                    ref={map => (this.map = map)}
                    initialRegion={this.state.initialRegion}
                    region={this.state.region}
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onPanDrag={this.onPanDrag.bind(this)}
                    onRegionChangeComplete={this.onRegionChange.bind(this)}>
                <MapView.Marker
                    key={0}
                    pinColor="red"
                    coordinate={this.state.center}
                />
                </MapView>

                {this.state.hideAddButton ? null :

                <View style={{ borderRadius:25, backgroundColor:'white', position:'absolute', bottom: 50, alignSelf: 'center', width: '80%', zIndex: 1}}>
                <Touchable
                    style={{ 
                        borderLeftWidth: 0, 
                        borderRightWidth: 0, 
                        borderTopWidth: 0,
                        borderBottomWidth: 1,
                        borderColor: '#dddddd', 
                        borderRadius:25,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 1,
                            height: 1,
                        },
                        shadowOpacity: 0.3,
                        justifyContent:'center',
                        elevation:2,
                        opacity: (this.state.companyName === "" || this.state.isSearchAddressMissing) ? 0.5 : 1.0,
                        backgroundColor: colors.priceblue}}
                    disabled={this.state.companyName === "" || this.state.isSearchAddressMissing }
                    onPress={this.addCompanyPressed.bind(this)}
                    >

                    <View style={{ alignItems:'center', justifyContent:'center'}}>

                        <Text style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, color: 'white', fontWeight: '500', fontSize: 15}}>
                        Add Company
                        </Text>

                    </View>

                </Touchable>
                </View> }

                <View style={{ zIndex: 10, position: 'absolute', bottom: 0, left: 0, right: 0, marginTop: this.state.showNotification ? 10 : 0 }}>
                    <Notification
                        showNotification={this.state.showNotification}
                        handleCloseNotification={()=> this.setState({showNotification: false})}
                        type="Error"
                        firstLine = "Unfortunately, an error occured"
                        secondLine="Please try again."
                    />
                </View>

            </View>
        
        );
    }
}


const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

AddCompany.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCompany);
  
