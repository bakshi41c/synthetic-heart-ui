import { config } from 'process'
import React from 'react'
import { Collapse, Stack, Table } from 'react-bootstrap'
import { useState } from 'react';
import PluginTable from './plugin-table';
import Status, { GetStatusBgLightClass, TestRunStatus,  } from '../common/status/status';
import '../common/common.css'
import '../common/status/status.css'
import './syntest.css'
import { GetItemRowClasses } from '../common/common';
import expandStackIcon from './assets/expand_stack_icon.png'
import { Log } from '../logger';
import PluginDetails from './plugin-details';


function SyntestTable({configs, agents, nsFilter, statusFilter} : 
  {configs:any, agents:any, nsFilter: Set<string>, statusFilter: Set<TestRunStatus>}) {
  
  // filter the configs
  let filteredConfigs : any = {}
  let nsFilteredConfigs: any = {}

  if (nsFilter.size != 0) {
    Object.keys(configs).map((configId: any) => {
      let config = configs[configId]
      if (nsFilter.has(config.configSummary.namespace)) {
        nsFilteredConfigs[configId] = config
      }
    })
  } else {
    nsFilteredConfigs = configs
  }

  if (statusFilter.size != 0) {
    Object.keys(nsFilteredConfigs).map((configId: any) => {
      let config = configs[configId]
      Object.keys(config.plugins).map((pluginId: any) => {
        let plugin = config.plugins[pluginId]
        if (statusFilter.has(plugin.testRunStatus)) {
          filteredConfigs[configId] = config
        }
      })

    })
  } else {
    filteredConfigs = nsFilteredConfigs
  }

  return (
    <Table>
      <thead>
        <tr className='table-row-header'>
          <th></th>
          <th></th>
          <th>Name</th>
          <th>Description</th>
          <th>Repeat</th>
          <th>Plugin</th>
          <th>Namespace</th>
        </tr>
      </thead>
      <tbody>
        {
        Object.keys(filteredConfigs).map((configId: any) => (
          <SyntestConfigItem key={configId} agents={agents} configSummary={filteredConfigs[configId].configSummary} plugins={filteredConfigs[configId].plugins ? filteredConfigs[configId].plugins : []}></SyntestConfigItem>
          ))
        }
      </tbody>
    </Table>
  )
}

function SyntestConfigItem({configSummary, plugins, agents} : {configSummary:any, plugins: any, agents: any}) {
  const [open, setOpen] = useState(false);
  let allStatuses : TestRunStatus[] = []
  let dominantStatus : TestRunStatus = TestRunStatus.Unknown

  // Go over all test run statuses
  // Compute a dominant status - fail > warn > pass > unknown
  Object.keys(plugins).forEach(pluginId => {
    let testRunStatus = plugins[pluginId].testRunStatus
    allStatuses.push(testRunStatus)
    if (dominantStatus != testRunStatus) { // no chage if same status
      if (dominantStatus == TestRunStatus.Unknown) { // anything is bettern than unknown
        dominantStatus = testRunStatus
        
      } else if (dominantStatus == TestRunStatus.Pass) { // fail and warn are more dominant than pass
        if (testRunStatus == TestRunStatus.Warn || testRunStatus == TestRunStatus.Fail) {
          dominantStatus = testRunStatus
        }

      } else if (dominantStatus == TestRunStatus.Warn) { // fail more dominant than warn
        if (testRunStatus == TestRunStatus.Fail) {
          dominantStatus = testRunStatus
        }
      }
    }
  })

  return (
    <>
    <tr onClick={() => setOpen(!open)} data-target="" className={GetItemRowClasses(open, dominantStatus)}>
        <td className="expand-row-item">
          <Stack direction="horizontal" >
            <img className='expand-stack-icon' src={expandStackIcon} alt="expand"/>
            <div className="badge">{Object.keys(plugins).length}</div>
          </Stack>
        </td>
        <td><Status status={allStatuses}></Status></td>
        <td>{configSummary.displayName}</td>
        <td>{configSummary.description}</td>
        <td>{configSummary.repeat}</td>
        <td>{configSummary.plugin}</td>
        <td>{configSummary.namespace}</td>
        
    </tr>
    { open &&
    <tr>
      <td colSpan={8} className={GetStatusBgLightClass(dominantStatus)}>
        <PluginTable plugins={plugins} agents={agents}></PluginTable>
      </td>
    </tr>
    }
    
    </>
  )
}


export default SyntestTable
