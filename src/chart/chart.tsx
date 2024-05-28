import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Chart } from "react-google-charts";
import Guage from '../common/guage/guage';
import { TestRunStatus } from '../common/status/status';
import { Log } from '../logger';

 // Graph
  // Graph 1: pie chart of statuses
  // Graph 2: pie chart of Tests/namespace
  // Graph 3: Total Agents 
  // Graph 4: Total tests
  // fetch 
  // start fetch data loop

export const testStatusPieOptions = {
    title: "All Test Status",
    colors: ['gray', '#ed5d28', '#f2b927', '#38b24b'],
    legend: {position: 'none'}
};

export const testNamespacePieOptions = {
    title: "Test Namespaces",
    colors: ['#AD5D4E', '#E15A97', '#048BA8', '#002500', '#84AFE6', '#C17C74', '#22333B'],
};


export default function ChartPanel({agents, configs} : {agents: any, configs: any}) {
    
    let testNamespaces: any = {}
    let testStatuses: any = {}
    let nsData : (string | number) [][] = []
    let statusData : (string | number) [][] = [
        ["Status", "Count"],
        ["Unkown", 0],
        ["Failing", 0],
        ["Partial Pass", 0],
        ["Passing", 0],
    ]

    if (Object.keys(configs).length > 0) {
        Object.keys(configs).map((configId) => {
            let testNs = configs[configId].configSummary.namespace
            if (testNamespaces[testNs]) {
                testNamespaces[testNs] = testNamespaces[testNs]+1
            } else {
                testNamespaces[testNs] = 1
            }
            
            Object.keys(configs[configId].plugins).forEach((pluginId) => {
                let testRunStatus = configs[configId].plugins[pluginId].testRunStatus
                if (testStatuses[testRunStatus]) {
                    testStatuses[testRunStatus] = testStatuses[testRunStatus]+1
                } else {
                    testStatuses[testRunStatus] = 1
                }
            })
        })
        
        
        nsData = [
            ["Namespace", "Count"],
        ]
        Object.keys(testNamespaces).forEach((ns : any)  => {
            nsData.push([ns, testNamespaces[ns]])
        });
        
        Object.keys(testStatuses).forEach(status => {
            let arrIndex = 1
            switch (status) {
                case TestRunStatus.Fail:
                    arrIndex = 2
                    break;
                case TestRunStatus.Warn:
                    arrIndex = 3
                    break;
                case TestRunStatus.Pass:
                    arrIndex = 4
                    break;
                case TestRunStatus.Unknown:
                    arrIndex = 1
                    break;
            }
            statusData[arrIndex][1] = testStatuses[status]
        });
    }


    return (
        <Container>
            <Row>
                <Col sm={4}>
                <Chart
                    chartType="PieChart"
                    data={nsData}
                    options={testNamespacePieOptions}
                    width={"100%"}
                    height={"225px"}
                    />
                </Col>
                <Col sm={4}>
                <Chart
                    chartType="PieChart"
                    data={statusData}
                    options={testStatusPieOptions}
                    width={"100%"}
                    height={"225px"}
                    />
                </Col>
                <Col sm={2}>
                <Guage title='Total Tests' metric={Object.keys(configs).length}></Guage>
                </Col>
                <Col sm={2}>
                <Guage title='Total Agents' metric={Object.keys(agents).length}></Guage>
                </Col>
            </Row>
        </Container>
    )
}
