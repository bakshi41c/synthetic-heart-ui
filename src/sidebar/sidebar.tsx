import React, { useEffect, useState } from 'react'
import { Container, Form, Stack } from 'react-bootstrap'
import { TitleCase } from '../common/common';
import Status, { TestRunStatus } from '../common/status/status';
import './sidebar.css';

export default function Sidebar({testConfigs, disabled, onFilterChange} : 
    {testConfigs : any, disabled : boolean, onFilterChange: (nsFilter: Set<string>, statusFilter: Set<TestRunStatus>) => void}) {

    let nsSet = new Set<string>()
    let statusSet = new Set<TestRunStatus>()

    Object.keys(testConfigs).forEach((configId) => {
        let config = testConfigs[configId]
        nsSet.add(config.configSummary.namespace)

        Object.keys(config.plugins).forEach((pluginId) => {
            let plugin = config.plugins[pluginId]
            statusSet.add(plugin.testRunStatus)
        })
    })

    const [nsSelected, setNamespace] = useState(new Set<string>());
    const [statusSelected, setStatus] = useState(new Set<TestRunStatus>());

    const onNamespaceChange = ({ target: { value } } : {target: {value: any}}) => {
        setNamespace(previousState => changeNsSet(previousState, value))

    };

    const onStatusChange = ({ target: { value } } : {target: {value: any}}) => {
        setStatus(previousState => changeStatusSet(previousState, value))
    };

    useEffect(()=>{
        onFilterChange(nsSelected, statusSelected)
      },[nsSelected, statusSelected]) // notify when one of these is changed

    return (
       
        <Container>
            <h5 className='filter-title'>Filters:</h5>
            <hr></hr>
            <div className='filter-header'>Namespace:</div>
            <Form >
                {Array.from(nsSet).map((item) => (
                    <div key={item} className="mb-0">
                        <Form.Check className='filter-item' 
                        type="checkbox" 
                        id={`${item}-namepsace-filter`} 
                        label={item}
                        value={item}
                        checked={nsSelected.has(item)}
                        onChange={onNamespaceChange}/>
                    </div>
                ))}
            </Form>

            <br></br>
            <div className='filter-header'>Status:</div>
            <Form>
                {Array.from(statusSet).map((item) => (
                    <div key={item} className="mb-0">
                        <Form.Check className='filter-item' type="checkbox" id={`${item}-status-filter`} disabled={disabled}>
                            <Form.Check.Input 
                            type="checkbox"  
                            disabled={disabled}
                            id={`${item}-namepsace-filter`} 
                            value={item}
                            checked={statusSelected.has(item)}
                            onChange={onStatusChange}/>
                            <Form.Label disabled={disabled}>
                                <Stack  direction="horizontal" gap={0}>
                                    <div className="status-filter-icon p-0"><Status status={[item]} renderIcon={false}></Status></div>
                                    <div className="status-filter-label p-0">{TitleCase(item)}</div>
                                </Stack>
                            </Form.Label>
                        </Form.Check>
                    </div>
                ))}
            </Form>
        </Container>
    )
}

function changeStatusSet(previousStatusState: Set<TestRunStatus>, val: TestRunStatus) : Set<TestRunStatus> {
    let newStatusState = new Set<TestRunStatus>(previousStatusState)
    if (previousStatusState.has(val)) {
        newStatusState.delete(val)
    } else {
        newStatusState.add(val)
    }
    return newStatusState
}

function changeNsSet(previousNsState: Set<string>, val: string) : Set<string> {
    let newNsState = new Set<string>(previousNsState)
    if (previousNsState.has(val)) {
        newNsState.delete(val)
    } else {
        newNsState.add(val)
    }

    return newNsState
}
