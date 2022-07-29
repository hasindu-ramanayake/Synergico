import React, { useState, useEffect} from 'react'
import { Table, Button, Label, TableFooter } from 'semantic-ui-react'
import { getVenderOrderList, changeOrderStats } from '../firebase'


function Requests() {//pass userId here

    const [token, setTokenID] = useState(
        JSON.parse(localStorage.getItem('token')) || "");
    const [dataArray, setDataArray] = useState([]);

    const stateNew = "new";
    const stateAccept = "accepted";
    const stateReject = "rejected";

    useEffect(async () => {
        await getData();
    }, []);

    const getData = async () => {
        setDataArray(await getVenderOrderList(token, stateNew));
        console.log(dataArray)
    }

    const OnclickButtonAccept = async (e,orderID) => {
        await changeOrderStats(token, orderID, stateAccept);
        await getData();
    }

    const OnclickButtonReject = async (e, orderID)  => {
        await changeOrderStats(token, orderID, stateReject);
        await getData();
    }

    const ButtonConditionals = ( Oid) => (
            < Button.Group >
                <Button onClick={(e) => OnclickButtonReject(e, Oid)}>Reject</Button>
                <Button.Or />
                <Button positive onClick={(e) => OnclickButtonAccept(e,Oid) }>Accept</Button>
            </Button.Group >
    )

    return (
        
        <Table singleLine>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Order ID</Table.HeaderCell>
                    <Table.HeaderCell>company</Table.HeaderCell>
                    <Table.HeaderCell>Customer Name</Table.HeaderCell>
                    <Table.HeaderCell>details</Table.HeaderCell>
                    <Table.HeaderCell>contact</Table.HeaderCell>
                    <Table.HeaderCell>timestamp</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {dataArray.map((item, index) => (
                    <Table.Row key={index} value={item}>
                        <Table.Cell>{item.id}</Table.Cell>
                        <Table.Cell>{item.company}</Table.Cell>
                        <Table.Cell>{item.customerName}</Table.Cell>
                        <Table.Cell>{item.details}</Table.Cell>
                        <Table.Cell>{item.contact}</Table.Cell>
                        <Table.Cell>{item.timestamp}</Table.Cell>
                        <Table.Cell>{ButtonConditionals(item.id)}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );


}


export default Requests;