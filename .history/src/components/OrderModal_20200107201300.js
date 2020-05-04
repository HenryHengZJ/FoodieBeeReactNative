


import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  StatusBar,
} from 'react-native';
import colors from '../styles/colors';
import LottieView from 'lottie-react-native';

export default class OrderModal extends Component {
  constructor(props) {
		super(props);
		this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation() {
    
    Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
    }).start(() => {
      this.setState({
        progress: new Animated.Value(0),
      })    
      this.startAnimation();
    });

  }

  render() {
    const { animationType, modalVisible, handleOnPress, orderStatus } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          null;
        }}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
        <View style={styles.wrapper}>
          <View style={styles.loaderContainer}>
            
            <LottieView 
              loop={true}
              style={{ marginTop:10, alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: orderStatus === "Loading"? 150 : 100, width: orderStatus === "Loading"? 150 : 100 }}
              source={Platform.OS == 'android' ? orderStatus === "Loading" ? "payment_loading.json" : orderStatus === "Success"? "success.json" : "failed.json" :  orderStatus === "Loading" ? require('../animation/payment_loading.json') : orderStatus === "Success"? require('../animation/success.json') : require('../animation/failed.json')} progress={this.state.progress} />

            {
              orderStatus === "Loading"? 
              <Text style={{marginTop:10, marginBottom: 20, marginHorizontal: 40, color: 'black', fontSize: 18, fontWeight: '500', lineHeight: 25, textAlign: 'center' }}>
                  Pre-ordering your meal
              </Text>
              :
              <Text 
                style={{marginTop:10, marginHorizontal: 20, color: 'black', fontSize: 15, lineHeight: 25, textAlign: 'center' }}>
                {
                  orderStatus === "Success"? 
                  "Meal pre-ordered! Just go to Orders section in your profile and show the respective order to the restaurant at your pickup time."
                  : 
                  "An error has occured. No money is charged from your bank. Please try again later or contact our support team at support@foodiebee.eu"
                }
              </Text>
            }

            {orderStatus !== "Loading" ?

            <TouchableOpacity
              style={{ 
                marginVertical: 20, 
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                borderLeftWidth: 0, 
                borderRightWidth: 0, 
                borderTopWidth: 0,
                borderBottomWidth: 1,
                borderColor: '#dddddd', 
                borderRadius:5,
                shadowColor: '#000',
                shadowOffset: {
                    width: 1,
                    height: 1
                },
                shadowOpacity: 0.4,
                paddingTop:10,
                paddingBottom:10,
                paddingLeft:15,
                paddingRight:15,
                elevation:3,
                backgroundColor: colors.white}}
                onPress={handleOnPress}
            >

              <Text 
              style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center',color: colors.themeblue, fontWeight: '500', fontSize: 18}}>
                {orderStatus === "Success"? 
                "View Orders" 
                : "OK"
                }
              </Text>

            </TouchableOpacity>      
            
            : null }
         
          </View>
        </View>
      </Modal>
    );
  }
}

OrderModal.propTypes = {
  animationType: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleOnPress: PropTypes.func,
  orderStatus: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    alignSelf: 'center',

  },
  loaderImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
});
