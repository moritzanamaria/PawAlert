import { useState } from "react"
import { Container, Nav, Navbar as BsNavbar, Offcanvas, NavDropdown } from "react-bootstrap"
import { FaMemory, FaStepBackward, FaStoreAlt } from "react-icons/fa";
import { Link } from "react-router-dom"
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from "../constants"
import useAuth from "../hooks/useAuth";

function Navbar() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { isLoggedIn, logout, authUser } = useAuth()

  function izvor() {
    switch (DATA_SOURCE) {
      case 'memorija':
        return <FaMemory title='Memorija' />
      case 'localStorage':
        return <FaStoreAlt title='Local storage' />
      default:
        return <FaStepBackward title='Nepoznato' />
    }
  }

  return (
    <BsNavbar expand="lg" collapseOnSelect className="bg-light shadow-sm sticky-top" role="navigation" aria-label="Glavni izbornik">
      <Container>
        <BsNavbar.Brand as={Link} to={RouteNames.HOME}>
          {izvor()} {IME_APLIKACIJE}
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
              {IME_APLIKACIJE}
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <Nav className="me-auto gap-lg-2">
              <Nav.Link as={Link} to={RouteNames.HOME} onClick={handleClose}>Početna</Nav.Link>
              <Nav.Link as={Link} to={RouteNames.KATALOG} onClick={handleClose}>Katalog</Nav.Link>

              {isLoggedIn && (
                <>
                  <Nav.Link
                    as={Link}
                    to={authUser?.uloga === 'admin' ? RouteNames.NADZORNA_PLOCA : RouteNames.MOJ_PROFIL}
                    onClick={handleClose}
                  >
                    {authUser?.uloga === 'admin' ? 'Nadzorna ploča' : 'Moj profil'}
                  </Nav.Link>

                  {authUser?.uloga === 'admin' && (
                    <>
                      <Nav.Link as={Link} to={RouteNames.PRIJAVE_PREGLED} onClick={handleClose}>Pregled prijava</Nav.Link>
                      <NavDropdown title="Šifrarnici" id="sifrarnici">
                        <NavDropdown.Item as={Link} to={RouteNames.TIPOVI_I_VRSTE_PREGLED} onClick={handleClose}>Tipovi i vrste</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to={RouteNames.OZNAKE_PREGLED} onClick={handleClose}>Oznake</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to={RouteNames.OPERATERI} onClick={handleClose}>Operateri</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to={RouteNames.GENERIRANJE_PODATAKA} onClick={handleClose}>Generiraj podatke</NavDropdown.Item>
                      </NavDropdown>
                    </>
                  )}
                </>
              )}
            </Nav>

            <Nav className="ms-auto d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
              {isLoggedIn ? (
                <Link
                  to={RouteNames.HOME}
                  className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault()
                    handleClose()
                    logout()
                  }}
                >
                  Logout {authUser.email}
                </Link>
              ) : (
                <>
                  <Link
                    to={RouteNames.REGISTRACIJA}
                    className="btn btn-success"
                    onClick={handleClose}
                  >
                    Registracija
                  </Link>
                  <Link
                    to={RouteNames.LOGIN}
                    className="btn btn-success"
                    onClick={handleClose}
                  >
                    Login
                  </Link>
                </>
              )}
            </Nav>

          </Offcanvas.Body>
        </BsNavbar.Offcanvas>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
