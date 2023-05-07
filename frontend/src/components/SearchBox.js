//Paul Hernandez y Vianey Martinez 

import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('') /*Barra de busqueda*/

    let history = useHistory()

    const submitHandler = (e) => { /*funcion de busqueda de palabras*/
        e.preventDefault()
        if (keyword) {
            history.push(`/?keyword=${keyword}&page=1`)
        } else {
            history.push(history.push(history.location.pathname))
        }
    }
    return ( /*Barra de busqueda diseño*/
        <Form onSubmit={submitHandler} inline> 
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5'
                placeholder='Busca los mejores productos para mascota'
            ></Form.Control>

            <Button
                type='submit'
                variant='outline-warning'
                className='p-2'
            >
                Buscar
            </Button>
        </Form>
    )
}

export default SearchBox
