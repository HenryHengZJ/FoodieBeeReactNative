import { PermissionsAndroid } from 'react-native';

export async function requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'FoodieBee',
        'message': 'FoodieBee need access to your location in order to show nearby restaurants '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
    
    } else {
      console.log("location permission denied")
    
    }
  } catch (err) {
    console.warn(err)
  }
}