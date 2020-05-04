import React from 'react';
import { Dimensions, Alert, StyleSheet, ActivityIndicator, ProgressBarAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CaptureButton from './CaptureButton.js'
import axios from 'axios';

export default class Camera extends React.Component {

	constructor(props){
		super(props);
        this.state = { 
			identifedAs: '',
			loading: false
		}
    }

    takePicture = async function(){
		
		if (this.camera) {

            // Set the activity indicator
			this.setState({
				loading: true
			});
			
			// Set options
            const options = {quality: 0.5, exif: false, base64: true  };
            
            this.camera.takePictureAsync(options).then(data => {
                this.identifyImage(data.base64)
              }).catch(console.log)
			
			// Get the base64 version of the image
            //const data = await this.camera.takePictureAsync(options)
            
            //alert("data = " + data.uri)
			
			// Get the identified image
			//this.identifyImage(data.base64);
		}
	}

	identifyImage(imageData){

        // Pause the camera's preview
		this.camera.pausePreview();

		// Initialise Clarifai api
		const Clarifai = require('clarifai');

		const app = new Clarifai.App({
			apiKey: 'fa3a124363c9450ea47d7928326d86bb'
		});

		// Identify the image
		app.models.predict(Clarifai.FOOD_MODEL, {base64: imageData})
			.then((response) => this.displayAnswer(response.outputs[0].data.concepts[0].name)
			.catch((err) => alert(err))
		);
	}

	displayAnswer(identifiedImage){

        alert("Identified item = " + identifiedImage)

		// Dismiss the acitivty indicator
		this.setState({
			identifedAs:identifiedImage,
			loading:false
		});

		// Resume the preview
		this.camera.resumePreview();
    }
    
    identifyBarcodeItem = (barcodes) => {

        upccode = barcodes[0].data

        var url = "https://world.openfoodfacts.org/api/v0/product/"+upccode+'.json'

        axios.get(url)
        .then((response) => {
            //alert(JSON.stringify(response.data))
            alert(response.data.product.product_name)
             
            var data = response.data; 
            
        })
        .catch((error) => {
            console.log('container err = ' + error);
            
        });
    }
    
	render() {
		return (
            <RNCamera 
            ref={ref => {this.camera = ref;}} 
            style={styles.preview} 
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
                this.identifyBarcodeItem(barcodes)
              }}>
            <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
                <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/>
            </RNCamera>
		);
	}
}

const styles = StyleSheet.create({
    preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
	},
	loadingIndicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});