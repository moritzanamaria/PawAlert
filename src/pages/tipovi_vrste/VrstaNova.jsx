import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Container, Form } from "react-bootstrap";
import VrsteService from "../../services/vrste/VrsteService";
import { vrstaSchema } from "../../schemas/nazivSchema";
import { useState } from "react";

export default function VrstaNova() {
    const navigate = useNavigate()


    const [errors, setErrors] = useState({});

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };

    async function dodaj(vrsta) {
        await VrsteService.dodaj(vrsta).then(() => {
            navigate(RouteNames.TIPOVI_I_VRSTE_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({});
        const rezultat = vrstaSchema.safeParse({ naziv: podaci.get('naziv') ?? '' })
        if (!rezultat.success) {
            const noveGreske = {};
            rezultat.error.issues.forEach((issue) => {
                const kljuc = issue.path[0];
                if (!noveGreske[kljuc]) {
                    noveGreske[kljuc] = issue.message;
                }
            });
            setErrors(noveGreske);
            return;
        }

        dodaj({
            naziv: rezultat.data.naziv
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "600px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-secondary text-white p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">🐾 Unos nove vrste</h3>
                    <p className="mb-0 text-white-50 small">
                        Unesite naziv nove vrste životinje.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={obradiSubmit}>
                        <Form.Group controlId="naziv" className="mb-4">
                            <Form.Label className="fw-medium">Naziv vrste</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                placeholder="Unesite naziv vrste (Npr. Ptica)"
                                isInvalid={!!errors.naziv}
                                onFocus={() => ocistiGresku("naziv")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.naziv}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={RouteNames.TIPOVI_I_VRSTE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">
                                Odustani
                            </Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">
                                Spremi
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}