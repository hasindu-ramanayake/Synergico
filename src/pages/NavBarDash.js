import React from "react";
import { Tab } from "semantic-ui-react";
import Order from "./Order";
import OrderHistory from "./OrderHistory";

const panes = [
    { menuItem: 'Order NOW', pane: <Order /> },
    { menuItem: 'Order History', pane: <OrderHistory />}
]

const NavBarComp = () => <Tab panes={panes} renderActiveOnly={false} />

export default NavBarComp
