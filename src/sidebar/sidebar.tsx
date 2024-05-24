import React from 'react'
import { Container, Form } from 'react-bootstrap'
import './sidebar.css';

export default function sidebar({disabled} : {disabled : boolean}) {
    let dummyNamespace = ['synthetic-heart', 'example-a', 'example-b']
    let statusNamespace = ['🟥 Failing', '🟨 Partial Pass', '🟩 Passing', '⬛ Unknown']
    return (
       
        <Container>
        <h5 className='filter-title'>Filters:</h5>
        <hr></hr>
        <div className='filter-header'>Namespace:</div>
        <Form >
            {dummyNamespace.map((item) => (
                <div key={item} className="mb-0">
                    <Form.Check className='filter-item' type="checkbox" id={`${item}-namepsace-filter`} label={item} disabled={disabled}/>
                </div>
            ))}
        </Form>

        <br></br>
        <div className='filter-header'>Status:</div>
        <Form>
            {statusNamespace.map((item) => (
                <div key={item} className="mb-0">
                    <Form.Check className='filter-item' type="checkbox" id={`${item}-status-filter`} label={item} disabled={disabled}/>
                </div>
            ))}
        </Form>
        </Container>
    )
}
