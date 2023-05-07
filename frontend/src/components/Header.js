//Paul Hernandez y Vianey Martinez 
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

function Header() { /*Encabezado/Navbar*/

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header /*Conexion a los links de las paginas*/>
          <Navbar bg="warningt" variant="bg-warning">
            <Container>
              <img
                src="https://raw.githubusercontent.com/metodosformalesds/MFDS_2022_T2_Code/main/LogoVetPet.png"
                width="100px"
              ></img>
              <LinkContainer to="/">
                <Navbar.Brand>vetpet</Navbar.Brand>
              </LinkContainer>
              <SearchBox />
              <Nav className="ml-auto">
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i>Carrito
                  </Nav.Link>
                </LinkContainer>
    
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Perfil</NavDropdown.Item>
                    </LinkContainer>
    
                    <NavDropdown.Item onClick={logoutHandler}>
                      Cerrar sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i>Inicar sesión
                    </Nav.Link>
                  </LinkContainer>
                )}
    
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="adminmenue">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Usuarios</NavDropdown.Item>
                    </LinkContainer>
    
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Productos</NavDropdown.Item>
                    </LinkContainer>
                    
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Ordenes</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
      );
}

export default Header
