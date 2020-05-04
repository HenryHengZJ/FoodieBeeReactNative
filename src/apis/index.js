
export default {
    /*Caterer API*/
    GETcatererprofile: "https://foodiebee.herokuapp.com/caterer/getcatererprofile",
    GETcaterer: "https://foodiebee.herokuapp.com/caterer/getcaterer",
    POSTnewcaterersignup: "https://foodiebee.herokuapp.com/caterer/newcaterersignup",

    /*Customer API*/
    GETcustomerprofile: "https://foodiebee.herokuapp.com/customer/getcustomerprofile",
    UPDATEcustomerpassword: "https://foodiebee.herokuapp.com/customer/updatecustomerpassword",
    UPDATEcustomerprofile: "https://foodiebee.herokuapp.com/customer/updatecustomerprofile",

    /*Company API*/
    GETcompany: "https://foodiebee.herokuapp.com/company/getcompany",
    POSTcompany: "https://foodiebee.herokuapp.com/company/postcompany",

    /*Lunch Menu API*/
    GETlunchmenu: "https://foodiebee.herokuapp.com/lunchMenu/get_lunchmenu",

    /*Review API*/
    GETreview: "https://foodiebee.herokuapp.com/review/getreview",
    GETcaterer_review: "https://foodiebee.herokuapp.com/review/get_caterer_review",
    POSTreview: "https://foodiebee.herokuapp.com/review/addreview",
    UPDATEreview: "https://foodiebee.herokuapp.com/review/updatereview",

    /*Lunch Order API*/
    GETlunchorder: "https://foodiebee.herokuapp.com/lunchorder/getlunchorder",
    POSTlunchaddorder: "https://foodiebee.herokuapp.com/lunchorder/addlunchorder",
    PUTupdatelunchorder: "https://foodiebee.herokuapp.com/lunchorder/updatelunchorder",

    /*Payment API*/
    GETcustomer_paymentaccount: "https://foodiebee.herokuapp.com/payment/get_customer_paymentaccount",
    GETcustomer_card: "https://foodiebee.herokuapp.com/payment/get_customer_card",
    PUTupdate_customer_card: 'https://foodiebee.herokuapp.com/payment/update_customer_card',
    POSTcustomer_makepayment: 'https://foodiebee.herokuapp.com/payment/customer_makepayment',
    POSTsave_customer_card: "https://foodiebee.herokuapp.com/payment/save_customer_card",
    POSTcreate_customer_paymentaccount: "https://foodiebee.herokuapp.com/payment/create_customer_paymentaccount",
    UPDATE_customer_paymentaccount: "https://foodiebee.herokuapp.com/payment/update_customer_paymentaccount",
    DELETEcustomer_card: "https://foodiebee.herokuapp.com/payment/detach_customer_card",
    DELETE_cancel_payment_intent: "https://foodiebee.herokuapp.com/payment/cancel_paymentIntent",
    POSTcustomer_subscribe: 'https://foodiebee.herokuapp.com/payment/create_subscription',
    DELETE_cancel_subscription: "https://foodiebee.herokuapp.com/payment/cancel_subscription",

    /*Auth API*/
    POSTcustomersignup: "https://foodiebee.herokuapp.com/auth/customersignup",
    POSTcustomerlogin: "https://foodiebee.herokuapp.com/auth/customerlogin",
    GETcustomerlogout: "https://foodiebee.herokuapp.com/auth/logout",
    POSTpasswordreset: "https://foodiebee.herokuapp.com/auth/resetpassword",
    GETresetpassword: 'https://foodiebee.herokuapp.com/auth/getresetpassword',
    PUTupdatepassword: 'https://foodiebee.herokuapp.com/auth/updatepassword',

    /*Report & Message API*/
    POSTcustomermessage: "https://foodiebee.herokuapp.com/postmessage",

    /*OTHERS*/
    GETAppsVersion_BASEURL: 'https://foodiebee.herokuapp.com/appsversionapi/appsversion?',

  };



