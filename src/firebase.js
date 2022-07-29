import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

/*const url = "http://127.0.0.1:5000";*/
const url; //Db link

const logInWithEmailAndPassword = async (email, password) => {

    if (email === "" && password === "") {
        return;
    }

    const loginData = { "username": email, "password" :password };
    const postUrl = url + "/login";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    const response = await axios.post(postUrl, loginData, { header });

    console.log(loginData);
    console.log(response.data);

    if (response.data.success) {
        console.log("OKAY")
        return response.data
    } else {
        console.log("NOT OKAY")
        return "NOT OK"
    }

};

const orderRequest = async (token, user_name, request_email, tpNumber, Vender, order) => {
    if (token === "" || user_name === "" || request_email === "" || tpNumber === "" || Vender === "" || order==="" ) {
        return "";
    }

    const userIdRequest = {
        "token": token,
        "vendor": Vender,
        "customerName": user_name,
        "email": request_email,
        "contact": tpNumber,
        "details": order
    };

    const postUrl = url + "/addOrder";
    const header = {
        'Method': 'POST',
    };
    console.log(userIdRequest);
    console.log(postUrl);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res)

    return res
};


const registerWithEmailAndPassword = async (company, email, password, type) => {

    if ( (company === "") && (email === "") && (password === "")) {
        console.log("Not Enoug data");
        return;
    }

    const loginData = { "company": company, "username": email, "password": password, "type":type };
    const postUrl = url + "/signup";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    const response = await axios.post(postUrl, loginData, { header });

    console.log(loginData);
    console.log(response.data);

    if (response.data.success) {
        console.log("OK")
        return "OK"
    } else {
        console.log("NOT OKAY")
        return "NOT OK"
    }

};


const getVenderListFormCompany = async (token) => {
    console.log(token);
    if (token === "") {
        return [];
    }

    const userIdRequest = { "token":token };
    const postUrl = url + "/getVendorList";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res.data.vendorList)
    return res.data.vendorList;
};

const removeVendorFromCompanyList = async (token,userName) => {
    console.log(token);
    if (token === "" || userName === "") {
        return "ERROR";
    }

    const userIdRequest = { "token": token, "vendor": userName };
    const postUrl = url + "/removeVendor";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    console.log(userIdRequest);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res)
    return res;
};

const addVendorToCompanyList = async (token, userName) => {
    console.log(token);
    if (token === "" || userName === "") {
        return "ERROR";
    }

    const userIdRequest = { "token": token, "vendor": userName };
    const postUrl = url + "/addNewVendor";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    console.log(userIdRequest);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res)
    return res;
};


const removeUserFromCompanyList = async (token, userName) => {
    console.log(token);
    if (token === "" || userName === "") {
        return "ERROR";
    }

    const userIdRequest = { "token": token, "employee": userName };
    const postUrl = url + "/removeEmployee";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    console.log(userIdRequest);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res)
    return res;
};


const getVenderDataList = async (token) => {
    console.log(token);
    if (token === "") {
        return [];
    }

    const userIdRequest = { "token": token };
    const header = {
        'Method': 'POST',
    };

    const postUrl = url + "/getVendorListAll";
    console.log(postUrl);
    console.log(userIdRequest);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res.data.vendorList)
    return (res.data.vendorList);

};

const getCompanyUserList = async (token) => {
    console.log(token);
    if (token === "") {
        return [];
    }

    const userIdRequest = { "token": token };
    const header = {
        'Method': 'POST',
    };

    const postUrl = url + "/getEmployeeList";
    console.log(postUrl);
    console.log(userIdRequest);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res)
    return (res.data.employeeList);

};


const getOrderHistory = async (token) => {
    console.log(token);
    if (token === "") {
        return;
    }
    const userIdRequest = { "token": token };
    const postUrl = url + "/getOrderHistory";
    const header = {
        'Method': 'POST',
    };

    console.log(postUrl);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res.data.orderList)
    return res.data.orderList;
};

const getstatsCompany = async (token) => {
    console.log(token);
    if (token === "") {
        return;
    }
    const userIdRequest = { "token": token };
    const postUrl = url + "/getOrdersStat";
    const header = {
        'Method': 'POST',
    };

    console.log(userIdRequest);
    console.log(postUrl);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res.data.stats)
    return res.data.stats;
};

const getVenderOrderList = async (token, stateNew) => {
    console.log(token);
    if (token === "" ) {
        return;
    }
    const userIdRequest = { "token": token, "status": stateNew };
    const postUrl = url + "/getOrdersByStatus";
    const header = {
        'Method': 'POST',
    };

    console.log(userIdRequest);
    console.log(postUrl);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res.data.orderList)
    return res.data.orderList;
};

const changeOrderStats = async (token, orderId, stateNew) => {
    console.log(token);
    if (token === "") {
        return;
    }
    const userIdRequest = { "token": token, "orderId": orderId , "status": stateNew };
    const postUrl = url + "/changeOrderStatus";
    const header = {
        'Method': 'POST',
    };

    console.log(userIdRequest);
    console.log(postUrl);
    const res = await axios.post(postUrl, userIdRequest, { header });
    console.log(res)
    return res;
};


export {
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    orderRequest,
    getVenderListFormCompany,
    getOrderHistory,
    getVenderDataList,
    getCompanyUserList,
    removeVendorFromCompanyList,
    addVendorToCompanyList,
    removeUserFromCompanyList,
    getstatsCompany,
    getVenderOrderList,
    changeOrderStats
};