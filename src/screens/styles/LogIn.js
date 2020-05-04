/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';
import colors from '../../styles/colors';

let headingTextSize = 30;
let termsTextSize = 17;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
  termsTextSize = 16;
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1,
  },
  loginHeader: {
    fontSize: headingTextSize,
    color: colors.white,
    fontWeight: '500',
    marginBottom: 40,
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  createAccText: {
    marginTop: 20,
    color: colors.white,
    fontSize: termsTextSize,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    paddingBottom: 10,
  },
  noAccText: {
    marginTop: 20,
    color: colors.white,
    fontSize: termsTextSize,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
  },
  linkButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
 
});

export default styles;