import { stat } from 'fs'
import React from 'react'
import { Log } from '../../logger'
import './status.css'
import dangerIcon from './danger-icon.png'
import warningIcon from './warn-icon.png'
import { False } from '@uiw/react-json-view/cjs/types/False'
import { Stack } from 'react-bootstrap'

export enum TestRunStatus {
    Pass = "pass",
    Warn = "warn",
    Fail = "fail",
    Unknown = "unknown",
}

export default function Status({status, renderIcon=true} : {status: TestRunStatus[], renderIcon?: boolean}) {
    let backgroundColorSet : Set<string> = new Set()
    let statusSet : Set<TestRunStatus> = new Set()
    status.forEach(s => {
        switch(s) {
            case TestRunStatus.Unknown: {
                backgroundColorSet.add("gray")
                statusSet.add(TestRunStatus.Unknown)
                break
            }
            case TestRunStatus.Fail: {
                backgroundColorSet.add("#ed5d28")
                statusSet.add(TestRunStatus.Fail)
                break
            }
            case TestRunStatus.Warn: {
                backgroundColorSet.add("#f2b927")
                statusSet.add(TestRunStatus.Warn)
                break
            }
            case TestRunStatus.Pass: {
                backgroundColorSet.add("#38b24b")
                statusSet.add(TestRunStatus.Pass)
                break
            }
        }
    })

    let backgroundColorValues : string[] = []
    let weightPercent = 100 / backgroundColorSet.size
    Array.from(backgroundColorSet).forEach(((color, index) => {
        let startPos = index*weightPercent
        let endPos = startPos+weightPercent
        backgroundColorValues.push(
            color + " " 
            + startPos + "% "
            + endPos + "% "
        )
    }))


    let background = "linear-gradient(315deg," + backgroundColorValues.join(",") + ")"

    let icon;
    if (renderIcon && (statusSet.has(TestRunStatus.Fail) || statusSet.has(TestRunStatus.Warn))) {
        icon = GetIcon(statusSet)
    } else {
        renderIcon = false // only render the icon if its a fail and warn
    }

    return (
        <Stack direction="horizontal" gap={1}>
            <div className={'p-0 status-box-composite'} style={{ background: background }}></div>
            {renderIcon && <img className='p-0 status-icon'src={icon}></img>}
        </Stack>
        
    ) 
   
}

export function GetStatusBgLightClass(status: TestRunStatus) {
    return "bg-status-"+status+"-light "   
}

export function GetStatusBgClass(status: TestRunStatus) {
    return "bg-status-"+status+" "   
}

// Gets a "status" from the pass ratio
export function GetStatusFromPassRatio(passRatio: Number | null) : TestRunStatus {
    if (passRatio === null) {
        return TestRunStatus.Unknown
    } else if (passRatio == 1) {
        return TestRunStatus.Pass
    } else if (passRatio < 1 && passRatio > 0.5) {
        return TestRunStatus.Warn
    } else {
        return TestRunStatus.Fail
    }
}

export function GetIcon(status : Set<TestRunStatus>) {
    if (status.has(TestRunStatus.Fail)) {
        return dangerIcon
    } else if (status.has(TestRunStatus.Warn)) {
        return warningIcon
    } else {
        return ""
    }
}