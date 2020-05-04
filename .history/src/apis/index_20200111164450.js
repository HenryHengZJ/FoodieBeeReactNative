
export default {
    /*Caterer API*/
    GETcatererprofile: "http://foodiebee.herokuapp.com/caterer/getcatererprofile",
    GETcaterer: "http://foodiebee.herokuapp.com/caterer/getcaterer",
    POSTnewcaterersignup: "http://foodiebee.herokuapp.com/caterer/newcaterersignup",

    /*Customer API*/
    GETcustomerprofile: "http://foodiebee.herokuapp.com/customer/getcustomerprofile",
    UPDATEcustomerpassword: "http://foodiebee.herokuapp.com/customer/updatecustomerpassword",
    UPDATEcustomerprofile: "http://foodiebee.herokuapp.com/customer/updatecustomerprofile",

    /*Company API*/
    GETcompany: "http://foodiebee.herokuapp.com/company/getcompany",
    POSTcompany: "http://foodiebee.herokuapp.com/company/postcompany",

    /*Lunch Menu API*/
    GETlunchmenu: "http://foodiebee.herokuapp.com/lunchMenu/get_lunchmenu",

    /*Review API*/
    GETreview: "http://foodiebee.herokuapp.com/review/getreview",
    GETcaterer_review: "http://foodiebee.herokuapp.com/review/get_caterer_review",
    POSTreview: "http://foodiebee.herokuapp.com/review/addreview",
    UPDATEreview: "http://foodiebee.herokuapp.com/review/updatereview",

    /*Lunch Order API*/
    GETlunchorder: "http://foodiebee.herokuapp.com/lunchorder/getlunchorder",
    POSTlunchaddorder: "http://foodiebee.herokuapp.com/lunchorder/addlunchorder",
    PUTupdatelunchorder: "http://foodiebee.herokuapp.com/lunchorder/updatelunchorder",

    /*Payment API*/
    GETcustomer_paymentaccount: "http://foodiebee.herokuapp.com/payment/get_customer_paymentaccount",
    GETcustomer_card: "http://foodiebee.herokuapp.com/payment/get_customer_card",
    PUTupdate_customer_card: 'http://foodiebee.herokuapp.com/payment/update_customer_card',
    POSTcustomer_makepayment: 'http://foodiebee.herokuapp.com/payment/customer_makepayment',
    POSTsave_customer_card: "http://foodiebee.herokuapp.com/payment/save_customer_card",
    POSTcreate_customer_paymentaccount: "http://foodiebee.herokuapp.com/payment/create_customer_paymentaccount",
    UPDATE_customer_paymentaccount: "http://foodiebee.herokuapp.com/payment/update_customer_paymentaccount",
    DELETEcustomer_card: "http://foodiebee.herokuapp.com/payment/detach_customer_card",
    DELETE_cancel_payment_intent: "http://foodiebee.herokuapp.com/payment/cancel_paymentIntent",
    POSTcustomer_subscribe: 'http://foodiebee.herokuapp.com/payment/create_subscription',
    DELETE_cancel_subscription: "http://foodiebee.herokuapp.com/payment/cancel_subscription",

    /*Auth API*/
    POSTcustomersignup: "http://foodiebee.herokuapp.com/auth/customersignup",
    POSTcustomerlogin: "http://foodiebee.herokuapp.com/auth/customerlogin",
    GETcustomerlogout: "http://foodiebee.herokuapp.com/auth/logout",
    POSTpasswordreset: "http://foodiebee.herokuapp.com/auth/resetpassword",
    GETresetpassword: 'http://foodiebee.herokuapp.com/auth/getresetpassword',
    PUTupdatepassword: 'http://foodiebee.herokuapp.com/auth/updatepassword',

    /*Report & Message API*/
    POSTcustomermessage: "http://foodiebee.herokuapp.com/postmessage",

    /*OTHERS*/
    GETAppsVersion_BASEURL: 'http://foodiebee.herokuapp.com/appsversionapi/appsversion?',

  };



