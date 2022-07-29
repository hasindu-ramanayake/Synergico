import React from "react";
import { Tab } from "semantic-ui-react";
import Requests from "./Requests";
import OrderHistory from "./OrderHistory";


const panes = [
    {
        menuItem: 'Orders',
        render: () => <Tab.Pane attached={false}>
            <Requests />
        </Tab.Pane>,
    },
    {
        menuItem: 'Servise History',
        render: () => <Tab.Pane attached={false}>
            <OrderHistory />
        </Tab.Pane>,
    }

]

const NavBarVendor = () => <Tab menu={{ pointing: true }} panes={panes} />

export default NavBarVendor;
