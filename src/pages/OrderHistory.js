import React, { Component, useEffect, useState } from 'react'
import { Table } from 'semantic-ui-react'
import { getOrderHistory } from '../firebase'

function OrderHistory() {

    const [token, setTokenID] = useState(JSON.parse(localStorage.getItem('token')) || "");
    const [orderList, setOrderList] = useState([]);

    useEffect(async () => {
        setOrderList(await getOrderHistory(token));
        
    }, []);

    return (
        <Table singleLine>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Request Name</Table.HeaderCell>
                    <Table.HeaderCell>Details</Table.HeaderCell>
                    <Table.HeaderCell>Vendor</Table.HeaderCell>
                    <Table.HeaderCell>Request Time</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {orderList.map((item,index) => (
                    <Table.Row key={index}>
                        <Table.Cell>{item.customerName}</Table.Cell>
                        <Table.Cell>{item.details}</Table.Cell>
                        <Table.Cell>{item.vendor}</Table.Cell>
                        <Table.Cell>{item.timestamp}</Table.Cell>
                        <Table.Cell>{item.status}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default OrderHistory;