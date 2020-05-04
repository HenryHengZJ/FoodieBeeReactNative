
export default {
    /*Caterer API*/
    GETcatererprofile: "https://localhost:5000/caterer/getcatererprofile",
    GETcaterer: "https://localhost:5000/caterer/getcaterer",
    POSTnewcaterersignup: "https://localhost:5000/caterer/newcaterersignup",

    /*Customer API*/
    GETcustomerprofile: "https://localhost:5000/customer/getcustomerprofile",
    UPDATEcustomerpassword: "https://localhost:5000/customer/updatecustomerpassword",
    UPDATEcustomerprofile: "https://localhost:5000/customer/updatecustomerprofile",

    /*Company API*/
    GETcompany: "https://localhost:5000/company/getcompany",
    POSTcompany: "https://localhost:5000/company/postcompany",

    /*Lunch Menu API*/
    GETlunchmenu: "https://localhost:5000/lunchMenu/get_lunchmenu",

    /*Review API*/
    GETreview: "https://localhost:5000/review/getreview",
    GETcaterer_review: "https://localhost:5000/review/get_caterer_review",
    POSTreview: "https://localhost:5000/review/addreview",
    UPDATEreview: "https://localhost:5000/review/updatereview",

    /*Lunch Order API*/
    GETlunchorder: "https://localhost:5000/lunchorder/getlunchorder",
    POSTlunchaddorder: "https://localhost:5000/lunchorder/addlunchorder",
    PUTupdatelunchorder: "https://localhost:5000/lunchorder/updatelunchorder",

    /*Payment API*/
    GETcustomer_paymentaccount: "https://localhost:5000/payment/get_customer_paymentaccount",
    GETcustomer_card: "https://localhost:5000/payment/get_customer_card",
    PUTupdate_customer_card: 'https://localhost:5000/payment/update_customer_card',
    POSTcustomer_makepayment: 'https://localhost:5000/payment/customer_makepayment',
    POSTsave_customer_card: "https://localhost:5000/payment/save_customer_card",
    POSTcreate_customer_paymentaccount: "https://localhost:5000/payment/create_customer_paymentaccount",
    UPDATE_customer_paymentaccount: "https://localhost:5000/payment/update_customer_paymentaccount",
    DELETEcustomer_card: "https://localhost:5000/payment/detach_customer_card",
    DELETE_cancel_payment_intent: "https://localhost:5000/payment/cancel_paymentIntent",
    POSTcustomer_subscribe: 'https://localhost:5000/payment/create_subscription',
    DELETE_cancel_subscription: "https://localhost:5000/payment/cancel_subscription",

    /*Auth API*/
    POSTcustomersignup: "https://localhost:5000/auth/customersignup",
    POSTcustomerlogin: "https://foodiebee.herokuapp.com/auth/customerlogin",
    GETcustomerlogout: "https://localhost:5000/auth/logout",
    POSTpasswordreset: "https://localhost:5000/auth/resetpassword",
    GETresetpassword: 'https://localhost:5000/auth/getresetpassword',
    PUTupdatepassword: 'https://localhost:5000/auth/updatepassword',

    /*Report & Message API*/
    POSTcustomermessage: "https://localhost:5000/postmessage",

    /*OTHERS*/
    GETAppsVersion_BASEURL: 'https://localhost:5000/appsversionapi/appsversion?',

  };



