
export default {
    /*Caterer API*/
    GETcatererprofile: "http://www.foodiebee.herokuapp.com/caterer/getcatererprofile",
    GETcaterer: "http://www.foodiebee.herokuapp.com/caterer/getcaterer",
    POSTnewcaterersignup: "http://www.foodiebee.herokuapp.com/caterer/newcaterersignup",

    /*Customer API*/
    GETcustomerprofile: "http://www.foodiebee.herokuapp.com/customer/getcustomerprofile",
    UPDATEcustomerpassword: "http://www.foodiebee.herokuapp.com/customer/updatecustomerpassword",
    UPDATEcustomerprofile: "http://www.foodiebee.herokuapp.com/customer/updatecustomerprofile",

    /*Company API*/
    GETcompany: "http://www.foodiebee.herokuapp.com/company/getcompany",
    POSTcompany: "http://www.foodiebee.herokuapp.com/company/postcompany",

    /*Lunch Menu API*/
    GETlunchmenu: "http://www.foodiebee.herokuapp.com/lunchMenu/get_lunchmenu",

    /*Review API*/
    GETreview: "http://www.foodiebee.herokuapp.com/review/getreview",
    GETcaterer_review: "http://www.foodiebee.herokuapp.com/review/get_caterer_review",
    POSTreview: "http://www.foodiebee.herokuapp.com/review/addreview",
    UPDATEreview: "http://www.foodiebee.herokuapp.com/review/updatereview",

    /*Lunch Order API*/
    GETlunchorder: "http://www.foodiebee.herokuapp.com/lunchorder/getlunchorder",
    POSTlunchaddorder: "http://www.foodiebee.herokuapp.com/lunchorder/addlunchorder",
    PUTupdatelunchorder: "http://www.foodiebee.herokuapp.com/lunchorder/updatelunchorder",

    /*Payment API*/
    GETcustomer_paymentaccount: "http://www.foodiebee.herokuapp.com/payment/get_customer_paymentaccount",
    GETcustomer_card: "http://www.foodiebee.herokuapp.com/payment/get_customer_card",
    PUTupdate_customer_card: 'http://www.foodiebee.herokuapp.com/payment/update_customer_card',
    POSTcustomer_makepayment: 'http://www.foodiebee.herokuapp.com/payment/customer_makepayment',
    POSTsave_customer_card: "http://www.foodiebee.herokuapp.com/payment/save_customer_card",
    POSTcreate_customer_paymentaccount: "http://www.foodiebee.herokuapp.com/payment/create_customer_paymentaccount",
    UPDATE_customer_paymentaccount: "http://www.foodiebee.herokuapp.com/payment/update_customer_paymentaccount",
    DELETEcustomer_card: "http://www.foodiebee.herokuapp.com/payment/detach_customer_card",
    DELETE_cancel_payment_intent: "http://www.foodiebee.herokuapp.com/payment/cancel_paymentIntent",
    POSTcustomer_subscribe: 'http://www.foodiebee.herokuapp.com/payment/create_subscription',
    DELETE_cancel_subscription: "http://www.foodiebee.herokuapp.com/payment/cancel_subscription",

    /*Auth API*/
    POSTcustomersignup: "http://www.foodiebee.herokuapp.com/auth/customersignup",
    POSTcustomerlogin: "http://www.foodiebee.herokuapp.com/auth/customerlogin",
    GETcustomerlogout: "http://www.foodiebee.herokuapp.com/auth/logout",
    POSTpasswordreset: "http://www.foodiebee.herokuapp.com/auth/resetpassword",
    GETresetpassword: 'http://www.foodiebee.herokuapp.com/auth/getresetpassword',
    PUTupdatepassword: 'http://www.foodiebee.herokuapp.com/auth/updatepassword',

    /*Report & Message API*/
    POSTcustomermessage: "http://www.foodiebee.herokuapp.com/postmessage",

    /*OTHERS*/
    GETAppsVersion_BASEURL: 'http://www.foodiebee.herokuapp.com/appsversionapi/appsversion?',

  };



