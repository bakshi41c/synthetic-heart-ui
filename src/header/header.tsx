import React from 'react'
import { Container, Stack } from 'react-bootstrap'
import './header.css'
import logo from './logo.svg'

export default function header() {
  return (
    <Container className="title">
    <Stack direction="horizontal" gap={2}>
        <div className="card-label"> <img id="shLogo" alt="Logo" src={logo}></img></div>
        <div className="p-2"><h3 id="titleText">Synthetic Heart</h3></div>
    </Stack>
    <hr></hr>
    </Container>
  )
}
