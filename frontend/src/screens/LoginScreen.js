//Vianey Martinez

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import Logins from "../components/Logins";
// import {GoogleLogin} from "react-google-login"
import { gapi } from "gapi-script";
import LoginButton from "./login";
import jwtDecode from "jwt-decode";
import { loginGoogle } from "../actions/googleActions";
import CryptoJS from "crypto-js";

const CLIENT_ID =
  "697743163109-gl9qckdfkh76tps2orhe2uc35068jkh9.apps.googleusercontent.com";
const google = window.google;

function LoginScreen() {
  //valores de usuarios
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = location.search ? `/${location.search.split("=")[1]}` : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const responseGoogle = (response) => {
    console.log(response);
  };

  //Enviar la información de usuario
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    const hashedPassword = CryptoJS.MD5(password).toString();
    dispatch(login(email, hashedPassword));
  };
  //google handlers
  const onSignIn = (response) => {
    console.log(response);
  };
  const handleGoogleCredentialResponse = (response) => {
    let userObject = jwtDecode(response.credential);
    console.log(userObject);
    dispatch(loginGoogle(response.credential));
  };
  const onFailure = (res) => {
    console.log("Login failed", res);
  };
  //initialize google button
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleGoogleCredentialResponse,
      cookie_policy: "single_host_origin",
    });
    google.accounts.id.renderButton(document.getElementById("g_id_onload"), {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      onSuccess: onSignIn,
      onFailure: onFailure,
    });
  });
  return (
    //Formulario para inicar sesion
    <FormContainer>
      <h1>Acceder a cuenta</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Iniciar sesión
        </Button>
        <br></br>
        <LoginButton></LoginButton>
      </Form>
      <Row className="py-3">
        <Col>
          Eres cliente nuevo?, si es así solo registrate y listo{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Registrar
          </Link>
        </Col>
        <Col>
          <div id="g_id_onload"></div>
        </Col>
      </Row>
    </FormContainer>
  );
}

//Exportar la funcion para que se pueda usar en otros archivos
export default LoginScreen;
