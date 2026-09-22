import { Container, Nav, Navbar as BsNavbar } from "react-bootstrap"
import { Link } from "react-router-dom"
import { RouteNames } from "../constants"

function Navbar() {
  return (
    <BsNavbar expand="lg" className="bg-light" role="navigation" aria-label="Glavni izbornik">
      <Container>
        <BsNavbar.Brand as={Link} to={RouteNames.HOME}>
          PawAlert
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="glavni-navbar" />
        <BsNavbar.Collapse id="glavni-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={RouteNames.HOME}>Početna</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.PRIJAVE}>Katalog</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.PRIJAVI_SLUCAJ}>Prijavi slučaj</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.DASHBOARD}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to={RouteNames.PROFIL}>Profil</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to={RouteNames.REGISTRACIJA}>Registracija</Nav.Link>
            <button className="btn btn-success btn-sm">Prijava</button>
          </Nav>

        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar