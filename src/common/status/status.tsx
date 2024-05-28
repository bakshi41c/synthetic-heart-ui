import { stat } from 'fs'
import React from 'react'
import { Log } from '../../logger'
import './status.css'

export enum TestRunStatus {
    Pass = "pass",
    Warn = "warn",
    Fail = "fail",
    Unknown = "unknown",
}

export default function Status({status, renderIcon=true} : {status: TestRunStatus[], renderIcon?: boolean}) {
    if (status.length <= 1) {
        let s: TestRunStatus = TestRunStatus.Unknown
        if (status.length == 1) {
            s = status[0]
        }
        return (
            <div className={'status-box bg-status-'+ s}>
                {renderIcon && <p className='status-icon'>{getIcon(new Set<TestRunStatus>([s]))}</p>}
            </div>
        )   
    } else {
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

        return (
            <div className={'status-box-composite'} style={{ background: background }}><p className='status-icon'>{getIcon(statusSet)}</p></div>
        ) 
    }
   
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

function getIcon(status : Set<TestRunStatus>) {
    if (status.has(TestRunStatus.Fail)) {
        return "❗"
    } else if (status.has(TestRunStatus.Warn)) {
        return "⚠️"
    } else {
        return ""
    }
}