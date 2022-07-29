import React, { Component, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./Order.css"
import { orderRequest, getVenderListFormCompany } from "./../firebase";



function Order() {
    const [token, setTokenID] = useState(
        JSON.parse(localStorage.getItem('token')) || "");

    const [venderList, setVenders] = useState([]);
    const [user_name, setUserName] = useState("");
    const [request_email, setRequestEmail] = useState("");
    const [tpNumber, setTP] = useState("");
    const [Vender, setVender] = useState("");
    const [order, setOrder] = useState("");

    useEffect(async () => {
        setVenders(await getVenderListFormCompany(token));
        console.log(venderList);
        setVender(venderList[0]);
    }, [Vender]);



    const onClickHandle = async (e) => {
        e.preventDefault();
        const res = await orderRequest(token, user_name, request_email, tpNumber, Vender, order)
        console.log(res)
        if (res.success === "true") {
            setUserName("");
            setRequestEmail("");
            setTP("");
            setOrder("");
            alert("Order submited");
        } else {
            alert("RE-CHECK the Order and submit");
        }
    }

    return (
        <div>
            <form className="order-container" >
                <table>
                    <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>
                            <input
                            type="text"
                            className="order-textBox"
                            value={user_name}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="user Name" />
                        </th>
                        </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Email Address</th>
                        <th>
                            <input
                            type="text"
                            className="order-textBox"
                            value={request_email}
                            onChange={(e) => setRequestEmail(e.target.value)}
                                placeholder="Customer Email Address" />
                        </th>
                        </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Telephone Number </th>
                        <th>
                            <input
                            type="text"
                            className="order-textBox"
                            value={tpNumber}
                            onChange={(e) => setTP(e.target.value)}
                            placeholder="Telephone number" />
                        </th>
                        </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Select Vender</th>
                        <th>
                            <select className="order-textBox" onChange={(e) => setVender(e.target.value)}>
                                {venderList.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </th>
                        </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Order </th>
                        <th>
                            <input
                            type="text"
                            className="order-textBox"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            placeholder="order discription" />
                        </th>
                        </tr>
                    </thead>
                </table>
                <label> SUBMIT ORDER:  <input type="submit" className="order-button" onClick={(e) => onClickHandle(e)} /> </label>
            </form>
        </div>
    );
}

export default Order;