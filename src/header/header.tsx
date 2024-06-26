import React from 'react'
import { Container, Stack } from 'react-bootstrap'
import './header.css'
import synheartLogo from './synheart-logo.png'
import companyLogo from './company-logo.png'

export default function header() {
  return (
    <Container className="title">
    <Stack direction="horizontal" gap={1}>
        <div className="synheart-logo"> <img height={40} id="shLogo" alt="Logo" src={synheartLogo}></img></div>
        <div className="p-2 title"><h3 id="titleText">Synthetic Heart</h3></div>
        <div className="ms-auto company-logo"> <img height={70} id="companyLogo" alt="Logo" src={companyLogo}></img></div>
    </Stack>
    <hr></hr>
    </Container>
  )
}
