import React, { Component, useEffect, useState } from 'react'
import { Button, Card } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {
    getVenderDataList,
    getCompanyUserList,
    getVenderListFormCompany,
    removeVendorFromCompanyList,
    addVendorToCompanyList,
    removeUserFromCompanyList
} from '../firebase'


function CardGroupsVendorAdd() {

    const [token, setTokenID] = useState(
        JSON.parse(localStorage.getItem('token')) || "");
    const [dataArray, setDataArray] = useState([]);

    useEffect(async () => {
        setDataArray(await getVenderDataList(token));
        console.log(dataArray)
    }, []);

    const onAddVendor = async (e, userName) => {
        console.log(userName);
        await addVendorToCompanyList(token, userName);
        setDataArray(await getVenderListFormCompany(token));
    }


    return (
        <Card.Group>
            {dataArray.map((item, index) => (
                <Card key={index} value={item}>
                    <Card.Content>
                    <Card.Header>{item}</Card.Header>
                    <Card.Meta>{item}</Card.Meta>
                    <Card.Description>{item}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='green' onClick={(e) => onAddVendor(e, item) } > Add </Button>
                        </div>
                    </Card.Content>
                </Card>
            ))}    
        </Card.Group>
    );
};

function CardGroupsVendorSelected() {

    const [token, setTokenID] = useState(
        JSON.parse(localStorage.getItem('token')) || "");
    const [dataArray, setDataArray] = useState([]);

    useEffect(async () => {
        setDataArray(await getVenderListFormCompany(token));
        console.log(dataArray)
    }, []);


    const onRemoveVendor = async (e, userName) => {
        console.log(userName);
        await removeVendorFromCompanyList(token, userName);
        setDataArray(await getVenderListFormCompany(token));
    }

    return (
        <Card.Group>
            {dataArray.map((item, index) => (
                <Card key={index} value={item}>
                    <Card.Content>
                        <Card.Header>{item}</Card.Header>
                        <Card.Meta>{item}</Card.Meta>
                        <Card.Description>{item}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='green' onClick={(e) => onRemoveVendor(e,item) }> remove </Button>
                        </div>
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
};



function CardGroupsUserRemove() {

    const [token, setTokenID] = useState(
        JSON.parse(localStorage.getItem('token')) || "");
    const [dataArray, setDataArray] = useState([]);

    useEffect(async () => {
        setDataArray(await getCompanyUserList(token));
        console.log(dataArray)
    }, []);


    const onRemoveUser = async (e, userName) => {
        console.log(userName);
        await removeUserFromCompanyList(token, userName);
        setDataArray(await getCompanyUserList(token));
    }

    return (
        <Card.Group>
            {dataArray.map((item, index) => (
                <Card key={index} value={item}>
                    <Card.Content>
                        <Card.Header>{item}</Card.Header>
                        <Card.Meta>{item}</Card.Meta>
                        <Card.Description>{item}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='red' onClick={(e) => onRemoveUser(e, item)} > remove </Button>
                        </div>
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
};

export {
    CardGroupsVendorAdd,
    CardGroupsUserRemove,
    CardGroupsVendorSelected
};