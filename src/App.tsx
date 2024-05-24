import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import Sidebar from './sidebar/sidebar';
import SyntestTable from './syntest/syntest-table';
import Header from './header/header';
import ChartPanel from './chart/chart';
import { Log } from './logger';
import AgentTable from './agent/agent-table';
import { ApiClient } from './common/server';
import { config } from 'process';

let DummySyntestConfigs = {"curl-amazon/synthetic-test-2":{"configSummary":{"configId":"curl-amazon/synthetic-test-2","version":"42d1551902eac2210edce0b20764ffa0","displayName":"Curl Metrics (CI FLS)","description":"Test to get curl metrics for CI FLS","namespace":"synthetic-test-2","plugin":"curl","repeat":"2m"},"plugins":{"curl-amazon/synthetic-test-2/synheart-agent-zzrtk/synthetic-heart":{"status":"1","health":{}}}},"dns-check-cisco/synthetic-test-2":{"configSummary":{"configId":"dns-check-cisco/synthetic-test-2","version":"2789afe2618cfa2e44aa8e2876d82dc3","displayName":"DNS Test (Cisco)","description":"Test to check DNS resolution of cisco.com","namespace":"synthetic-test-2","plugin":"dns","repeat":"3m"},"plugins":{"dns-check-cisco/synthetic-test-2/synheart-agent-698wm/synthetic-heart":{"status":"2","health":{}},"dns-check-cisco/synthetic-test-2/synheart-agent-zzrtk/synthetic-heart":{"status":"2","health":{}}}},"http-google-check/synthetic-test-2":{"configSummary":{"configId":"http-google-check/synthetic-test-2","version":"7f81863a03e3cc392d34fdc36907f7fd","displayName":"HTTP Ping Google","description":"HTTP request to Google","namespace":"synthetic-test-2","plugin":"httpPing","repeat":"2m"},"plugins":{"http-google-check/synthetic-test-2/synheart-agent-698wm/synthetic-heart":{"status":"3","health":{}},"http-google-check/synthetic-test-2/synheart-agent-zzrtk/synthetic-heart":{"status":"3","health":{}}}}}
// let DummyAgents = {"synheart-agent-698wm/synthetic-heart":{"syntests":["http-google-check/synthetic-test-2","dns-check-cisco/synthetic-test-2"],"statusTime":"2024-05-20T20:47:00.6179427Z","agentConfig":{"runTimeInfo":{"nodeName":"k8s-play-worker","podName":"synheart-agent-698wm","podLabels":{"app.kubernetes.io/instance":"synthetic-heart","app.kubernetes.io/name":"synthetic-heart","controller-revision-hash":"6cf4d7b994","name":"synheart-agent","pod-template-generation":"8","synheart.infra.webex.com/discover":"true"},"agentNamespace":"synthetic-heart"},"watchOwnNamespaceOnly":false,"labelFileLocation":"/etc/podinfo/labels","syncFrequency":30000000000,"gracePeriod":3000000000,"prometheusConfig":{"ServerAddress":":2112","Push":false,"PrometheusPushUrl":"","Labels":null},"storeConfig":{"Type":"redis","BufferSize":1000,"Address":"redis.synthetic-heart.svc:6379","ExportRate":15000000000},"printPluginLogs":"onFail","enabledPlugins":["curl","dns","httpPing","netDial","ping","selfTestRx"],"debugMode":false}},"synheart-agent-zzrtk/synthetic-heart":{"syntests":["http-google-check/synthetic-test-2","dns-check-cisco/synthetic-test-2","curl-amazon/synthetic-test-2"],"statusTime":"2024-05-20T20:47:01.604919265Z","agentConfig":{"runTimeInfo":{"nodeName":"k8s-play-control-plane","podName":"synheart-agent-zzrtk","podLabels":{"app.kubernetes.io/instance":"synthetic-heart","app.kubernetes.io/name":"synthetic-heart","controller-revision-hash":"6cf4d7b994","name":"synheart-agent","pod-template-generation":"8","synheart.infra.webex.com/discover":"true"},"agentNamespace":"synthetic-heart"},"watchOwnNamespaceOnly":false,"labelFileLocation":"/etc/podinfo/labels","syncFrequency":30000000000,"gracePeriod":3000000000,"prometheusConfig":{"ServerAddress":":2112","Push":false,"PrometheusPushUrl":"","Labels":null},"storeConfig":{"Type":"redis","BufferSize":1000,"Address":"redis.synthetic-heart.svc:6379","ExportRate":15000000000},"printPluginLogs":"onFail","enabledPlugins":["curl","dns","httpPing","netDial","ping","selfTestRx"],"debugMode":false}}}



function App() {

  const queryParameters = new URLSearchParams(window.location.search)
  const cluster = queryParameters.get("cluster")
  const prometheusUrl = queryParameters.get("prometheusUrl")
  const server = queryParameters.get("server")

  Log.i(cluster)
  Log.i(prometheusUrl)
  Log.i(server)

  // get test configs
  // get test agents
  // get plugin statuses
  // get testrun statuses

  // configs = 
//   configId: {
//     configSummary: {

//     }
//     plugins : [
//           pluginId : {
//             status: 0
//             health: {}
//              ...
//           }
//     ]
//   }
// }
  


  let apiClient = new ApiClient(server)

  const [agents, setAgents] = useState({});
  const [testConfigs, setTestConfig] = useState({});

  useEffect(() => {
    apiClient.FetchAgents().then(data => {setAgents(data)}).catch(err => {Log.e(err)})
    let configs : any = {} 
    apiClient.FetchTestConfigs().then(configSummaries => {
      Object.keys(configSummaries).forEach(configId => {
        configs[configId]["configSummary"] = configSummaries[configId]
      });
    }).catch(err => {Log.e(err)})
  }, [])


  const [activeTab, setTab] = useState(0)
  let tabs = ["Tests", "Agents"]
  return (
    <div className="App">
      <Header></Header>
      <Container>
        <Row>
          <ChartPanel agents={agents} testRunStatuses={Object.keys(DummySyntestConfigs)}></ChartPanel>
        </Row>

        <Row>
          <Col md={3} className="align-self-start">
            <Sidebar disabled={activeTab == 1}></Sidebar>
          </Col>

          <Col md={9}>
            <Nav className='mainTab' variant="tabs" defaultActiveKey="#0">
                  <Nav.Item key={0}>
                      <Nav.Link onClick={() => setTab(0)} href={"#" + 0}>{tabs[0] + " ("+Object.keys(DummySyntestConfigs).length +")"}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item key={1}>
                      <Nav.Link onClick={() => setTab(1)} href={"#" + 1}>{tabs[1]+ " ("+Object.keys(agents).length +")"}</Nav.Link>
                  </Nav.Item>
            </Nav>
            {activeTab == 0 &&
              <SyntestTable configs={DummySyntestConfigs}></SyntestTable>
            }
            {activeTab == 1 &&
              <AgentTable agents={agents} ></AgentTable>
            }
          </Col>

        </Row>
      </Container>
    </div>
  );
}

export default App;
