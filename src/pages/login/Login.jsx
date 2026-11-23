import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { loginSchema } from "../../schemas/operaterSchema"
import { useState, useRef } from "react"
import useAuth from "../../hooks/useAuth"
import { Navigate, useLocation } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function Login() {
    const [errors, setErrors] = useState({})
    const { login, isLoggedIn } = useAuth();
    const location = useLocation();
    const povratak = location.state?.povratak ?? RouteNames.HOME;

    const formaRef = useRef(null);

     if (isLoggedIn) {
        return <Navigate to={povratak} replace />
    }


    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        setErrors({})

        const rezultat = loginSchema.safeParse({
            email: podaci.get('email'),
            lozinka: podaci.get('lozinka')
        })

        if (!rezultat.success) {
            setErrors({ email: 'Kombinacija email i lozinka ne odgovaraju' })
            return
        }

        login(podaci.get('email'), podaci.get('lozinka'), povratak)
    }

    const popuniPodatke = (email, lozinka) => {
        const forma = formaRef.current;
        forma.email.value = email;
        forma.lozinka.value = lozinka;
        setErrors({});
    }

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors }
            delete noveGreske[nazivPolja]
            setErrors(noveGreske)
        }
    }

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col md={6}>
                    <button
                        type="button"
                        className="card p-2 mb-2 bg-light text-center w-100"
                        style={{ borderStyle: 'dashed' }}
                        onClick={() => popuniPodatke('admin@pawalert.hr', 'Edunova123!')}
                    >
                        <small className="text-muted">Klikni za Admina</small>
                        <span className="fw-bold">admin@pawalert.hr</span>
                    </button>
                </Col>
                <Col md={6}>
                    <button
                        type="button"
                        className="card p-2 mb-2 bg-light text-center w-100"
                        style={{ borderStyle: 'dashed' }}
                        onClick={() => popuniPodatke('operater@pawalert.hr', 'Edunova123!')}
                    >
                        <small className="text-muted">Klikni za Operatera</small>
                        <span className="fw-bold">operater@pawalert.hr</span>
                    </button>
                </Col>
            </Row>

            <Form onSubmit={odradiSubmit} ref={formaRef}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="mb-4">Podaci za prijavu</Card.Title>

                        {errors.opce && (
                            <div className="alert alert-danger" role="alert">
                                {errors.opce}
                            </div>
                        )}

                        <Row>
                            <Col xs={12}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className="fw-bold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="vas@email.hr"
                                        isInvalid={!!errors.email}
                                        onFocus={() => ocistiGresku('email')}
                                        autoComplete="email"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <Form.Group controlId="lozinka" className="mb-3">
                                    <Form.Label className="fw-bold">Lozinka</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="lozinka"
                                        placeholder="Unesite lozinku"
                                        isInvalid={!!errors.lozinka}
                                        onFocus={() => ocistiGresku('lozinka')}
                                        autoComplete="current-password"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lozinka}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <hr />

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <Button
                                type="submit"
                                variant="success"
                                className="px-4"
                            >
                                Prijavi se
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Form>
        </Container>
    )
}