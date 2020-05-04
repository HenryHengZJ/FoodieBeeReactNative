
import React, { Component } from 'react';
import {
    WebView
} from 'react-native';

export default class Prime extends Component {

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
       // alert(JSON.parse(message.nativeEvent.data).customerPaymentAccountID);
        const customerPaymentAccountID = JSON.parse(message.nativeEvent.data).customerPaymentAccountID;
        if (customerPaymentAccountID !== "") {
            if (customerPaymentAccountID === "Saved new card") {
                this.props.navigation.state.params.onNewCardAdded()
                this.props.navigation.goBack(); 
            }
            else {
                this.props.navigation.state.params.onNewCardAdded()
                this.props.navigation.goBack(); 
            }
        }
    }

    render() {

        return (

        <WebView
            source={{uri: `http://192.168.43.195:5000/mobileaddpayment?customerEmail=${this.state.customerEmail}&customerPaymentAccountID=${this.state.customerPaymentAccountID}`}}
            onMessage={this.onMessage}
        />

        );
    }
}
