import React from 'react'
import './guage.css'
export default function guage({title, metric}: {title: string, metric: number}) {
  return (
    <div className='guage'>
        <label>{title}</label>
        <p className='guage-metric'>{metric}</p>
    </div>
  )
}
