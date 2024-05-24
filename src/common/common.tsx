export function GetItemRowClasses(isOpen: boolean, status: string) {
    let classNames = "accordion-toggle table-row" 
    if (isOpen) {
        classNames = classNames + " " + "table-row-bg-status-"+ status
    } else {
        classNames = classNames + " " + "table-row-closed"
    }
    return classNames
}