import { useState } from "react"
import { Container, Nav, Navbar as BsNavbar, Offcanvas, Button } from "react-bootstrap"
import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom"
import { RouteNames } from "../constants"

function Navbar() {  
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  return (
    <BsNavbar expand="lg" className="bg-light shadow-sm sticky-top" role="navigation" aria-label="Glavni izbornik">
      <Container>
        <BsNavbar.Brand as={Link} to={RouteNames.HOME} onClick={handleClose} className="fw-bold">
          PawAlert
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="offcanvas-navbar" onClick={handleShow} className="border-0 shadow-none" />

        <BsNavbar.Offcanvas
          id="offcanvas-navbar"
          aria-labelledby="offcanvas-navbar-label"
          placement="end"
          show={show}
          onHide={handleClose}
        >
          <Offcanvas.Header closeButton className="border-bottom">
            <Offcanvas.Title id="offcanvas-navbar-label" className="fw-bold">
          PawAlert
          </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <Nav className="me-auto gap-lg-2">
            <Nav.Link as={Link} to={RouteNames.HOME} onClick={handleClose}>Početna</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.PRIJAVE_PREGLED} onClick={handleClose}>Katalog</Nav.Link>
             <Nav.Link as={Link} to={RouteNames.DETALJI_SLUCAJA} onClick={handleClose}>Detalji slučaja</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.PRIJAVI_SLUCAJ} onClick={handleClose}>Prijavi slučaj</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.DASHBOARD} onClick={handleClose}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.PROFIL} onClick={handleClose}>Profil</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to={RouteNames.REGISTRACIJA} onClick={handleClose}>Registracija</Nav.Link>
      <Button className="btn btn-success btn-sm">
  <FaSignInAlt className="me-1" /> Prijava
</Button>
            </Nav>
          </Offcanvas.Body>
        </BsNavbar.Offcanvas>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
