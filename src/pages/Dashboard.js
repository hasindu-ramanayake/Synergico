import React, { useEffect, useState } from "react";
/*import { useAuthState } from "react-firebase-hooks/auth";*/
import "./Dashboard.css";
import Order from "./Order";
import OrderHistory from "./OrderHistory";
import NavBarComp from "./NavBarDash";



function Dashboard() {    
    return (
        <div className="dashboard">
            <Order />
            <OrderHistory />
        </div>
    );
}
export default Dashboard;