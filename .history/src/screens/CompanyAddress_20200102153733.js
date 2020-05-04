
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Modal,
  Alert,
  TextInput,
  Picker
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';
import ContentLoader from '@sarmad1995/react-native-content-loader';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import colors from '../styles/colors';
import apis from '../apis';
import img from '../img/s3'

class CompanyAddress extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            locationquerystring: "5d8ca11c88211f271c35ba32",
            customerCompanyDetails: {},
            empty: false,
            loading: false,
        };
    }

    componentDidMount() {
        this.getCustomerDetails();
    }

    getCustomerDetails = () => {
        var headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }
    
        var url = apis.GETcustomerprofile
    
        axios({method: 'get', url: url, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
            alert(JSON.stringify(response.data[0]))
            if (response.status === 200) {
                this.setState({
                    locationquerystring: typeof response.data[0].customerCompanyID !== 'undefined' ? response.data[0].customerCompanyID : ""
                }, () => {
                    this.getCustomerCompanyDetails()
                })
            }
        })
        .catch(err => {
            this.setState({
                loading: false,
                empty: true,
                refreshing: false,
            })
        });
    }

    getCustomerCompanyDetails = () => {
        var headers = {
          'Content-Type': 'application/json',
        }
    
        var url = apis.GETcompany + "?companyID=" + this.state.locationquerystring;
    
        axios.get(url, {withCredentials: true}, {headers: headers})
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data)
              this.setState({
                customerCompanyDetails: response.data.length > 0 ? response.data[0] : {},
                empty: response.data.length > 0 ? false : true
              })
            } 
          })
          .catch((error) => {
          });
    }
    
    _renderItem() {
        const {customerCompanyDetails} = this.state
        return (
    
            <View style={{ margin: 15, borderWidth: 1, borderColor: '#ECECEC', padding:15, elevation:1, borderRadius: 10, backgroundColor: 'white' }}>
    
              <View style={{ flexDirection: 'column'}}>
    
                  <Text style={{ color: colors.priceblue, fontSize: 20, fontWeight: 'bold' }}>
                  {customerCompanyDetails.companyName}</Text>
    
                  <Text style={{ color: 'black', paddingTop: 10, fontSize: 15, lineHeight: 25 }}>
                  {customerCompanyDetails.companyFullAddress}</Text>
          
              </View>
    
              <View 
                  style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10 }}>
    
                  <TouchableOpacity
                    style={{ 
                        borderRadius:5, 
                        flex:1,
                        paddingTop:10,
                        paddingBottom:10,
                        paddingLeft:15,
                        paddingRight:15,
                        justifyContent:'center',
                        elevation:3,
                        backgroundColor: colors.themeblue}}
                    >
                        <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
                            Change
                        </Text>
    
                  </TouchableOpacity>
    
              </View>
    
            </View>
            
        )
    }
    
    renderEmptyView() {
        return (
          <Touchable 
            style={{ margin: 15, borderWidth: 1, borderColor: '#ECECEC', padding:25, elevation:1, borderRadius: 10, backgroundColor: 'white'  }}
            delayPressIn = {5000}
            background={Touchable.Ripple(colors.ripplegray)}>
    
              <View style={{ flexDirection: 'column'}}>
    
                  <Image
                    style={{ width: 50, height: 50, alignSelf: 'center', opacity: 0.3 }}
                    source={{uri: "https://icons-for-free.com/iconfiles/png/512/linecon+more+plus+round+icon-1320165922585878770.png"}} />
    
                  <Text style={{ color: 'black', paddingTop: 15, fontSize: 15, textAlign: 'center' }}>
                  Add Company</Text>
          
              </View>
    
    
          </Touchable>
        );
    }

    renderLoadingView() {
        return (
            <View style={{ margin: 15, borderWidth: 1, borderColor: '#ECECEC', padding:15, elevation:1, borderRadius: 10, backgroundColor: 'white' }}>
     
                <ContentLoader
                    active 
                    title={false}
                    listSize={1}
                    pHeight={[20, 10, 10]}
                    pWidth={["70%", "100%", "50%"]}
                />
               
            </View>
        );
    }

    render() {

        return (

        <View style={{backgroundColor:'#F5F5F5', flex:1}}>

            {!this.state.empty && this._renderItem()}

            {this.state.empty && this.renderEmptyView()}

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

CompanyAddress.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAddress);

