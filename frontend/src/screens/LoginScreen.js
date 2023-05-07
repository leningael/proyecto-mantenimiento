//Vianey Martinez

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'
import Logins from '../components/Logins';
import {gapi} from "gapi-script"
import LoginButton from './login'
const clientId="795948132843-dcfvnj4f58c0jisogn9qfqnsg20hat0f.apps.googleusercontent.com"

function LoginScreen({ location, history }) {
    //valores de usuarios 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin
     
      //Enviar la información de usuario
    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    useEffect(()=>{
        function start(){
          gapi.client.init({
            clientId: clientId,
            scope: ""
          })
        };
        gapi.load('client:auth2', start)
      });
    return (
        //Formulario para inicar sesion
        <FormContainer>
            <h1>Acceder a cuenta</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <Form onSubmit={submitHandler}>
             <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Ingresa tu Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>


                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Ingresa tu Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Iniciar sesión
                </Button>
                <br></br>
                <LoginButton>
                </LoginButton>
                
            </Form>            
            <Row className='py-3'>
                <Col>
                    Eres cliente nuevo?, si es así solo registrate y listo <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Registrar
                        </Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

//Exportar la funcion para que se pueda usar en otros archivos
export default LoginScreen
