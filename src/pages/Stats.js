import React, {useState,useEffect } from 'react'
import { Statistic, Card } from 'semantic-ui-react'
import {
    getstatsCompany
} from '../firebase'

function StatisticData(props) {
    const [token, setTokenID] = useState(
        JSON.parse(localStorage.getItem('token')) || "");
    const [dataArray, setDataArray] = useState([]);

    useEffect(async () => {
        setDataArray(await getstatsCompany(token));
        console.log(dataArray)
    }, []);


    return (
        <Card.Group>
            {dataArray.map((item, index) => (
                <Card key={index} value={item}>
                    <Card.Content>
                        <Card.Header>{item.vendor}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two'>
                            <Statistic.Group>
                                <Statistic color='yellow'>
                                    <Statistic.Label>New</Statistic.Label>
                                    <Statistic.Value>{item.new}</Statistic.Value>
                                </Statistic>
                                <Statistic color='green'>
                                    <Statistic.Label>Accepted</Statistic.Label>
                                    <Statistic.Value>{item.accepted}</Statistic.Value>
                                </Statistic>
                                <Statistic color='red'>
                                    <Statistic.Label>Rejected</Statistic.Label>
                                    <Statistic.Value>{item.rejected}</Statistic.Value>
                                </Statistic>
                        </Statistic.Group>
                    </div>
                </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
}

export default StatisticData;