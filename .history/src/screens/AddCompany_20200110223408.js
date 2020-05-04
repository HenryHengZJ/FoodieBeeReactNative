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
} from "react-native";

import colors from '../styles/colors';
import apis from '../apis';
import deviceStorage from '../helpers/deviceStorage';
import ActionCreators from '../redux/actions';

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
            companyFullAddress: '',
            companyAddress: '',
            companyCity: '',
            companyCounty: '',
            companyCountry: '',
            isSearched: false,
          };
    }

    componentDidMount() {
        Geocoder.init(GOOGLE_API_KEY);
        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          this.updateMap(this.state.center);
        }, 10);
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
          latitudeDelta: this.state.region !== null ? this.state.region.latitudeDelta : 0.006181453364597189,
          longitudeDelta: this.state.region !== null ? this.state.region.longitudeDelta : 0.005662478506565982,
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
              region: newRegion,
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
            <View>
            

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
  
