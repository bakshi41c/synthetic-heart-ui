import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Chart } from "react-google-charts";
import Guage from '../common/guage';

 // Graph
  // Graph 1: pie chart of statuses
  // Graph 2: pie chart of Tests/namespace
  // Graph 3: Total Agents 
  // Graph 4: Total tests
  // fetch 
  // start fetch data loop


export const testStatusData = [
    ["Status", "Count"],
    ["Passing", 3],
    ["Partial Pass", 3],
    ["Failing", 5],
    ["Unkown", 12],
];

export const testNamespaceData = [
    ["Namespace", "Count"],
    ["synthetic-heart", 3],
    ["synthetic-test-2", 3],
    ["app-a", 5],
];

export const testStatusPieOptions = {
    title: "All Test Status",
    colors: ['#38b24b', '#f2b927', '#ed5d28', 'gray'],
    legend: {position: 'none'}
};

export const testNamespacePieOptions = {
    title: "Test Namespaces",
    colors: ['#AD5D4E', '#E15A97', '#048BA8', '#002500', '#84AFE6', '#C17C74', '#22333B'],
};


export default function ChartPanel({agents, testRunStatuses} : {agents: any, testRunStatuses: any}) {
    
    return (
        <Container>
            <Row>
                <Col sm={4}>
                <Chart
                    chartType="PieChart"
                    data={testNamespaceData}
                    options={testNamespacePieOptions}
                    width={"100%"}
                    height={"225px"}
                    />
                </Col>
                <Col sm={4}>
                <Chart
                    chartType="PieChart"
                    data={testStatusData}
                    options={testStatusPieOptions}
                    width={"100%"}
                    height={"225px"}
                    />
                </Col>
                <Col sm={2}>
                <Guage title='Total Tests' metric={testRunStatuses.length}></Guage>
                </Col>
                <Col sm={2}>
                <Guage title='Total Agents' metric={Object.keys(agents).length}></Guage>
                </Col>
            </Row>
        </Container>
    )
}
