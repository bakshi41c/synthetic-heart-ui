import { config } from 'process'
import React from 'react'
import { Collapse, Table } from 'react-bootstrap'
import { useState } from 'react';
import PluginTable from './plugin-table';
import Status from '../common/status';
import '../common/common.css'
import { GetItemRowClasses } from '../common/common';


function SyntestTable({configs} : {configs:any}) {
  return (
    <Table>
      <thead>
        <tr className='table-row-header'>
          <th>Status</th>
          <th>Agents</th>
          <th>Name</th>
          <th>Description</th>
          <th>Repeat</th>
          <th>Plugin</th>
          <th>Namespace</th>
        </tr>
      </thead>
      <tbody>
        {
        Object.keys(configs).map((configId: any) => (
          <SyntestConfigItem key={configId} configSummary={configs[configId].configSummary} plugins={configs[configId].plugins ? configs[configId].plugins : []}></SyntestConfigItem>
          ))
        }
      </tbody>
    </Table>
  )
}

function SyntestConfigItem({configSummary, plugins} : {configSummary:any, plugins: any}) {
  const [open, setOpen] = useState(false);
  let overallStatus = plugins[Object.keys(plugins)[0]].status
  return (
    <>
    <tr onClick={() => setOpen(!open)} data-target="" className={GetItemRowClasses(open, overallStatus)}>
        <td><Status status={overallStatus}></Status></td>
        <td>{Object.keys(plugins).length}</td>
        <td>{configSummary.displayName}</td>
        <td>{configSummary.description}</td>
        <td>{configSummary.repeat}</td>
        <td>{configSummary.plugin}</td>
        <td>{configSummary.namespace}</td>
        
    </tr>
    { open &&
    <tr>
      <td colSpan={8} className={"bg-status-"+overallStatus+"-light"}>
        <PluginTable plugins={plugins}></PluginTable>
      </td>
    </tr>
    }
    
    </>
  )
}





export default SyntestTable
