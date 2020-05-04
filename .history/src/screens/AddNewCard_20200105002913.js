
import React, { Component } from 'react';
import {
    WebView
} from 'react-native';

export default class Prime extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            customerEmail: "",
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const customerEmail = navigation.getParam('customerEmail');
        this.setState({
            customerEmail,
        }); 
    }

    render() {

        return (

        <WebView
            source={{uri: `http://192.168.0.214:5000/mobileaddpayment?customerEmail=${this.state.customerEmail}`}}
        />

        );
    }
}
