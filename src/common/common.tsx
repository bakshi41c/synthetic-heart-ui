import { GetStatusBgClass, TestRunStatus } from "./status/status"

export const DEFAULT_SERVER_URL="http://localhost:8080"
export const DEFAULT_PROMETHEUS_URL="http://localhost:9090"

export function GetItemRowClasses(isOpen: boolean, status: TestRunStatus) {
    let classNames = "accordion-toggle table-row" 
    if (isOpen) {
        classNames = classNames + " " + GetStatusBgClass(status)
    } else {
        classNames = classNames + " " + "table-row-closed"
    }
    return classNames
}

export function GetPodNameFromPluginId(pluginId: string) {
    return pluginId.split("/")[2]
}

export function GetPodNamespaceFromPluginId(pluginId: string) {
    return pluginId.split("/")[3]
}

export function GetConfigIdFromPluginId(pluginId: string) {
    let c = pluginId.split("/")
    return c[0] + "/" + c[1]
}

export function GetAgentIdFromPluginId(pluginId: string) {
    let c = pluginId.split("/")
    return c[2] + "/" + c[3]
}

export function TitleCase(string: string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}