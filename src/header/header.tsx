import React from 'react'
import { Container, Stack } from 'react-bootstrap'
import './header.css'

export default function header() {
  return (
    <Container className="title">
    <Stack direction="horizontal" gap={2}>
        <div className="card-label p-2"> <img id="shLogo" alt="Logo" src="header/logo.svg"></img></div>
        <div className="p-2"><h3 id="titleText">Synthetic Heart</h3></div>
    </Stack>
    <hr></hr>
    </Container>
  )
}
