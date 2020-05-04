import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Image,
  Modal,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import colors from '../styles/colors';
import StarRating from 'react-native-star-rating';

export default class ReviewModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      starCount: null,
      reviewComment: "",
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    const { animationType, modalVisible, starCount, profilesrc, catererName, reviewComment, postReview, handleClosePress } = this.props;
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

            <View
                style={{ 
                  height: 100, 
                  width: 100,
                  borderRadius: 50, 
                  }}
            >
              <Image
                style={{ height: '100%', width: '100%', }}
                source={{uri: profilesrc} }
              />

            </View>
          
            <View>

              <Text style={{ paddingHorizontal: 20, textAlign: 'center', color: colors.greyBlack, fontWeight: '500', fontSize: 17}}>
                    {catererName} 
              </Text>

            </View>

            <View style={{marginTop: 15,}}>

              <StarRating
                disabled={false}
                fullStarColor={'orange'}
                maxStars={5}
                starStyle={{marginHorizontal: 10}}
                rating={this.state.starCount ? this.state.starCount : starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
            
            </View>

            
            <View style={{ marginVertical:20 , width: '90%', borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>

              <TextInput 
                lineHeight= {30}
                underlineColorAndroid='rgba(0,0,0,0)' 
                multiline={true} 
                placeholder="More details of your experience"
                placeholderTextColor="grey"
                onChangeText={(value) => this.setState({reviewComment: value})}
                value={this.state.reviewComment === "" ? reviewComment : this.state.reviewComment}
                style={{ padding: 0, color: colors.greyBlack,   marginHorizontal: 10, fontSize: 15}}>
              </TextInput>

             </View>

             <View style={{ marginBottom:20, flexDirection: 'row', width: '90%' }}>
               <TouchableOpacity
                  style={{ 
                      borderRadius:5,
                      shadowColor: '#000',
                      shadowOffset: {
                          width: 1,
                          height: 1
                      },
                      shadowOpacity: 0.4,
                      flex:1,
                      marginRight: 10,
                      justifyContent:'center',
                      elevation:3,
                      paddingTop:10,
                      paddingBottom:10,
                      paddingLeft:15,
                      paddingRight:15,
                      backgroundColor: colors.themeblue}}
                      onPress={postReview}
                  >

                    <Text style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center',color: 'white', fontWeight: '500', fontSize: 15}}>
                      POST
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={{ 
                      borderRadius:5,
                      shadowColor: '#000',
                      shadowOffset: {
                          width: 1,
                          height: 1
                      },
                      shadowOpacity: 0.4,
                      flex:1,
                      marginLeft: 10,
                      justifyContent:'center',
                      elevation:3,
                      paddingTop:10,
                      paddingBottom:10,
                      paddingLeft:15,
                      paddingRight:15,
                      backgroundColor: 'white'}}
                      onPress={handleClosePress}
                  >

                    <Text style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center',color: colors.themeblue, fontWeight: '500', fontSize: 15}}>
                      LATER
                    </Text>

                </TouchableOpacity>
             </View>

          </View>
        </View>
      </Modal>
    );
  }
}

ReviewModal.propTypes = {
  animationType: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  profilesrc: PropTypes.string.isRequired,
  catererName: PropTypes.string.isRequired,
  starCount: PropTypes.number.isRequired,
  reviewComment: PropTypes.string.isRequired,
  postReview: PropTypes.func.isRequired,
  handleClosePress: PropTypes.func.isRequired,
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
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    width: '90%'
  },
  
});
