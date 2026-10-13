import { useState, useEffect } from "react";
import TragoviService from "../../services/tragovi/TragoviService";
import { RouteNames } from "../../constants";
import { Badge, Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {tragovi} from "../../services/tragovi/TragoviPodaci";

export default function TragoviPregled() {
  const [tragovi, setTragovi] = useState([])
  const navigate = useNavigate()

  async function ucitajTragove() {
    await TragoviService.get().then((odgovor) => {
      setTragovi(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajTragove()
  }, [])


  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await TragoviService.obrisi(id)
    ucitajTragove()
  }

  return (
    <div className="container my-4">
      <Link to={RouteNames.TRAG_NOVI}
        className="btn btn-secondary w-100 my-2">
        Dodaj novi trag
      </Link>

      <Table hover bordered responsive="sm">
        <thead>
          <tr>
            <th>Prijava</th>
            <th>Korisnik</th>
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
              <td>{trag.korisnik}</td>
              <td>{trag.opis}</td>
              <td>{trag.lokacija_opis}</td>
              <td>{trag.datum ? trag.datum.replace('T', ' ') : ''}</td>
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
          ))}
        </tbody>
      </Table>
      Ukupno &nbsp;
      <Badge pill bg="secondary">
        {tragovi && tragovi.length}
      </Badge> &nbsp; tragova
    </div>
  )
}