import React from "react";
import { Tab } from "semantic-ui-react";
import Order from "./Order";
import { CardGroupsVendorAdd, CardGroupsUserRemove, CardGroupsVendorSelected} from "./CardGroups"
import OrderHistory from "./OrderHistory";
import StatisticData from "./Stats.js"


const panes = [
    {
        menuItem: 'Staticstic',
        render: () => <Tab.Pane attached={false}>
            <StatisticData />
        </Tab.Pane>,
    },
    {
        menuItem: 'Order History',
        render: () => <Tab.Pane attached={false}>
            <OrderHistory />
        </Tab.Pane>,
    },
    {
        menuItem: 'User Accounts',
        render: () => <Tab.Pane attached={false}>
            <CardGroupsUserRemove />
        </Tab.Pane>,
    },
    {
        menuItem: 'Vendors',
        render: () => <Tab.Pane attached={false}>
            <CardGroupsVendorSelected />
        </Tab.Pane>,
    },
    {
        menuItem: 'Add Vendor',
        render: () => <Tab.Pane attached={false}>
            <CardGroupsVendorAdd />
        </Tab.Pane>,
    }
    
]

const NavBarAdmin = () => <Tab menu={{ pointing: true }} panes={panes} />

export default NavBarAdmin
