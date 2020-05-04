import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StatusBar, Platform} from 'react-native'
import SelectMultiple from 'react-native-select-multiple'
import { Header } from 'react-native-elements';
import { PropTypes } from 'prop-types';

const cuisines = ["American","Asian","Burgers","Caribbean","Chinese","Dessert","Drinks","English","French","Greek","Halal","Indian","Irish","Italian","Japanese","Mexican","Middle Eastern","Pizza","Salad","Sandwich","Sushi","Thai","Vegetarian Friendly"]
 
const renderLabel = (label, style) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{marginLeft: 10}}>
        <Text style={{fontSize: 16, color: 'black'}}>{label}</Text>
      </View>
    </View>
  )
}
 
class Filter extends Component {

  constructor(props) {
		super(props);

		this.state = {
			selectedCuisines: []
		};
  }

  componentDidMount() {
    const { navigation } = this.props;
    const selectedCuisines = JSON.parse(navigation.getParam('selectedCuisines'));

    this.setState({
      selectedCuisines,
    });

  }

  onSelectionsChange = (selectedCuisines) => {
    // selectedCuisines is array of { label, value }
    this.setState({ selectedCuisines })
  }

  onFilterDone = (navigation) => {
     // alert(JSON.stringify(this.state.selectedCuisines))
      navigation.state.params.onFilterClose(JSON.stringify(this.state.selectedCuisines))
      navigation.goBack();
  }
 
  render () {
    return (
       <View style={{backgroundColor:'#ffffff', flex:1, paddingBottom: 80}}>
        <StatusBar backgroundColor='#ffffff' barStyle='dark-content' />
        <SelectMultiple
          items={cuisines}
          renderLabel={renderLabel}
          rowStyle={{borderBottomWidth: 0}}
          selectedItems={this.state.selectedCuisines}
          onSelectionsChange={this.onSelectionsChange} />

         <View 
          style={{ 
            position: 'absolute',
            bottom: 0,
            right: 0, 
            left: 0, 
            backgroundColor:'white', 
            height: 80, 
            width: '100%', 
            flex:1,}}>

          <View 
              style={{ backgroundColor: '#eeeeee', height:1, width: '100%'}}/>

          <View 
              style={{ paddingLeft:15 , paddingRight:15 , flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flex: 1 }}>

              <TouchableOpacity
                style={{ 
                    borderRadius:5, 
                    flex:1,
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15,
                    justifyContent:'center',
                    alignSelf: 'center',
                    elevation:2,
                    backgroundColor: '#20a8d8'}}
                    onPress={this.onFilterDone.bind(this, this.props.navigation)}
                >
                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
                         DONE
                    </Text>

              </TouchableOpacity>
          
          </View>

        </View>
      </View>
    )
  }
}

export default Filter;

Filter.propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
};