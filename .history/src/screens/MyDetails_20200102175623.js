
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
  Animated,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  TextInput, 
  Alert,
  AlertIOS,
  Keyboard,
  NativeModules,
  NetInfo,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import Notification from '../components/Notification';
import NavBarButton from '../components/buttons/NavBarButton'
import Loader from '../components/Loader';
import colors from '../styles/colors';
import apis from '../apis';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';


const chevRightIcon = require('../img/right_chevron.png');

const internetIcon = require('../img/wifi.png');


class MyDetails extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: <NavBarButton 
            handleButtonPress={() => 
                this.updateUserProfile()
            } 
            location="right" color={colors.priceblue} text="SAVE" />,
        headerLeft: <NavBarButton 
            handleButtonPress={() => 
                navigation.goBack()
            } 
            location="left"
            icon={Platform.OS === 'ios' ? <Icon name="angle-left" color={colors.black} size={30} /> : <MaterialIcon name="arrow-back" color={colors.black} size={30} />} />,
    });

  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
      errortype: "",
      loadingVisible: true,
      saveloadingVisible: false,
      measures: 0,
      header: false,
      animation: '',
      firstopen: true,
      genderlist : [
        {
          label: 'Male',
          value: 'Male',
        },
        {
          label: 'Female',
          value: 'Female',
        },
      ],

      showProfileImage: false,
      showCoverImage: false,

      userid: null,
      error: null,
      userName: null,
      userProfileImage: null,
      userCoverImage: null,
      userNewProfileImage: null,
      userNewCoverImage: null,
      userLocation: null,
      userAbout: null,
      userGender: null,
      userBirthDate: null,
      userEmail: null,
      userNumOfWorkExp: 0,
      userWorkArray: [],
      userEducation: null,
      userLanguage: null,
      userLinkedAccount: null,
      userVerifiedInfo: 'Email Address',

      coverimageBroken: false,
      profimageBroken: false,

      internetStatus: false,
      editSaved: false,

    };

    this.onLocationListClose = this.onLocationListClose.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
   
  }

  componentWillMount() {
    
    const { navigation } = this.props;

    const userid = navigation.getParam('userid');

    this.setState({
      userid: userid,
    }, () => {
        this.loadUserEditedData();
    });


  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ internetStatus: isConnected }); }
    );
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ internetStatus: isConnected });
    console.log(`is connected: ${this.state.internetStatus}`);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    const { navigation } = this.props;
   // navigation.state.params.onEditProfileClose(this.state.editSaved);
  }

  onLocationListClose( locationName, locationSelected) {
 
    if (locationSelected) {
        this.setState({
            userLocation: locationName,
        })  
    } 
  }

  onLocationPressed = (navigation) => {
    {
      Keyboard.dismiss(),
      navigation.navigate('LocationContainer', { onLocationListClose: this.onLocationListClose })
    }
  }

  fetchUserData = () => {

    const { userid } = this.state;
  
    var url = apis.GETUser_BASEURL+'&userid__equals='+ userid;

    axios.get(url)
    .then((response) => {

      console.log("data = " + JSON.stringify(response.data) );

      this.setState({
        error: false,
        userName: response.data[0].name,
        userProfileImage: { uri: response.data[0].profileimage},
        userCoverImage: { uri: response.data[0].coverimage},
        userLocation: response.data[0].location,
        userAbout: response.data[0].about,
        userGender: response.data[0].gender,
        userBirthDate: response.data[0].birth,
        userEmail: response.data[0].email,
        userNumOfWorkExp: response.data[0].workexp.length,
        userWorkArray: response.data[0].workexp.length >=1 ? response.data[0].workexp: [], 
        userEducation: response.data[0].education,
        userLanguage: response.data[0].language,
        userLinkedAccount: response.data[0].provider,
   
        loadingVisible: false,
     
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        error: true,
        loadingVisible: false,
      })
    });
  }

  updateUserProfile = () => {

    this.setState({saveloadingVisible : true});

    const { 
      userid,
      userName,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userWorkArray,
      userEducation,
      userLanguage,
      userCoverImage,
      userProfileImage,
      userNewProfileImage,
      userNewCoverImage,
    } = this.state;

    var finaldata = {
      name: userName ? userName: null,
      location: userLocation ? userLocation: null,
      about: userAbout ? userAbout: null,
      gender: userGender ? userGender: null,
      birth: userBirthDate ? userBirthDate: null,
      email: userEmail ? userEmail: null,
      workexp: userWorkArray.length === 0 ? null : userWorkArray,
      education: userEducation ? userEducation: null,
      language: userLanguage ? userLanguage: null,
    }

    var jwtToken = this.props.getJWTToken.jwttoken;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken,
    }

    var updateuserurl = apis.PUTUser_BASEURL +"userid=" + userid;
    axios.put(updateuserurl, finaldata,  {headers: headers})
      .then((response) => {

        if (response.status === 200) {

          if (userNewProfileImage && userNewCoverImage) {
            this.uploadProfileImgCoverImg();
          }
          else if (userNewProfileImage) {
            this.uploadProfileImg();
          }
          else if (userNewCoverImage) {
            this.uploadCoverImg();
          }
          else if (!userNewProfileImage && !userNewCoverImage) {
            this.setState({ showNotification: false, saveloadingVisible: false, editSaved: true }, () => {
              this.deleteEditedData();
            })
          }
         
        }
        
      })
      .catch((error) => {
        this.setState({ saveloadingVisible: false, showNotification: true });
      });

  }


  handleCloseNotification() {
    this.setState({ showNotification: false });
  }


  loadUserEditedData = async() => {

    try {

      const finaldata = await AsyncStorage.getItem('finaldata');
    
      const finaldataJSON = JSON.parse(finaldata);
      
      if (!finaldata) {
        this.fetchUserData();
      }
      else {
        this.setState({
          userName: finaldataJSON.userName? finaldataJSON.userName : null,
          userLocation: finaldataJSON.userLocation? finaldataJSON.userLocation : null,
          userAbout: finaldataJSON.userAbout? finaldataJSON.userAbout : null,
          userGender: finaldataJSON.userGender? finaldataJSON.userGender : null,
          userBirthDate: finaldataJSON.userBirthDate? finaldataJSON.userBirthDate : null,
          userEmail: finaldataJSON.userEmail? finaldataJSON.userEmail : null,
          userWorkArray: finaldataJSON.userWorkArray === [] ? [] : finaldataJSON.userWorkArray ,
          userNumOfWorkExp: finaldataJSON.userWorkArray === [] ? 0 : finaldataJSON.userWorkArray.length,
          userEducation: finaldataJSON.userEducation? finaldataJSON.userEducation : null,
          userLanguage: finaldataJSON.userLanguage? finaldataJSON.userLanguage : null,
          userCoverImage: finaldataJSON.userCoverImage? {uri: finaldataJSON.userCoverImage} : {},
          userProfileImage: finaldataJSON.userProfileImage? {uri: finaldataJSON.userProfileImage} : {},
          loadingVisible: false,
          error: false,
        });
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }

  }

  deleteEditedData = async() => {
    try{
     
      await AsyncStorage.removeItem('finaldata');

      this.props.navigation.goBack();
    } catch (error) {
      console.log('AsyncStorage Errror: ' + error.message);
    }
  }

  saveEditedDataToAsync = async() => {

    const { 
      userName,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userWorkArray,
      userEducation,
      userLanguage,
      userCoverImage,
      userProfileImage,
    } = this.state;

    finaldata = {
      userName,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userWorkArray,
      userEducation,
      userLanguage,
      userCoverImage: userCoverImage.uri ? userCoverImage.uri : null,
      userProfileImage: userProfileImage.uri ? userProfileImage.uri : null,
    }

    try {
      await AsyncStorage.setItem('finaldata', JSON.stringify(finaldata));
   
      this.props.navigation.goBack();
    } catch (error) {
    
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  renderAbout(about) {
    return (
      <View style={{ marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            lineHeight= {30}
            underlineColorAndroid='rgba(0,0,0,0)' 
            multiline={true} 
            placeholder="Tell more about yourself"
            placeholderTextColor="grey"
            onChangeText={(value) => this.setState({userAbout: value})}
            value={about}
            style={{ padding: 0, color: colors.greyBlack,   marginHorizontal: 10, fontSize: 15}}>
         </TextInput>

      </View>
    )
  }
  
  renderEmail(email) {
    return (
      <View style={{  marginVertical:20 ,marginHorizontal: 25, borderWidth: 1, borderRadius: 5, borderColor: '#d6d7da',  padding: 10}}>
      
        <TextInput 
            underlineColorAndroid='rgba(0,0,0,0)' 
            placeholder="Enter your work email here"
            placeholderTextColor="grey"
            onChangeText={(value) => this.setState({userEmail: value})}
            value={email}
            style={{ padding: 0, color: colors.greyBlack,  marginHorizontal: 10, fontSize: 15}}>
         </TextInput>

      </View>
    )
  }
  
  renderLocation(location) {
    return (
      <TouchableOpacity style={{  marginVertical:20 ,marginHorizontal: 25,}}
        onPress={this.onLocationPressed.bind(this, this.props.navigation)}
      >
        <View style={{ flex:1, borderWidth: 1, padding:10, borderRadius: 5, borderColor: '#d6d7da', flexDirection: 'row'}}>
          {location != "" ? 
          <Text style={{ color: colors.greyBlack, flex:1, lineHeight: 30,  marginHorizontal: 10, fontSize: 15}}>
                {location}
          </Text>
          :
          <Text style={{ flex:1, lineHeight: 30,  color: 'grey', marginHorizontal: 10, fontSize: 15}}>
                Pick your location
          </Text>
          }
          
          <Image
            style={{ justifyContent:'center', marginRight: 5, alignSelf:'center', height: 20, width: 20, opacity: 0.5}}  
            source={chevRightIcon}
          />
  
        </View>
      </TouchableOpacity>
    )
  }
  
  renderNoInternetView() {
    return (
    
      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, paddingBottom: 10 }}>
         
          <View style={{flex: 1 , alignSelf:'center', alignItems:'center', justifyContent:'center',backgroundColor: 'white'}}>
              <Image 
                style={{ alignSelf:'center', alignItems:'center', justifyContent:'center', marginRight: 10,  height: 100, width: 100 }}
                source={internetIcon} />
              <Text
                  style={{ fontSize: 17, marginTop: 20, alignSelf:'center', alignItems:'center', justifyContent:'center', fontWeight: '400', color: colors.greyBlack  }}
              >No Internet Connection</Text>
              <TouchableOpacity
                style={{ 
                  borderLeftWidth: 0.5, 
                  borderRightWidth: 0.5, 
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: '#ddd', 
                  borderRadius:25,
                  shadowColor: '#000',
                  shadowOffset: {
                      width: 1,
                      height: 3,
                  },
                  shadowRadius: 25,
                  shadowOpacity: 0.8,
                  marginTop:20,
                  alignSelf: 'center',
                  paddingTop:10,
                  paddingBottom:10,
                  paddingLeft:20,
                  paddingRight:20,
                  justifyContent:'center',
                  elevation:3,
                  backgroundColor: '#67B8ED'}}
                  onPress={() => 

                    NetInfo.isConnected.fetch().done(
                      (isConnected) => { this.setState({ internetStatus: isConnected }); }
                    )

                  }
            >

              <View style={{flexDirection: 'row'}}>

                <Text style={{ color: 'white', alignItems:'center',alignSelf:'center', justifyContent:'center', fontWeight: '500', fontSize: 15}}>
                      RETRY
                </Text>

              </View>

            </TouchableOpacity>

          </View>

      </View>
  );
}
 
  render() {

    const {
      userName,
      userProfileImage,
      userCoverImage,
      userLocation,
      userAbout,
      userGender,
      userBirthDate,
      userEmail,
      userNumOfWorkExp,
      userWorkArray,
      userEducation,
      userLanguage,

      coverimageBroken,
      profimageBroken,
      loadingVisible,
      saveloadingVisible,
      showNotification,

      internetStatus,

    } = this.state
    
 
    return (
      <KeyboardAvoidingView style={{ backgroundColor:'white', flex:1}}>

        { loadingVisible ? 
        null :
        internetStatus ?

        <ScrollView 
          keyboardShouldPersistTaps='handled'
          style={{backgroundColor:'transparent', flex:1}}>

            <Text style={{color: colors.greyBlack, paddingTop:20, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              About
            </Text>

            {this.renderAbout(userAbout)}
            
            <Text style={{color: colors.greyBlack, paddingTop:0, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Location
            </Text>

            {this.renderLocation(userLocation? userLocation : '')}
            
           <Text style={{color: colors.greyBlack, fontWeight: '500', paddingLeft:25, paddingRight:25, fontSize: 18}}>
              Email
            </Text>

            {this.renderEmail(userEmail)}

            <View 
              style={{ backgroundColor: 'white', marginLeft: 25, marginTop:20, marginRight: 25, height:1, width: '90%'}}/>

        </ScrollView>

        :

        this.renderNoInternetView()}

        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />

        <Loader
          modalVisible={saveloadingVisible}
          animationType="fade"
        />

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, marginTop: showNotification ? 10 : 0 }}>
            <Notification
              showNotification={showNotification}
              handleCloseNotification={this.handleCloseNotification}
              type="Error"
              firstLine = {"Unfortunately, some errors occured."}
              secondLine="Please try again."
            />
        </View>

      </KeyboardAvoidingView >

    )
  }
}

const customStyles = StyleSheet.create({
  dateIcon: {
    position: 'absolute',
    left: 0,
    top: 4,
    marginLeft: 0
  },
  dateInput: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 15,
    color: 'grey',
  },
  dateText:{
    color: colors.greyBlack,
    fontSize: 15,
    justifyContent: 'flex-start',
  }
});

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
    borderBottomWidth: 1,
    borderColor: "#CED0CE",
  },
  header1: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
  },
  headerOrginal: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left:0,
    right:0,
    zIndex:1,
    height:70,
    borderColor: "#CED0CE",
  },
  headerText: {
    color: colors.greyBlack,
    fontSize: 20,
  },

});

MyDetails.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  getJWTToken: state.getJWTToken,
  getUserid: state.getUserid,
});

export default connect(mapStateToProps)(MyDetails);


