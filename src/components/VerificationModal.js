


import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import colors from '../styles/colors';

export default class VerificationModal extends Component {
  render() {
    const { animationType, modalVisible, handleOnPress, handleOnResendPress, txtmsg } = this.props;
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
            <Image
              style={styles.loaderImage}
              source={require('../img/gmail_logo.png')}
            />
            <Text 
              style={{marginTop:10, marginHorizontal: 20, color: 'black', fontSize: 15, lineHeight: 25, }}>
              {txtmsg}
            </Text>
            <View 
              style={{flexDirection: 'row'}}>
              <View
                style={{flex: 1}}/>

              <TouchableOpacity
                style={{ 
                    borderRadius: 5,
                    justifyContent:'center',
                    backgroundColor: 'white'}}
                    onPress={handleOnResendPress}
                >

                  <View style={{ marginRight: 10, alignItems:'center', justifyContent:'center'}}>

                    <Text style={{ padding: 20, color: colors.priceblue, fontWeight: '500', fontSize: 15}}>
                          Resend Verification
                    </Text>

                  </View>

              </TouchableOpacity>

              <TouchableOpacity
                style={{ 
                    borderRadius: 5,
                    justifyContent:'center',
                    backgroundColor: 'white'}}
                    onPress={handleOnPress}
                >

                  <View style={{ marginRight: 10, alignItems:'center', justifyContent:'center'}}>

                    <Text style={{ padding: 20, color: colors.green02, fontWeight: '500', fontSize: 15}}>
                          OK
                    </Text>

                  </View>

              </TouchableOpacity>


            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

VerificationModal.propTypes = {
  animationType: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleOnPress: PropTypes.func,
  handleOnResendPress: PropTypes.func,
  txtmsg: PropTypes.string.isRequired,
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
