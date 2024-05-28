import { config } from 'process'
import React from 'react'
import { Table } from 'react-bootstrap'
import { useState } from 'react';
import Status, { TestRunStatus } from '../common/status/status';
import LoadingText from '../common/loading/loading';
import PluginDetails from './plugin-details';
import { GetAgentIdFromPluginId, GetItemRowClasses, GetPodNameFromPluginId, GetPodNamespaceFromPluginId  } from '../common/common';
import expandIcon from './assets/expand_icon.png'
import './plugin.css';

function PluginTable({plugins, agents} : {plugins:any, agents:any}) {
  
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
    <Table>
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
          <tr><td colSpan={tableHeaders.length}><LoadingText></LoadingText><p>Waiting for tests to run</p></td></tr>
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
    </>
  )
}

function PluginItem({pluginId, plugin, node} : {pluginId : string, plugin:any, node: string, }) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <tr onClick={() => setOpen(!open)} className={GetItemRowClasses(open, plugin.testRunStatus)}>
        <td className='expand-row-item '><img className='expand-icon' src={expandIcon} alt="expand"/></td>
        <td><Status status={[plugin.testRunStatus]}></Status></td>
        <td>{GetPodNameFromPluginId(pluginId)}</td>
        <td>{GetPodNamespaceFromPluginId(pluginId)}</td>
        <td>{node ? node : <LoadingText></LoadingText>}</td>
        <td>{plugin.healthStatus ? plugin.healthStatus : <LoadingText></LoadingText>}</td>        
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
