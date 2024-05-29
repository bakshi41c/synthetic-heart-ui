import { Card, Col, Container, Dropdown, DropdownButton, Nav, Row, Stack } from "react-bootstrap";
import './plugin.css'
import React, { useEffect, useState } from 'react'
import JsonView from '@uiw/react-json-view';
import { Log } from "../logger";
import { ApiClient } from "../server";
import Loading from "../common/loading/loading";
import { GetIcon, GetStatusFromPassRatio, TestRunStatus } from "../common/status/status";
import "../common/status/status.css"
import { DEFAULT_PROMETHEUS_URL, GetPodNameFromPluginId, TitleCase } from "../common/common";
import { parse as yamlParse, stringify as yamlStringify } from 'yaml'
import dangerIcon from "../common/status/danger-icon.png"
import moment from "moment";

function PluginDetails({pluginId}: {pluginId : string}) {

    const queryParameters = new URLSearchParams(window.location.search)
    const prometheusUrl = queryParameters.get("promUrl")
   
    const server = queryParameters.get("server")

    const [activeTab, setTab] = useState(0)

    const [testRunData, setTestRunData] = useState<any>({})
    const [pluginHealth, setPluginHealth] = useState<any>({})
    const [lastFailedTestRunData, setLastFailedTestRunData] = useState<any>({})

    let tabs = ["Latest Test Result", "Config",  "Plugin Health", "Last Failed Test Result"]
    
    let apiClient = new ApiClient(server)


    useEffect(() => {

        apiClient.FetchTestRun(pluginId).then((d) => {d.json().then((data)=>{
            setTestRunData(data)
        }).catch((err) => {console.log(err)})}).catch((err) => {console.log(err)})

        apiClient.FetchPluginHealth(pluginId).then((d) => {d.json().then((data)=>{
            setPluginHealth(data)
        }).catch((err) => {console.log(err)})}).catch((err) => {console.log(err)})

        apiClient.FetchLastFailedTestRun(pluginId).then((d) => {d.json().then((data)=>{
            setLastFailedTestRunData(data)
        }).catch((err) => {console.log(err)})}).catch((err) => {console.log(err)})
      }, [])
    
    return (
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="#0">
                <Nav.Item key={0}>
                    <Nav.Link onClick={() => setTab(0)} href={"#" + 0}>{tabs[0]}</Nav.Link>
                </Nav.Item>
                <Nav.Item key={1}>
                    <Nav.Link onClick={() => setTab(1)} href={"#" + 1}>{tabs[1]}</Nav.Link>
                </Nav.Item>
                <Nav.Item key={2}>
                    <Nav.Link onClick={() => setTab(2)} href={"#" + 2}>{tabs[2]}
                    {pluginHealth && pluginHealth.status != "running" && <img className='plugin-health-danger-icon'src={dangerIcon}></img>  }
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item key={3}>
                    <Nav.Link onClick={() => setTab(3)} href={"#" + 3} disabled={!lastFailedTestRunData.TestRun}>{tabs[3]}</Nav.Link>
                </Nav.Item>
          </Nav>
        </Card.Header>
        {activeTab == 0 &&  testRunData.TestRun &&
            <Card.Body className="plugin-details-card-body">
                <TestResult res={testRunData} promUrlFn={getPrometheusLinkFn(prometheusUrl, testRunData.TestRun.testConfig.name, pluginId)}  logsUrl={apiClient.GetLogsUrl(pluginId)}></TestResult>
            </Card.Body>
        }
        {activeTab == 0 &&  !testRunData.TestRun &&
            <Container className="loading-container"><Loading></Loading><p className="loading-text">Waiting for Test to Run</p></Container>
        }
        {activeTab == 1 && pluginHealth.config &&
            <Card.Body className="plugin-details-card-body">
                <JsonView value={pluginHealth.config} collapsed={false} displayDataTypes={false} shortenTextAfterLength={0}/>
            </Card.Body>
        }
        {activeTab == 1 &&  !pluginHealth.config &&
             <Container className="loading-container"><Loading></Loading></Container>
        }
        {activeTab == 2 && pluginHealth.config &&
            <Card.Body className="plugin-details-card-body">
                <PluginHealth pluginHealth={pluginHealth}></PluginHealth>
            </Card.Body>
        }
        {activeTab == 2 &&  !pluginHealth.config &&
             <Container className="loading-container"><Loading></Loading></Container>
        }
        {activeTab == 3 && lastFailedTestRunData.TestRun &&
            <Card.Body className="plugin-details-card-body">
                <TestResult res={lastFailedTestRunData} promUrlFn={getPrometheusLinkFn(prometheusUrl, testRunData.TestRun.testConfig.name, pluginId)} logsUrl={apiClient.GetLasFailedLogsUrl(pluginId)} ></TestResult>
            </Card.Body>
        }
      </Card>
    )
}

function TestResult({res, promUrlFn, logsUrl}: {res : any, promUrlFn : (metricName : string) => string, logsUrl: string}) {
    Log.d("Marks: " + res.TestRun.testResult.marks)
    let testRunStatus = GetStatusFromPassRatio(res.TestRun.testResult.marks/res.TestRun.testResult.maxMarks)
    return (
        <Card.Body>
            <Container>
                <Row>
                    <Col>
                        <Stack direction="horizontal" gap={2}>
                        <div className="card-label p-2">Name:</div>
                        <div className="p-2">{res.TestRun.testConfig.displayName}</div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Description:</div>
                            <div className="p-2">{res.TestRun.testConfig.description}</div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Namespace:</div>
                            <div className="p-2">{res.TestRun.testConfig.namespace}</div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Node:</div>
                            <div className="p-2">{res.TestRun.testConfig.runtime.$nodeName}</div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Last Test:</div>
                            <div className="p-2">{ moment(res.TestRun.endTime).fromNow()}</div>
                        </Stack>
                    </Col>
                    <Col>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Test Run Id:</div>
                            <div className="p-2">{res.TestRun.id}</div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Repeat:</div>
                            <div className="p-2">{res.TestRun.testConfig.repeat}</div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">CRD:</div>
                            <div className="p-2"><a href={logsUrl}>Copy CRD</a></div>
                        </Stack>
                        <Stack direction="horizontal" gap={2}>
                            <div className="card-label p-2">Metrics:</div>
                            <div className="p-2">
                            <DropdownButton className="prometheus-btn red" title="Prometheus">
                                {GetPrometheusMetricList(res).map((metric : string) => (
                                    <Dropdown.Item target="_blank" href={promUrlFn(metric)}>{metric}</Dropdown.Item>
                                ))
                                }
                            </DropdownButton>
                            </div>
                        </Stack>
                    </Col>
                </Row>
                <Row>
                    <Stack direction="horizontal" gap={2}>
                        <div className="card-label p-2">Score:</div>
                        <div className={"p-2 score-text text-status-"+testRunStatus}>{res.TestRun.testResult.marks} / {res.TestRun.testResult.maxMarks}</div>
                        <div className={"p-2 score-text text-status-"+testRunStatus}>{"("+TitleCase(testRunStatus.toString())+")"}</div>
                    </Stack>
                    <br></br>
                    <Stack direction="horizontal" gap={2}>
                        <div className="card-label p-2"><a target="_blank" href={logsUrl}>Logs:</a></div>
                        <textarea className="terminal-style" rows={12} value={res.TestRun.details._log} readOnly={true}></textarea>
                    </Stack>
                    <Stack direction="horizontal" gap={2}>
                        <div className="card-label p-2">Raw Test Result:</div>
                        <JsonView value={res.TestRun} collapsed={true} displayDataTypes={false} shortenTextAfterLength={0}/>
                    </Stack>
                </Row>
            </Container>
        </Card.Body>
    )
}

function PluginHealth({pluginHealth}: {pluginHealth : any}) {
    
    return (
        <Card.Body>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Status:</div>
                <div className={"p-2 text-status-" + (pluginHealth.status == "running" ? "pass" : "fail")}>{TitleCase(pluginHealth.status)}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Logs:</div>
                <textarea className={"terminal-style" + (pluginHealth.status == "running" ? "" : "-error")} rows={5} value={pluginHealth.statusMsg} readOnly={true}></textarea>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">RecentRestarts:</div>
                <div className="p-2">{pluginHealth.restarts}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">RestartBackOff:</div>
                <div className="p-2">{pluginHealth.restartBackoff}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">TotalRestarts:</div>
                <div className="p-2">{pluginHealth.totalRestarts}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Running Since:</div>
                <div className="p-2">{pluginHealth == "running" ? moment(pluginHealth.runningSince).fromNow() : "Not running" }</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Raw JSON:</div>
                <JsonView className="darkTheme" value={pluginHealth} collapsed={true} displayDataTypes={false}  />
            </Stack>
        </Card.Body>
    )
}

function GetPrometheusMetricList(res : any) {
    let metricList : string[] = []
    // metrics emitted by all tests
    metricList.push("marks_total")
    metricList.push("max_marks_total")
    metricList.push("runtime_ns")
    if (res.TestRun && 
        res.TestRun.testResult && 
        res.TestRun.testResult.details && 
        res.TestRun.testResult.details._prometheus) {
        
        let s = new Set()

        let metrics = yamlParse(res.TestRun.testResult.details._prometheus)
        metrics.gauges.forEach((gauge :any) => {
            s.add(gauge.name)
        });
        let a: any = Array.from(s)
        metricList = metricList.concat(a)
    }
    return metricList;

}

function getPrometheusLinkFn(prometheusUrl :(string | null), testName :string, pluginId :string) : (metric: string)=>string{
    let podName = GetPodNameFromPluginId(pluginId)
    if (prometheusUrl == null) {
        prometheusUrl = DEFAULT_PROMETHEUS_URL
    } else {
        prometheusUrl = prometheusUrl.replace(/\/$/, ""); // trim trailing /
    }

    return (metricName: string) => {return prometheusUrl + '/graph?g0.expr=syntheticheart_'+metricName+'{test_name%3D"'+testName+'"%2C pod%3D"'+podName+'"}&g0.tab=0'}
}


export default PluginDetails