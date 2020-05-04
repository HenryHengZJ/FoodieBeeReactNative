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
} from "react-native";

import colors from '../styles/colors';
import apis from '../apis';
import axios from 'axios';

import MapView from "react-native-maps";
import Touchable from 'react-native-platform-touchable';

const closeIcon = require('../img/close-button.png');

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT + 100;

export default class AddCompany extends Component {

    constructor(props) {
		super(props);

		this.state = {
            redosearch: false,
            region: null,
            activeIndex: -1,
            locationquerystring: "",
            data: [],
            companyLocation: null,
		};
    }

    componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0);
    }

    componentDidMount() {
        // We should detect when scrolling has stopped then animate
        // We should just debounce the event listener here
        const { navigation } = this.props;
        const locationquerystring = navigation.getParam('locationquerystring')

        this.setState({
            locationquerystring,
        }, () => {
            this.getCompanyAddress(locationquerystring)
            this.fetchData()
        })

        this.animation.addListener(({ value }) => {
            // animate 30% away from landing on the next item
            let index = Math.floor(value / CARD_WIDTH + 0.3); 
            if (index >= this.state.data.length) {
                index = this.state.data.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(this.regionTimeout);
            this.regionTimeout = setTimeout(() => {
                if (this.index !== index) {
                this.index = index;
                this.setState({
                    activeIndex: index
                })
                const coordinate = {
                    latitude: this.state.data[index].catererDetails[0].location.coordinates[0],
                    longitude: this.state.data[index].catererDetails[0].location.coordinates[1]
                }
                this.map.animateToRegion(
                    {
                    ...coordinate,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta,
                    },
                    350
                );
                }
            }, 10);
        });
    }

    getCompanyAddress = (companyID) => {

        var url = apis.GETcompany + "?companyID=" + companyID 

        axios.get(url)
        .then((response) => {
            var data = response.data;
            if (data.length> 0) {
                var center = {
                    latitude: data[0].location.coordinates[0],
                    longitude: data[0].location.coordinates[1],
                    latitudeDelta: 0.04864195044303443,
                    longitudeDelta: 0.040142817690068,
                }
                this.setState({
                    region: center,
                    companyLocation: center,
                })
            }
        })
        .catch(err => {
        
        });

    };


    fetchData = () => {

        const {locationquerystring} = this.state;

        var url = apis.GETlunchmenu+'?companyID=' + locationquerystring;
    
        axios.get(url)
        .then((response) => {
        var data = response.data;
            this.setState({
                data: data,
                activeIndex: data.length > 0 ? 0 : -1,
            }, () => {
            if (this.state.redosearch && this.state.data.length > 0) {
                clearTimeout(this.regionTimeout);
                this.regionTimeout = setTimeout(() => {
                    this.index = 0;
                    const coordinate = {
                        latitude: this.state.data[0].catererDetails[0].location.coordinates[0],
                        longitude: this.state.data[0].catererDetails[0].location.coordinates[1]
                    }
                    this.map.animateToRegion(
                    {
                        ...coordinate,
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta,
                    },
                    350
                    );
                }, 10);
            }
            this.setState({
                redosearch: false,
            })
            })
        })
        .catch(err => {
            this.setState({
                redosearch: false,
            });
        });

    }

    onRegionChange(region) {
        var newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.04864195044303443,
            longitudeDelta: 0.040142817690068,
        }
        this.setState({
            region: newRegion  
        });  
    }

    onItemPressed = (navigation, item) => {
        navigation.navigate({
            routeName: 'MenuDetail',
            params: {
                selectedLunchMenu: JSON.stringify(item.marker),
            },
        });   
    }

    renderCloseButton() {
        return (
        <TouchableOpacity
            style={{ 
                position:'absolute', 
                left:20, 
                top:50, 
                zIndex:10,
                padding:10, 
                height: 40,
                width: 40,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                onPress={() => this.props.navigation.goBack()}
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

    render() {

        const activeCoordinate = this.state.activeIndex >= 0 ?
        {
            latitude: this.state.data[this.state.activeIndex].catererDetails[0].location.coordinates[0],
            longitude: this.state.data[this.state.activeIndex].catererDetails[0].location.coordinates[1]
        } : null 

        return (
        <View style={styles.container}>

            {this.renderCloseButton()}

            <View style={{ borderRadius:25, backgroundColor:'white', position:'absolute', top: 50, alignSelf: 'center', zIndex: 1}}>
            <Touchable
                disabled={this.state.redosearch ? true : false}
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
                    opacity: this.state.redosearch ? 0.2 : 1.0,
                    backgroundColor: colors.priceblue}}
                    onPress={() => 
                    {
                        this.setState({redosearch: true})
                        this.fetchData();

                    }}
                >

                <View style={{ alignItems:'center', justifyContent:'center'}}>

                    <Text style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, color: 'white', fontWeight: '500', fontSize: 15}}>
                    Redo search in this area
                    </Text>

                </View>

            </Touchable>
            </View>

            <MapView
                ref={map => this.map = map}
                initialRegion={this.state.region}
                style={styles.container}
                onRegionChangeComplete={this.onRegionChange.bind(this)}
            >

            { this.state.data.length > 0 ?
            this.state.data.map((marker, index) => {
                const coordinate = {
                    latitude: marker.catererDetails[0].location.coordinates[0],
                    longitude: marker.catererDetails[0].location.coordinates[1]
                }
                return (
                <MapView.Marker key={index} pinColor="orange" coordinate={coordinate}/>
                );
            }) : null}

            {this.state.activeIndex >= 0 ? <MapView.Marker key={this.state.activeIndex} pinColor="red" coordinate={activeCoordinate}/> : null }
            
            {this.state.companyLocation ? 
                <MapView.Marker coordinate={this.state.companyLocation}> 
                    <Image source={require('../img/company_location_pin.png')} style={{width: 40, height: 40}} />
                </MapView.Marker>
                
            : null }
            
            </MapView>
            <Animated.ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                decelerationRate={0}
                snapToAlignment={"center"}
                onScroll={Animated.event(
                    [
                    {
                        nativeEvent: {
                        contentOffset: {
                            x: this.animation,
                        },
                        },
                    },
                    ],
                    { useNativeDriver: true }
                )}
                style={styles.scrollView}
                contentContainerStyle={styles.endPadding}
            >
            {this.state.data.map((marker, index) => (
                <TouchableOpacity delayPressIn = {5000} onPress={this.onItemPressed.bind(this, this.props.navigation, {marker})} style={styles.card} key={index}>
    
                <Image
                    source={{uri: marker.src}}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
                <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>{marker.catererDetails[0].catererAddress}</Text>
                </View>
            
                </TouchableOpacity>
            ))}
            </Animated.ScrollView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 3,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#444",
  },
 
});

AddCompany.propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
};
