//Paul Hernandez
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    return (
        <footer /*Pie de pagina*/> 
            <Container>
                <Row>
                    <Col className="text-center py-3">Copyright &copy; vetpet</Col>
                     <img src="https://raw.githubusercontent.com/metodosformalesds/MFDS_2022_T2_Code/main/Appointment/static/img/mascotas.png" alt="Girl in a jacket" width="400" height="300"  ></img>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
