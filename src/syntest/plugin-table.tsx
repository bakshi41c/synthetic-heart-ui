import { config } from 'process'
import React from 'react'
import { Table } from 'react-bootstrap'
import { useState } from 'react';
import Status from '../common/status';
import LoadingText from '../common/loading';
import PluginDetails from './plugin-details';
import { GetItemRowClasses } from '../common/common';


function PluginTable({plugins} : {plugins:any}) {
  
  let failedStatusPlugins : any = {}
  let warningStatusPlugins : any = {}
  let passingStatusPlugins : any = {}
  let unknownStatusPlugins : any = {}

  
  Object.keys(plugins).forEach(pluginId => {
    switch(plugins[pluginId].status) {
      case '3':
          passingStatusPlugins[pluginId] = plugins[pluginId]
          break
      case '2':
          warningStatusPlugins[pluginId] = plugins[pluginId]
          break
      case '1':
          failedStatusPlugins[pluginId] = plugins[pluginId]
          break
      default:
          unknownStatusPlugins[pluginId] = plugins[pluginId]
    }
  })


  return (
    <>
    <Table>
      <thead>
        <tr className='table-row-header'>
          <th>Status</th>
          <th>Pod Name</th>
          <th>Pod Namespace</th>
          <th>Node</th>
          <th>Plugin Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(plugins).length == 0 &&
          <><LoadingText></LoadingText><p>Waiting for tests to run</p></>
        }
        {Object.keys(failedStatusPlugins).length > 0 &&
          <tr><td colSpan={5}></td></tr>
        }{Object.keys(failedStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]}></PluginItem>
          ))
        }

        {Object.keys(warningStatusPlugins).length > 0 &&
          <tr><td colSpan={5}></td></tr>
        }{Object.keys(warningStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]}></PluginItem>
          ))
        }

        {Object.keys(unknownStatusPlugins).length > 0 &&
          <tr><td colSpan={5}></td></tr>
        }{Object.keys(unknownStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]}></PluginItem>
          ))
        }

        {Object.keys(passingStatusPlugins).length > 0 &&
          <tr><td colSpan={5}></td></tr>
        }{Object.keys(passingStatusPlugins).map((pluginId: any) => (
            <PluginItem key={pluginId} pluginId={pluginId} plugin={plugins[pluginId]}></PluginItem>
          ))
        }
      </tbody>
    </Table>
    </>
  )
}

function PluginItem({pluginId, plugin} : {pluginId : string, plugin:any}) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <tr onClick={() => setOpen(!open)} className={GetItemRowClasses(open, plugin.status)}>
        <td><Status status={plugin.status}></Status></td>
        <td>{getPodNameFromPluginId(pluginId)}</td>
        <td>{getPodNamespaceFromPluginId(pluginId)}</td>
        <td>{plugin.health.runtime ? plugin.health.runtime.$nodeName : <LoadingText></LoadingText>}</td>
        <td>{plugin.health.status ? plugin.health.status : <LoadingText></LoadingText>}</td>        
    </tr>
    {open && 
    <tr>
      <td colSpan={5}>
        <PluginDetails pluginId={pluginId}></PluginDetails>
      </td>
    </tr>
    }
    </>
  )
}


function getPodNameFromPluginId(pluginId: string) {
    return pluginId.split("/")[2]
}

function getPodNamespaceFromPluginId(pluginId: string) {
    return pluginId.split("/")[3]
}


export default PluginTable
