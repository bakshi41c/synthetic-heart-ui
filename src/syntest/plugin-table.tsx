import { config } from 'process'
import React, { useEffect } from 'react'
import { Card, Col, Container, Row, Stack, Table } from 'react-bootstrap'
import { useState } from 'react';
import Status, { TestRunStatus } from '../common/status/status';
import LoadingText from '../common/loading/loading';
import PluginDetails from './plugin-details';
import { GetAgentIdFromPluginId, GetConfigIdFromPluginId, GetItemRowClasses, GetPodNameFromPluginId, GetPodNamespaceFromPluginId  } from '../common/common';
import expandIcon from './assets/expand_icon.png'
import './plugin.css';
import '../common/status/status.css';
import { ApiClient } from '../server';
import Loading from '../common/loading/loading';
import JsonView from '@uiw/react-json-view';
import moment from 'moment';

function PluginTable({configId, plugins, agents} : {configId: string, plugins:any, agents:any}) {
  
  // Fetch the test config data from server
  const queryParameters = new URLSearchParams(window.location.search)
  const server = queryParameters.get("server")
  const [testConfigData, setTestConfigData] = useState<any>({})  
  let apiClient = new ApiClient(server)
  useEffect(() => {
    apiClient.FetchTestConfig(configId).then((d) => {d.json().then((data)=>{
        setTestConfigData(data)
        console.dir(data)
    }).catch((err) => {console.log(err)})}).catch((err) => {console.log(err)})
  }, [])


  // create frou tables for different states the plugins can be in so its easy for the user

  let failedStatusPlugins : any = {}
  let warningStatusPlugins : any = {}
  let passingStatusPlugins : any = {}
  let unknownStatusPlugins : any = {}

  
  Object.keys(plugins).forEach(pluginId => {
    switch(plugins[pluginId].testRunStatus) {
      case TestRunStatus.Pass:
          passingStatusPlugins[pluginId] = plugins[pluginId]
          break
      case TestRunStatus.Warn:
          warningStatusPlugins[pluginId] = plugins[pluginId]
          break
      case TestRunStatus.Fail:
          failedStatusPlugins[pluginId] = plugins[pluginId]
          break
      default:
          unknownStatusPlugins[pluginId] = plugins[pluginId]
    }
  })
  
  let tableHeaders : string [] = ['', '  ', 'Pod Name', 'Pod Namespace', 'Node', 'Plugin Status'];

  return (
    <>
    <Card>
    <Card.Body>
    <h5>{testConfigData.testConfig && testConfigData.testConfig.displayName + " (" +testConfigData.testConfig.name +")"}</h5>
    <hr></hr>


    <Container>
      {!testConfigData.testConfig &&
        <Container className="loading-container"><Loading></Loading><p className="loading-text">Waiting for Test to Run</p></Container>
      }
      {testConfigData.testConfig &&
        <Row>
          <Col>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Description:</div>
                  <div className="p-2">{testConfigData.testConfig.description}</div>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Namespace:</div>
                  <div className="p-2">{testConfigData.testConfig.namespace}</div>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Plugin:</div>
                  <div className="p-2">{testConfigData.testConfig.pluginName}</div>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Labels:</div>
                  <JsonView value={testConfigData.testConfig.labels} collapsed={true} displayDataTypes={false} shortenTextAfterLength={0}/>
              </Stack>
          </Col>
          <Col>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Repeats Every:</div>
                  <div className="p-2">{testConfigData.testConfig.repeat}</div>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">CRD:</div>
                  <div className="p-2"><a href=''>Copy CRD</a></div>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Node Selector:</div>
                  <div className="p-2">{testConfigData.testConfig.nodeSelector}</div>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                  <div className="card-label p-2">Pod Label Selector:</div>
                  <JsonView value={testConfigData.testConfig.podLabelSelector} collapsed={true} displayDataTypes={false} shortenTextAfterLength={0}/>
              </Stack>
          </Col>
        </Row>
      }
      {testConfigData.configStatus && !testConfigData.configStatus.deployed &&
        <>
        <hr></hr>
        <h6 className='text-error'>NOT running, status from controller:</h6>
        <textarea className="terminal-style-error" rows={5} value={testConfigData.configStatus.message} readOnly={true}></textarea>
        <p>Last Update: {moment(testConfigData.configStatus.timestamp).fromNow()}</p>
        </>
      }
    </Container>
    <hr></hr>
    <p>Agents running this test:</p>
    {/* Plugin Table */}
    <Table className='plugin-table'>
      <thead>
        <tr className='table-row-header'>
        {tableHeaders.map((tableHeader: any) => (
           <th key={tableHeader}>{tableHeader}</th>
        ))
        }
        </tr>
      </thead>
      <tbody>
        {/* Put the different status items in groups, adding a blank row between them */}
        {Object.keys(plugins).length == 0 &&
          <tr><td colSpan={tableHeaders.length}><LoadingText></LoadingText><p className="loading-text">Waiting for tests to run</p></td></tr>
        }
        {Object.keys(failedStatusPlugins).length > 0 &&
          <tr><td colSpan={tableHeaders.length}></td></tr>
        }{Object.keys(failedStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]} node={getNode(pluginId, agents)}></PluginItem>
          ))
        }

        {Object.keys(warningStatusPlugins).length > 0 &&
          <tr><td colSpan={tableHeaders.length}></td></tr>
        }{Object.keys(warningStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]} node={getNode(pluginId, agents)}></PluginItem>
          ))
        }

        {Object.keys(unknownStatusPlugins).length > 0 &&
          <tr><td colSpan={tableHeaders.length}></td></tr>
        }{Object.keys(unknownStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]} node={getNode(pluginId, agents)}></PluginItem>
          ))
        }

        {Object.keys(passingStatusPlugins).length > 0 &&
          <tr><td colSpan={tableHeaders.length}></td></tr>
        }{Object.keys(passingStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]} node={getNode(pluginId, agents)}></PluginItem>
          ))
        }
      </tbody>
    </Table>
    </Card.Body>
    <JsonView value={testConfigData} collapsed={true} displayDataTypes={false} shortenTextAfterLength={0}/>
    </Card>
    </>
  )
}

function PluginItem({pluginId, plugin, node} : {pluginId : string, plugin:any, node: string, }) {
  const [open, setOpen] = useState(false);
  
  let pluginOverallStatus = []
  let dominantStatus = plugin.testRunStatus

  if (plugin.healthStatus != 'running') {
    pluginOverallStatus.push(TestRunStatus.Fail) // include the plugin health in the overall status if the plugin is not healthy
    dominantStatus = TestRunStatus.Fail
  }
  pluginOverallStatus.push(plugin.testRunStatus)


  return (
    <>
    <tr onClick={() => setOpen(!open)} className={GetItemRowClasses(open, dominantStatus)}>
        <td className='expand-row-item '><img className='expand-icon' src={expandIcon} alt="expand"/></td>
        <td><Status status={pluginOverallStatus}></Status></td>
        <td>{GetPodNameFromPluginId(pluginId)}</td>
        <td>{GetPodNamespaceFromPluginId(pluginId)}</td>
        <td>{node ? node : <LoadingText></LoadingText>}</td>
        <td className={plugin.healthStatus == 'running' ? "" : "text-status-fail"}>{plugin.healthStatus ? plugin.healthStatus : <LoadingText></LoadingText>}</td>        
    </tr>
    {open && 
    <tr>
      <td colSpan={6}>
        <PluginDetails pluginId={pluginId}></PluginDetails>
      </td>
    </tr>
    }
    </>
  )
}

function getNode(pluginId: string, agents: any) {
  let agentId = GetAgentIdFromPluginId(pluginId)
  if (agents[agentId]) {
    return agents[agentId].agentConfig.runTimeInfo.nodeName
  } else {
    return ""
  }
}

export default PluginTable
