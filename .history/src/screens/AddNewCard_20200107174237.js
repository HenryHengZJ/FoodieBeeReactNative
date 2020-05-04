
import React, { Component } from 'react';
import {
    WebView
} from 'react-native';
import { PropTypes } from 'prop-types';

import apis from '../apis';
import deviceStorage from '../helpers/deviceStorage';
import ActionCreators from '../redux/actions';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class Prime extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            customerEmail: "",
            customerPaymentAccountID: "",
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const customerEmail = navigation.getParam('customerEmail');
        const customerPaymentAccountID = navigation.getParam('customerPaymentAccountID');
        
        this.setState({
            customerEmail,
            customerPaymentAccountID,
        }); 
    }

    onMessage(message) {
        //Prints out data that was passed.
        //alert(JSON.parse(message.nativeEvent.data).customerPaymentAccountID);
        const customerPaymentAccountID = JSON.parse(message.nativeEvent.data).customerPaymentAccountID;
        if (customerPaymentAccountID !== "") {
            if (customerPaymentAccountID === "Saved new card") {
                this.goBackWithCardAdded()
            }
            else {
                this.updateCustomerDetails(customerPaymentAccountID)
            }
        }
    }

    goBackWithCardAdded = () => {
        this.props.navigation.state.params.onNewCardAdded(true, this.state.customerPaymentAccountID)
        this.props.navigation.goBack(); 
    }

    updateCustomerDetails = (customerPaymentAccountID) => {
        var body = {
            customerPaymentAccountID: customerPaymentAccountID,
        }
     
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.getJWTToken.jwttoken + " Refresh " + this.props.getRefreshToken.refreshtoken,
        }

        var url = apis.UPDATEcustomerprofile;

        axios({method: 'put', url: url, data: body, headers: headers})
        .then((response) => {
            if (response.headers['x-auth'] !== 'undefined') {
                deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
                this.props.setJWT(response.headers['x-auth'])
            }
            if (response.status === 201) {
                this.setState({
                    customerPaymentAccountID
                }, () => {
                    this.goBackWithCardAdded()
                })
            } 
        })
        .catch((error) => {
            this.goBackWithCardAdded()
        }); 
    }

    render() {

        return (

        <WebView
            source={{uri: `http://192.168.43.195:5000/mobileaddpayment?customerEmail=${this.state.customerEmail}&customerPaymentAccountID=${this.state.customerPaymentAccountID}`}}
            onMessage={this.onMessage.bind(this)}
        />

        );
    }
}


const mapStateToProps = state => ({
    getJWTToken: state.getJWTToken,
    getRefreshToken: state.getRefreshToken,
    getUserid: state.getUserid,
});

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

Prime.propTypes = {
  setJWT: PropTypes.func.isRequired,
  setUID: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Prime);
  
