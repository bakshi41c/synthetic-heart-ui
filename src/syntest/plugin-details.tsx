import { Card, Col, Container, Dropdown, DropdownButton, Nav, Row, Stack } from "react-bootstrap";
import './plugin.css'
import React, { useEffect, useState } from 'react'
import JsonView from '@uiw/react-json-view';
import { Log } from "../logger";
import { ApiClient } from "../server";
import Loading from "../common/loading/loading";
import { GetStatusFromPassRatio, TestRunStatus } from "../common/status/status";
import "../common/status/status.css"
import { DEFAULT_PROMETHEUS_URL, GetPodNameFromPluginId, TitleCase } from "../common/common";
import { parse as yamlParse, stringify as yamlStringify } from 'yaml'

// let dummyPluginDetails = {"status":"running","statusMsg":"","config":{"name":"curl-amazon","version":"44c73ca89ea92ffffc4d2bf454a5f89e","pluginName":"curl","displayName":"Curl Metrics (CI FLS)","description":"Test to get curl metrics for CI FLS","namespace":"synthetic-test-2","repeat":"2m","podLabelSelector":{"$agentId":"synheart-agent-ch9qn/synthetic-heart"},"timeouts":{"run":"1m"},"config":"url: https://www.amazon.com\noutputOptions:\n  - name: time_namelookup\n    metric: true\n  - name: time_appconnect\n    metric: true\n  - name: time_total\n    metric: true\n  - name: remote_ip\n    label: true\n","runtime":{"$agentId":"synheart-agent-ch9qn/synthetic-heart","$agentNamespace":"synthetic-heart","$nodeName":"k8s-play-control-plane","$podName":"synheart-agent-ch9qn","app.kubernetes.io/instance":"synthetic-heart","app.kubernetes.io/name":"synthetic-heart","controller-revision-hash":"58cbc99755","name":"synheart-agent","pod-template-generation":"12","synheart.infra.webex.com/discover":"true"}},"restarts":0,"restartBackOff":"","totalRestarts":0,"runningSince":"2024-05-23T23:20:38.075360503Z","lastUpdated":"2024-05-23T23:20:38.075360583Z"}
// let dummyTestRunDetails = {"TestRun":{"id":"53dc5773-74f8-4b7d-a30d-cf25f974e76a","agentId":"synheart-agent-ch9qn/synthetic-heart","startTime":"2024-05-24T00:14:38.080414659Z","endTime":"2024-05-24T00:14:38.363539468Z","testConfig":{"name":"curl-amazon","version":"44c73ca89ea92ffffc4d2bf454a5f89e","pluginName":"curl","displayName":"Curl Metrics (CI FLS)","description":"Test to get curl metrics for CI FLS","namespace":"synthetic-test-2","repeat":"2m","podLabelSelector":{"$agentId":"synheart-agent-ch9qn/synthetic-heart"},"timeouts":{"run":"1m"},"config":"url: https://www.amazon.com\noutputOptions:\n  - name: time_namelookup\n    metric: true\n  - name: time_appconnect\n    metric: true\n  - name: time_total\n    metric: true\n  - name: remote_ip\n    label: true\n","runtime":{"$agentId":"synheart-agent-ch9qn/synthetic-heart","$agentNamespace":"synthetic-heart","$nodeName":"k8s-play-control-plane","$podName":"synheart-agent-ch9qn","app.kubernetes.io/instance":"synthetic-heart","app.kubernetes.io/name":"synthetic-heart","controller-revision-hash":"58cbc99755","name":"synheart-agent","pod-template-generation":"12","synheart.infra.webex.com/discover":"true"}},"trigger":{"triggerType":"timer"},"testResult":{"marks":1,"maxMarks":1,"details":{"_prometheus":"gauges:\n- name: curl_time_namelookup\n  help: Curl metric for time_namelookup\n  value: 0.008087\n  labels:\n    remote_ip: 13.224.242.232\n    url: https://www.amazon.com\n- name: curl_time_appconnect\n  help: Curl metric for time_appconnect\n  value: 0.184998\n  labels:\n    remote_ip: 13.224.242.232\n    url: https://www.amazon.com\n- name: curl_time_total\n  help: Curl metric for time_total\n  value: 0.277973\n  labels:\n    remote_ip: 13.224.242.232\n    url: https://www.amazon.com\n"}},"details":{"_log":"{\"@level\":\"debug\",\"@message\":\"plugin address\",\"@timestamp\":\"2024-05-24T00:14:38.079585Z\",\"address\":\"/tmp/plugin1815819508\",\"network\":\"unix\"}\n2024/05/24 00:14:38 parsing config\n2024/05/24 00:14:38 config: \u0026{https://www.amazon.com [{time_namelookup true false} {time_appconnect true false} {time_total true false} {remote_ip false true}]}\n2024/05/24 00:14:38 --- START OF TEST --- \n2024/05/24 00:14:38 [curl -v --output /dev/null --silent --write-out '%{time_namelookup} %{time_appconnect} %{time_total} %{remote_ip} ' https://www.amazon.com]\n2024/05/24 00:14:38 * Host www.amazon.com:443 was resolved.\n* IPv6: 2600:9000:21b3:7000:7:49a5:5fd3:b641, 2600:9000:21b3:8e00:7:49a5:5fd3:b641, 2600:9000:21b3:f600:7:49a5:5fd3:b641, 2600:9000:21b3:8200:7:49a5:5fd3:b641, 2600:9000:21b3:5800:7:49a5:5fd3:b641, 2600:9000:21b3:2c00:7:49a5:5fd3:b641, 2600:9000:21b3:ca00:7:49a5:5fd3:b641, 2600:9000:21b3:f200:7:49a5:5fd3:b641\n* IPv4: 13.224.242.232\n*   Trying 13.224.242.232:443...\n* Connected to www.amazon.com (13.224.242.232) port 443\n* ALPN: curl offers h2,http/1.1\n} [5 bytes data]\n* TLSv1.3 (OUT), TLS handshake, Client hello (1):\n} [512 bytes data]\n*  CAfile: /etc/ssl/certs/ca-certificates.crt\n*  CApath: /etc/ssl/certs\n{ [5 bytes data]\n* TLSv1.3 (IN), TLS handshake, Server hello (2):\n{ [122 bytes data]\n* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):\n{ [19 bytes data]\n* TLSv1.3 (IN), TLS handshake, Certificate (11):\n{ [4525 bytes data]\n* TLSv1.3 (IN), TLS handshake, CERT verify (15):\n{ [264 bytes data]\n* TLSv1.3 (IN), TLS handshake, Finished (20):\n{ [36 bytes data]\n* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):\n} [1 bytes data]\n* TLSv1.3 (OUT), TLS handshake, Finished (20):\n} [36 bytes data]\n* SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256 / X25519 / RSASSA-PSS\n* ALPN: server accepted h2\n* Server certificate:\n*  subject: CN=www.amazon.com\n*  start date: Nov 28 00:00:00 2023 GMT\n*  expire date: Nov 11 23:59:59 2024 GMT\n*  subjectAltName: host \"www.amazon.com\" matched cert's \"www.amazon.com\"\n*  issuer: C=US; O=DigiCert Inc; CN=DigiCert Global CA G2\n*  SSL certificate verify ok.\n*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption\n*   Certificate level 1: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption\n*   Certificate level 2: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption\n} [5 bytes data]\n* using HTTP/2\n* [HTTP/2] [1] OPENED stream for https://www.amazon.com/\n* [HTTP/2] [1] [:method: GET]\n* [HTTP/2] [1] [:scheme: https]\n* [HTTP/2] [1] [:authority: www.amazon.com]\n* [HTTP/2] [1] [:path: /]\n* [HTTP/2] [1] [user-agent: curl/8.5.0]\n* [HTTP/2] [1] [accept: */*]\n} [5 bytes data]\n\u003e GET / HTTP/2\n\u003e Host: www.amazon.com\n\u003e User-Agent: curl/8.5.0\n\u003e Accept: */*\n\u003e \n{ [5 bytes data]\n* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):\n{ [124 bytes data]\n\u003c HTTP/2 503 \n\u003c content-type: text/html\n\u003c server: Server\n\u003c date: Fri, 24 May 2024 00:14:38 GMT\n\u003c x-amz-rid: CV387PQQVKG02YHMFPE1\n\u003c vary: Content-Type,Accept-Encoding,User-Agent\n\u003c last-modified: Wed, 15 May 2024 14:44:50 GMT\n\u003c etag: \"a6f-6187f291ddc80\"\n\u003c accept-ranges: bytes\n\u003c strict-transport-security: max-age=47474747; includeSubDomains; preload\n\u003c x-cache: Error from cloudfront\n\u003c via: 1.1 20340eb7909bfa098c771e4c93be880a.cloudfront.net (CloudFront)\n\u003c x-amz-cf-pop: LHR62-C3\n\u003c alt-svc: h3=\":443\"; ma=86400\n\u003c x-amz-cf-id: ZVw74wmsZCqxbIoAGZyq_rH3i2CTK5CWM1b4AJxNNwGK8bpKjwhQIw==\n\u003c \n{ [2671 bytes data]\n* Connection #0 to host www.amazon.com left intact\n'0.008087 0.184998 0.277973 13.224.242.232 '\n2024/05/24 00:14:38 Parsing line: 0.008087 0.184998 0.277973 13.224.242.232 \n2024/05/24 00:14:38 adding metric time_namelookup\n2024/05/24 00:14:38 adding metric time_appconnect\n2024/05/24 00:14:38 adding metric time_total\n2024/05/24 00:14:38 --- END OF TEST --- \n"}},"RawConfig":"plugin: curl\nnode: $\ndisplayName: Curl Metrics (CI FLS)\ndescription: Test to get curl metrics for CI FLS\nrepeat: 2m\ntimeouts:\n    init: \"\"\n    run: 1m\n    finish: \"\"\nconfig: |\n    url: https://www.amazon.com\n    outputOptions:\n      - name: time_namelookup\n        metric: true\n      - name: time_appconnect\n        metric: true\n      - name: time_total\n        metric: true\n      - name: remote_ip\n        label: true\n"}

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
                    <Nav.Link onClick={() => setTab(2)} href={"#" + 2}>{pluginHealth && pluginHealth.status == "running" ? tabs[2] : tabs[2] + "⚠️" }</Nav.Link>
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
                            <div className="p-2">Todo: 2m ago</div>
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
                <div className="p-2">{pluginHealth.runningSince}</div>
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