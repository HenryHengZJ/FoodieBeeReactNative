
export default {
    /*Caterer API*/
    GETcatererprofile: "http://192.168.0.214:5000/caterer/getcatererprofile",
    GETcaterer: "http://192.168.0.214:5000/caterer/getcaterer",
    POSTnewcaterersignup: "http://192.168.0.214:5000/caterer/newcaterersignup",

    /*Customer API*/
    GETcustomerprofile: "http://192.168.0.214:5000/customer/getcustomerprofile",
    UPDATEcustomerpassword: "http://192.168.0.214:5000/customer/updatecustomerpassword",
    UPDATEcustomerprofile: "http://192.168.0.214:5000/customer/updatecustomerprofile",

    /*Company API*/
    GETcompany: "http://192.168.0.214:5000/company/getcompany",
    POSTcompany: "http://192.168.0.214:5000/company/postcompany",

    /*Lunch Menu API*/
    GETlunchmenu: "http://192.168.0.214:5000/lunchMenu/get_lunchmenu",

    /*Review API*/
    GETreview: "http://192.168.0.214:5000/review/getreview",
    GETcaterer_review: "http://192.168.0.214:5000/review/get_caterer_review",
    POSTreview: "http://192.168.0.214:5000/review/addreview",
    UPDATEreview: "http://192.168.0.214:5000/review/updatereview",

    /*Lunch Order API*/
    GETlunchorder: "http://192.168.0.214:5000/lunchorder/getlunchorder",
    POSTlunchaddorder: "http://192.168.0.214:5000/lunchorder/addlunchorder",
    PUTupdatelunchorder: "http://192.168.0.214:5000/lunchorder/updatelunchorder",

    /*Payment API*/
    GETcustomer_paymentaccount: "http://192.168.0.214:5000/payment/get_customer_paymentaccount",
    GETcustomer_card: "http://192.168.0.214:5000/payment/get_customer_card",
    PUTupdate_customer_card: 'http://192.168.0.214:5000/payment/update_customer_card',
    POSTcustomer_makepayment: 'http://192.168.0.214:5000/payment/customer_makepayment',
    POSTsave_customer_card: "http://192.168.0.214:5000/payment/save_customer_card",
    POSTcreate_customer_paymentaccount: "http://192.168.0.214:5000/payment/create_customer_paymentaccount",
    UPDATE_customer_paymentaccount: "http://192.168.0.214:5000/payment/update_customer_paymentaccount",
    DELETEcustomer_card: "http://192.168.0.214:5000/payment/detach_customer_card",
    DELETE_cancel_payment_intent: "http://192.168.0.214:5000/payment/cancel_paymentIntent",
    POSTcustomer_subscribe: 'http://192.168.0.214:5000/payment/create_subscription',
    DELETE_cancel_subscription: "http://192.168.0.214:5000/payment/cancel_subscription",

    /*Auth API*/
    POSTcustomersignup: "http://192.168.0.214:5000/auth/customersignup",
    POSTcustomerlogin: "http://192.168.0.214:5000/auth/customerlogin",
    GETcustomerlogout: "http://192.168.0.214:5000/auth/logout",
    POSTpasswordreset: "http://192.168.0.214:5000/auth/resetpassword",
    GETresetpassword: 'http://192.168.0.214:5000/auth/getresetpassword',
    PUTupdatepassword: 'http://192.168.0.214:5000/auth/updatepassword',
    GETnewtoken: 'http://192.168.0.214:5000/auth/get_newtoken',

    /*Report & Message API*/
    POSTcustomermessage: "http://192.168.0.214:5000/postmessage",

    /*OTHERS*/
    GETAppsVersion_BASEURL: 'http://192.168.0.214:5000/appsversionapi/appsversion?',

  };



