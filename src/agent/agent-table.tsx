import JsonView from '@uiw/react-json-view';
import React, { useState } from 'react'
import { Card, Container, Nav, Stack, Table } from 'react-bootstrap'
import { GetItemRowClasses } from '../common/common';
import { GetStatusBgLightClass, TestRunStatus } from '../common/status/status';
import '../common/status/status.css'

export default function AgentTable({agents}: {agents: any}) {
    return (
        <Table>
          <thead>
            <tr className='table-row-header'>
              <th>Pod</th>
              <th>Namespace</th>
              <th>Node</th>
              <th>Watching Namespaces</th>
              <th>Mandatory Labels</th>
            </tr>
          </thead>
          <tbody>
            {
            Object.keys(agents).map((agentId: any) => (
              <AgentItem key={agentId} agentId={agentId} agent={agents[agentId]}></AgentItem>
              ))
            }
          </tbody>
        </Table>
      )
}

function AgentItem({agentId, agent} : {agentId : string, agent:any}) {
    const [open, setOpen] = useState(false);
    return (
      <>
      <tr onClick={() => setOpen(!open)} className={GetItemRowClasses(open, TestRunStatus.Unknown)}>
          <td>{agent.agentConfig.runTimeInfo.podName}</td>
          <td>{agent.agentConfig.runTimeInfo.agentNamespace}</td>
          <td>{agent.agentConfig.runTimeInfo.nodeName}</td>
          <td>{agent.agentConfig.matchNamespaceSet && agent.agentConfig.matchNamespaceSet.length == 0 ? "All" : JSON.stringify(agent.agentConfig.matchNamespaceSet)}</td>
          <td>{agent.agentConfig.matchTestLabels && agent.agentConfig.matchTestLabels.length == 0 ? "None" : JSON.stringify(agent.agentConfig.matchTestLabels)}</td>
      </tr>
      {open && 
      <tr>
        <td colSpan={5}  className={GetStatusBgLightClass(TestRunStatus.Unknown)}>
          <AgentDetails key={agentId} agentId={agentId} agent={agent}></AgentDetails>
        </td>
      </tr>
      }
      </>
    )
}

function AgentDetails({agentId, agent} : {agentId : string, agent:any}) {

    return (
      <Card>
        <Card.Body className="plugin-details-card-body">
        <Container>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Id:</div>
                <div className="p-2">{agentId}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Pod name:</div>
                <div className="p-2">{agent.agentConfig.runTimeInfo.podName}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Namespace:</div>
                <div className="p-2">{agent.agentConfig.runTimeInfo.agentNamespace}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Node:</div>
                <div className="p-2">{agent.agentConfig.runTimeInfo.nodeName}</div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Available Plugins:</div>
                <div className="p-2"><JsonView value={agent.agentConfig.discoveredPlugins} collapsed={true} displayDataTypes={false}/></div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Running Tests:</div>
                <div className="card-label p-2"><JsonView value={agent.syntests} collapsed={false} displayDataTypes={false} shortenTextAfterLength={300}/></div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div className="card-label p-2">Raw Config:</div>
                <div className="card-label p-2"><JsonView value={agent} collapsed={true} displayDataTypes={false}/></div>
           
            </Stack>
        
            </Container>
        </Card.Body>
      </Card>
    )
}
