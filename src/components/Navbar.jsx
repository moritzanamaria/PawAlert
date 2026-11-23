import { useState } from "react"
import { Container, Nav, Navbar as BsNavbar, Offcanvas, NavDropdown } from "react-bootstrap"
import { FaMemory } from 'react-icons/fa';
import { GrServer, GrStatusUnknown, GrVirtualStorage } from 'react-icons/gr';
import { Link, NavLink, useLocation } from "react-router-dom"
import { DATA_SOURCE, RouteNames } from "../constants"
import useAuth from "../hooks/useAuth";
import BrandMark from "./BrandMark";
import { pronadiStranicu } from "../utils/stranice";


function Navbar() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { isLoggedIn, logout, authUser } = useAuth()
  const { pathname } = useLocation()
  const stranica = pronadiStranicu(pathname)

  function izvor() {
    switch (DATA_SOURCE) {
      case 'memorija':
        return <FaMemory title='Memorija' />
      case 'localStorage':
        return <GrVirtualStorage title='Local storage' />
      case 'firebase':
        return <GrServer title='Firebase' />
      default:
        return <GrStatusUnknown title='Nepoznato' />
    }
  }

  return (
    <BsNavbar expand="lg" collapseOnSelect className="pa-navbar sticky-top" role="navigation" aria-label="Glavni izbornik">
      <Container>
        <BsNavbar.Brand as={Link} to={RouteNames.HOME} className="pa-brand">
          <span className="pa-brand-mark"><BrandMark size={30} /></span>
          <span>Paw<span className="pa-brand-alert">Alert</span></span>
          <span className="pa-brand-ind d-none d-md-inline-flex align-items-center gap-1">{izvor()}</span>
        </BsNavbar.Brand>

        {stranica && (
          <span className={`pa-naslov-stranice ${stranica.uIzborniku || stranica.sifrarnik ? 'd-inline-flex d-lg-none' : 'd-inline-flex'}`}>
            {stranica.naslov}
          </span>
        )}

        <BsNavbar.Toggle aria-controls="offcanvas-navbar" aria-label="Otvori izbornik" onClick={handleShow} className="border-0 shadow-none" />

        <BsNavbar.Offcanvas
          id="offcanvas-navbar"
          className='pa-offcanvas'
          aria-labelledby="offcanvas-navbar-label"
          placement="end"
          show={show}
          onHide={handleClose}
        >
          <Offcanvas.Header closeButton closeLabel="Zatvori izbornik" className="pa-brand">
            <Offcanvas.Title id="offcanvas-navbar-label" className="pa-brand">
              <span className="pa-brand-mark"><BrandMark size={30} /></span>
              <span>Paw<span className="pa-brand-alert">Alert</span></span>            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <Nav className="me-auto align-items-lg-center gap-1">
              <Nav.Link as={NavLink} end to={RouteNames.HOME} className="pa-nav-link" onClick={handleClose}>Početna</Nav.Link>
              <Nav.Link as={NavLink} to={RouteNames.KATALOG} className="pa-nav-link" onClick={handleClose}>Katalog</Nav.Link>

              {isLoggedIn && (
                <>
                  <Nav.Link
                    as={NavLink}
                    className="pa-nav-link"
                    to={authUser?.uloga === 'admin' ? RouteNames.NADZORNA_PLOCA : RouteNames.MOJ_PROFIL}
                    onClick={handleClose}
                  >
                    {authUser?.uloga === 'admin' ? 'Nadzorna ploča' : 'Moj profil'}
                  </Nav.Link>

                  {authUser?.uloga === 'admin' && (
                    <>
                      <Nav.Link as={NavLink} to={RouteNames.PRIJAVE_PREGLED} className="pa-nav-link" onClick={handleClose}>Pregled prijava</Nav.Link>
                      <NavDropdown
                        id="sifrarnici"
                        className={`pa-nav-dropdown ${stranica?.sifrarnik ? 'active' : ''}`}
                        title={
                          <>
                            Šifrarnici
                            {stranica?.sifrarnik && <span className="pa-sifrarnik-stavka"> · {stranica.sifrarnik}</span>}
                          </>
                        }
                      >
                        <NavDropdown.Item as={Link} to={RouteNames.TIPOVI_I_VRSTE_PREGLED} active={stranica?.sifrarnik === 'Tipovi i vrste'} onClick={handleClose}>Tipovi i vrste</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to={RouteNames.OZNAKE_PREGLED} active={stranica?.sifrarnik === 'Oznake'} onClick={handleClose}>Oznake</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to={RouteNames.OPERATERI} active={stranica?.sifrarnik === 'Operateri'}  onClick={handleClose}>Operateri</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to={RouteNames.GENERIRANJE_PODATAKA} active={stranica?.sifrarnik === 'Generiranje podataka'} onClick={handleClose}>Generiraj podatke</NavDropdown.Item>
                      </NavDropdown>
                    </>
                  )}
                </>
              )}
            </Nav>

            <Nav className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
              {isLoggedIn ? (
                <Link
                  to={RouteNames.HOME}
                  className="btn btn-success pa-nav-cta"
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
                    className="btn btn-outline-success pa-nav-cta"
                    onClick={handleClose}
                  >
                    Registracija
                  </Link>
                  <Link
                    to={RouteNames.LOGIN}
                    className="btn btn-success pa-nav-cta"
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
