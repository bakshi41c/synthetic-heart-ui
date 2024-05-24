import React from 'react'

export default function Status({status} : {status: string}) {
    return (
        <div>{switchStatus(status)}</div>
    )
}

function switchStatus(status: string) {
    switch(status) {
        case '3':
            return '🟩'
        case '2':
            return '🟨'
        case '1':
            return '🟥'
        default:
            return '⬛';
    }
}