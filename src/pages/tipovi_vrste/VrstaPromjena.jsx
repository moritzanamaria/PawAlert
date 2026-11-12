import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Container, Form } from "react-bootstrap";
import VrsteService from "../../services/vrste/VrsteService";
import { vrstaSchema } from "../../schemas/nazivSchema";

export default function VrstaPromjena() {
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    };

    const params = useParams();
    const [vrsta, setVrsta] = useState({});

    useEffect(() => {
        async function ucitajVrstu() {
            try {
                const res = await VrsteService.getById(params.id);
                setVrsta(res.data || res);
            } catch (error) {
                console.error("Greška:", error);
            }
        }
        ucitajVrstu();
    }, [params.id]);

    async function promjeni(podaci) {
        await VrsteService.promjeni(params.id, podaci).then(() => {
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

        promjeni({
            ...vrsta,
            naziv: rezultat.data.naziv
        })
    }

    return (
        <Container className="my-5" style={{ maxWidth: "600px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️ Izmjena vrste</h3>
                    <p className="mb-0 text-dark-50 small">
                        Uredite naziv za odabranu vrstu životinje.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form key={vrsta.id} onSubmit={obradiSubmit}>
                        <Form.Group className="mb-4" controlId="naziv">
                            <Form.Label className="fw-medium">Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                defaultValue={vrsta.naziv}
                                placeholder="Npr. Pas, Ptica"
                                isInvalid={!!errors.naziv}
                                onFocus={() => ocistiGresku("naziv")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.naziv}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center pt-2">
                            <Link to={RouteNames.TIPOVI_I_VRSTE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">Odustani</Link>

                            <Button type="submit" variant="warning" className="px-5 fw-bold text-dark">Spremi promjene</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}