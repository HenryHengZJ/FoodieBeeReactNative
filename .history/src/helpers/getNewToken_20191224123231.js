import apis from '../apis';
import deviceStorage from '../helpers/deviceStorage';

export function getNewToken(jwttoken, refreshtoken, setJWT, callback) 
{
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + jwttoken,
  }

  var url = apis.GETnewtoken + "?refreshToken=" + refreshtoken;

  axios({method: 'get', url: url, headers: headers})
  .then((response) => {
      if (response.headers['x-auth'] !== 'undefined') {
          deviceStorage.saveItem("jwttoken", response.headers['x-auth']);
          setJWT(response.headers['x-auth'])
          callback(null, true)
      }
      else {
        callback(true)
      }
  })
  .catch(err => {
    callback(err)
  }); 
}