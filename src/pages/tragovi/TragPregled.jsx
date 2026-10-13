import { useState, useEffect } from "react";
import TragoviService from "../../services/tragovi/TragoviService";
import { RouteNames } from "../../constants";
import { Badge, Button, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormatDatuma from "../../components/FormatDatuma";

export default function TragPregled() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [tragovi, setTragovi] = useState([])


  async function ucitajTragove() {
    await TragoviService.getByPrijava(id).then((odgovor) => {
      setTragovi(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajTragove()
  }, [id])


  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await TragoviService.obrisi(id)
    ucitajTragove()
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tragovi za prijavu {id} </h3>
        <Link to={`/prijave/${id}/tragovi/dodaj`}
          className="btn btn-secondary w-100 my-2">
          Dodaj novi trag
        </Link>
      </div>

      <Table hover bordered responsive="sm">
        <thead>
          <tr>
            <th>Prijava</th>
            <th>Opis</th>
            <th>Lokacija</th>
            <th>Datum</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {tragovi && tragovi.map((trag) => (
              <tr key={trag.id}>
                <td>{trag.prijava}</td>
                <td>{trag.opis}</td>
                <td>{trag.lokacija_opis}</td>
                <td>
                  <FormatDatuma datum={trag.datum} />
                </td>
                <td>
                  <Button onClick={() => { navigate(`/tragovi/${trag.id}`) }}>
                    Promjena
                  </Button>
                  &nbsp; &nbsp;
                  <Button variant="danger" onClick={() => obrisi(trag.id)}>
                    Obriši
                  </Button>
                </td>
              </tr>
            )
         )}
        </tbody>
      </Table>
      <div>
        Ukupno &nbsp;
        <Badge pill bg="secondary">
          {tragovi && tragovi.length}
        </Badge> &nbsp; tragova
        &nbsp;
        <br />
        <Link to={RouteNames.PRIJAVE_PREGLED} className="btn btn-secondary mt-3">
          Natrag na prijave
        </Link>
      </div>
    </div>
  )
}