//Paul Hernandez
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    return (
        <footer /*Pie de pagina*/> 
            <Container>
                <Row>
                    <Col className="text-center py-3">Copyright &copy; vetpet</Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
