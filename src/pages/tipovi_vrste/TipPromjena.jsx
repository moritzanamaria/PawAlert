import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Card, Container, Form } from "react-bootstrap";
import TipService from "../../services/tip/TipService";
import { tipSchema } from "../../schemas/nazivSchema";

export default function TipPromjena() {
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
    const [tip, setTip] = useState({})

    useEffect(() => {
        async function ucitajTip() {
            try {
                const res = await TipService.getById(params.id);
                setTip(res.data || res);
            } catch (error) {
                console.error("Greška:", error);
            }
        }
        ucitajTip();
    }, [params.id]);

    async function promjeni(podaci) {
        await TipService.promjeni(params.id, podaci).then(() => {
            navigate(RouteNames.TIPOVI_I_VRSTE_PREGLED)
        })
    }

    function obradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({});

        const rezultat = tipSchema.safeParse({ naziv: podaci.get('naziv') ?? '' })
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
            ...tip,
            naziv: rezultat.data.naziv
        })
    }
    return (
        <Container className="my-5" style={{ maxWidth: "850px" }}>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-warning text-dark p-4 rounded-top-3">
                    <h3 className="mb-0 fw-bold fs-4">✏️ Promjena tipa #{params.id}</h3>
                    <p className="mb-0 text-dark-50 small">
                        Ažurirajte naziv tipa prijave.
                    </p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form key={tip.id} onSubmit={obradiSubmit}>
                        <Form.Group className="mb-4" controlId="naziv">
                            <Form.Label className="fw-medium">Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                defaultValue={tip.naziv}
                                placeholder="Unesite naziv tipa..."
                                isInvalid={!!errors.naziv}
                                onFocus={() => ocistiGresku("naziv")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.naziv}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center pt-2">

                            <Link to={RouteNames.TIPOVI_I_VRSTE_PREGLED} className="btn btn-outline-secondary px-4 fw-medium">Odustani</Link>

                            <Button type="submit" variant="success" className="px-5 fw-bold">Spremi</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}