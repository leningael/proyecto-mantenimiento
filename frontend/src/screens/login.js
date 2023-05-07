//Vianey Martinez

import React, { useState, useEffect, Component } from 'react'
//Id generado por las credenciales de la api de google
const clientId="795948132843-dcfvnj4f58c0jisogn9qfqnsg20hat0f.apps.googleusercontent.com"

function Login({ }) {
    const onSuccess=(res)=>{
        console.log("Login succes",res.profileObj);
      }
      const onFailure=(res)=>{
        console.log("Login failed", res);
      }

      //Recabae los datos para el login se usa el componente de google

    return (
        <div id="signInButton"> 
        </div>
    )
}

export default Login