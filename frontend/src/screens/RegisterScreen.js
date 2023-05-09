//Vianey Martinez
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

function RegisterScreen({ location, history }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(register(name, email, password))
        }

    }

    return (
        <FormContainer /*Formulario para registrar una cuenta*/>
            <h1>Registra una cuenta nueva</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Ingresa tu nombre'
                        value={name}
                        onChange={(e) => setName(e.target.value)  /*Obteniendodatos*/}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Ingresa tu correo'
                        color='black'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Ingresa tu contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Confirma tu contraseña</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Confirma tu contraseña'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'  /*Boton para registrar datos*/>
                    Registrar cuenta
                </Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    ¿Ya tienes cuenta? <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}  /*Redireccionar a iniciar sesion*/>
                        Inicia sesión
                        </Link>
                </Col>
            </Row>
        </FormContainer >
    )
}

export default RegisterScreen
