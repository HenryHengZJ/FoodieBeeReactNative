
export default {
    /*Caterer API*/
    GETcatererprofile: "http://localhost:5000/caterer/getcatererprofile",
    GETcaterer: "http://localhost:5000/caterer/getcaterer",
    POSTnewcaterersignup: "http://localhost:5000/caterer/newcaterersignup",

    /*Customer API*/
    GETcustomerprofile: "http://localhost:5000/customer/getcustomerprofile",
    UPDATEcustomerpassword: "http://localhost:5000/customer/updatecustomerpassword",
    UPDATEcustomerprofile: "http://localhost:5000/customer/updatecustomerprofile",

    /*Company API*/
    GETcompany: "http://localhost:5000/company/getcompany",
    POSTcompany: "http://localhost:5000/company/postcompany",

    /*Lunch Menu API*/
    GETlunchmenu: "http://localhost:5000/lunchMenu/get_lunchmenu",

    /*Review API*/
    GETreview: "http://localhost:5000/review/getreview",
    GETcaterer_review: "http://localhost:5000/review/get_caterer_review",
    POSTreview: "http://localhost:5000/review/addreview",
    UPDATEreview: "http://localhost:5000/review/updatereview",

    /*Lunch Order API*/
    GETlunchorder: "http://localhost:5000/lunchorder/getlunchorder",
    POSTlunchaddorder: "http://localhost:5000/lunchorder/addlunchorder",
    PUTupdatelunchorder: "http://localhost:5000/lunchorder/updatelunchorder",

    /*Payment API*/
    GETcustomer_paymentaccount: "http://localhost:5000/payment/get_customer_paymentaccount",
    GETcustomer_card: "http://localhost:5000/payment/get_customer_card",
    PUTupdate_customer_card: 'http://localhost:5000/payment/update_customer_card',
    POSTcustomer_makepayment: 'http://localhost:5000/payment/customer_makepayment',
    POSTsave_customer_card: "http://localhost:5000/payment/save_customer_card",
    POSTcreate_customer_paymentaccount: "http://localhost:5000/payment/create_customer_paymentaccount",
    UPDATE_customer_paymentaccount: "http://localhost:5000/payment/update_customer_paymentaccount",
    DELETEcustomer_card: "http://localhost:5000/payment/detach_customer_card",
    DELETE_cancel_payment_intent: "http://localhost:5000/payment/cancel_paymentIntent",
    POSTcustomer_subscribe: 'http://localhost:5000/payment/create_subscription',
    DELETE_cancel_subscription: "http://localhost:5000/payment/cancel_subscription",

    /*Auth API*/
    POSTcustomersignup: "http://localhost:5000/auth/customersignup",
    POSTcustomerlogin: "https://foodiebee.herokuapp.com/auth/customerlogin",
    GETcustomerlogout: "http://localhost:5000/auth/logout",
    POSTpasswordreset: "http://localhost:5000/auth/resetpassword",
    GETresetpassword: 'http://localhost:5000/auth/getresetpassword',
    PUTupdatepassword: 'http://localhost:5000/auth/updatepassword',

    /*Report & Message API*/
    POSTcustomermessage: "http://localhost:5000/postmessage",

    /*OTHERS*/
    GETAppsVersion_BASEURL: 'http://localhost:5000/appsversionapi/appsversion?',

  };



