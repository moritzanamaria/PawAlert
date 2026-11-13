import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { loginSchema } from "../../schemas/operaterSchema"
import { useState, useRef } from "react"
import useAuth from "../../hooks/useAuth"

export default function Login() {
    const [errors, setErrors] = useState({})
    const { login } = useAuth();
    
    const formaRef = useRef(null);

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

        login(podaci.get('email'), podaci.get('lozinka'))
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
                    <Card 
                        className="p-2 mb-2 bg-light border-dashed cursor-pointer text-center" 
                        style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                        onClick={() => popuniPodatke('admin@pawalert.hr', 'Edunova123!')}
                    >
                        <small className="text-muted">Klikni za Admina</small>
                        <div className="fw-bold">admin@pawalert.hr</div>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card 
                        className="p-2 mb-2 bg-light border-dashed cursor-pointer text-center" 
                        style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                        onClick={() => popuniPodatke('operater@pawalert.hr', 'Edunova123!')}
                    >
                        <small className="text-muted">Klikni za Operatera</small>
                        <div className="fw-bold">operater@pawalert.hr</div>
                    </Card>
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