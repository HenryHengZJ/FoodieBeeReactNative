import { AsyncStorage } from 'react-native';

const deviceStorage = {
    // our AsyncStorage functions will go here :)
    async saveItem(key, value) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async loadJWT() {
      try {
        const value = await AsyncStorage.getItem('jwttoken');
        if (value !== null) {
          this.setState({
            jwt: value,

          });
        } else {
         
        }
      } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
      }
    },

    async deleteJWT() {
      try{
        await AsyncStorage.removeItem('jwttoken')
        .then(
          () => {
            this.setState({
              jwt: null,
            })
          }
        );
      } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
      }
    },

    async deleteUserid() {
      try{
        await AsyncStorage.removeItem('userid')
        .then(
          () => {
            this.setState({
              userid: null,
            })
          }
        );
      } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
      }
    },
};

export default deviceStorage;