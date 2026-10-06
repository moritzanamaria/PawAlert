import { useState, useEffect } from "react";
import prijaveService from "../../services/prijave/prijaveService";
import { RouteNames } from "../../constants";
import { Badge, Button, Container, Table } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
import { GrAlert } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";

export default function PrijavePregled() {
  const [prijave, setPrijave] = useState([])
  const navigate = useNavigate()
  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajPrijave()
  }, [])


  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await prijaveService.obrisi(id)
    ucitajPrijave()
  }


  return (
    <Container>
      <Link to={RouteNames.PRIJAVA_NOVA}
        className="btn btn-secondary w-100 my-2">
        Dodaj novu prijavu
      </Link>

      <Table hover bordered responsive>
        <thead>
          <tr>
            <th>Ime</th>
            <th>Vrsta</th>
            <th>Lokacija</th>
            <th>Vrijeme prijave</th>
            <th>Tip prijave</th>
            <th>Status</th>
            <th>Hitno</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {prijave && prijave.map((prijava) => (
            <tr key={prijava.id}>
              <td>{prijava.zivotinja_ime}</td>
              <td>{prijava.zivotinja_vrsta}</td>
              <td>{prijava.lokacija_opis}</td>
              <td style={{ textAlign: "center" }}>
                <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
              </td>
              <td>{prijava.tip_prijave}</td>
              <td>{prijava.status}</td>
              <td>
                <GrAlert
                  size={25}
                  color={prijava.hitno ? 'red' : 'grey'}
                  title={prijava.hitno ? 'Hitno' : 'Nije hitno'}
                />
              </td>
              <td>
                <Button onClick={() => { navigate(`/prijave/${prijava.id}`) }}>
                  Promjena
                </Button>
                &nbsp; &nbsp;
                <Button variant="danger" onClick={() => obrisi(prijava.id)}>
                  Obriši
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      Ukupno &nbsp;
      <Badge pill bg="secondary">
        {prijave && prijave.length}
      </Badge> &nbsp; prijava
    </Container>
  )
}
