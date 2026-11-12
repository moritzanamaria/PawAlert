import { useEffect, useState } from "react"
import OperaterService from "../../services/operateri/OperaterService"
import { Table, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { FaEdit, FaTrash, FaKey } from "react-icons/fa"

export default function OperaterPregled() {

    const navigate = useNavigate()
    const [operateri, setOperateri] = useState([])

    useEffect(() => {
        ucitajOperatere()
    }, [])

    async function ucitajOperatere() {
        await OperaterService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setOperateri(odgovor.data)
        })
    }

    async function brisanje(id) {
        if (!confirm('Sigurno obrisati operatera?')) return
        
        const rezultat = await OperaterService.obrisi(id)
        if (rezultat.success) {
            ucitajOperatere()
        } else {
            alert(rezultat.message || 'Greška pri brisanju')
        }
    }

    return (
        <>
            <Link to={RouteNames.OPERATERI_NOVI}
                className="btn btn-success w-100 my-3">
                Dodavanje novog operatera
            </Link>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Uloga</th>
                        <th className="text-center" style={{width: '200px'}}>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {operateri && operateri.map((operater) => (
                        <tr key={operater.id}>
                            <td>{operater.email}</td>
                            <td>
                                <span className={`badge ${operater.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                    {operater.uloga}
                                </span>
                            </td>
                            <td className="text-center">
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => navigate(`/operateri/${operater.id}`)}
                                        title="Promjeni email"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => navigate(`/operateri/${operater.id}/lozinka`)}
                                        title="Promjeni lozinku"
                                    >
                                        <FaKey />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => brisanje(operater.id)}
                                        title="Obriši"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}