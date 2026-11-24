import { useEffect, useState } from "react"
import OperaterService from "../../services/operateri/OperaterService"
import { Table, Button, Container, Card, Badge } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { FaEdit, FaTrash, FaKey } from "react-icons/fa"
import useLoading from "../../hooks/useLoading";
import useModal from "../../hooks/useModal";

export default function OperaterPregled() {

    const navigate = useNavigate();
    const [operateri, setOperateri] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const { showModal } = useModal();

    useEffect(() => {
        ucitajOperatere()
    }, [])

    async function ucitajOperatere() {
        showLoading()
        try {
            const odgovor = await OperaterService.get()
            if (!odgovor.success) {
                showModal('Nije implementiran servis')
                return
            }
            setOperateri(odgovor.data)
        } finally {
            hideLoading()
        }
    }


    async function brisanje(id) {
        showModal('Sigurno obrisati operatera?', async () => {
            showLoading()
            try {
                const rezultat = await OperaterService.obrisi(id)
                if (rezultat.success) {
                    ucitajOperatere()
                } else {
                    showModal(rezultat.message || 'Greška pri brisanju')
                }
            } finally {
                hideLoading();
            }
        })
    }

    return (
        <Container>
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h2 className="h3 fw-bold mb-1 text-dark">📋 Pregled operatera</h2>
                        <p className="text-muted small mb-0">Popis svih registriranih operatera</p>
                    </div>
                    <Link to={RouteNames.OPERATERI_NOVI}
                       className="btn btn-success fw-medium d-flex align-items-center gap-1 shadow-sm px-3 py-2 justify-content-center col-12 col-md-auto">
                        + Novi operater
                    </Link>
                </Card.Header>

                <Card.Body className="p-0">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th className="d-none d-sm-table-cell">Uloga</th>
                                <th className="text-center text-nowrap">Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operateri && operateri.map((operater) => (
                                <tr key={operater.id}>
                                    <td className="text-break">
                                        {operater.email}
                                        <div className="d-sm-none mt-1">
                                            <span className={`badge ${operater.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                                {operater.uloga}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="d-none d-sm-table-cell">
                                        <span className={`badge ${operater.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                            {operater.uloga}
                                        </span>
                                    </td>
                                    <td className="text-center text-nowrap">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => navigate(`/operateri/${operater.id}`)}
                                                title="Promijeni email"
                                                aria-label={`Promijeni email: ${operater.email}`}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => navigate(`/operateri/${operater.id}/lozinka`)}
                                                title="Promijeni lozinku"
                                                aria-label={`Promijeni lozinku: ${operater.email}`}
                                            >
                                                <FaKey />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => brisanje(operater.id)}
                                                title="Obriši"
                                                aria-label={`Obriši operatera: ${operater.email}`}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="bg-light border-0 p-3 px-4 d-flex align-items-center justify-content-between">
                    <span className="text-muted small">
                        Ukupno operatera: <Badge pill bg="primary" className="ms-1">{operateri ? operateri.length : 0}</Badge>
                    </span>
                </Card.Footer>
            </Card>
        </Container>
    )

}