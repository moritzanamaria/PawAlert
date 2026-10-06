import { useState, useEffect } from "react";
import VrsteService from "../../services/vrste/VrsteService";
import { RouteNames } from "../../constants";
import { Badge, Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import VrstePodaci from "../../services/vrste/VrstePodaci";

export default function VrstePregled() {
  const [vrste, setVrste] = useState([])
  const navigate = useNavigate()  

  async function ucitajVrste() {
    await VrsteService.get().then((odgovor) => {
      setVrste(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajVrste()
  }, [])

  return (
    <div className="container my-4">
      <Link to={RouteNames.VRSTA_NOVA}
        className="btn btn-secondary w-100">
        Dodaj novu vrstu
      </Link>

      <Table hover bordered responsive="sm">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {vrste && vrste.map((vrsta) => (
            <tr key={vrsta.id}>
              <td>{vrsta.naziv}</td>
              <td>
                <Button onClick={() => {navigate(`/vrste/${vrsta.id}`) }}>
                  Promjena
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      Ukupno &nbsp;
      <Badge pill bg="secondary">
        {vrste && vrste.length}
      </Badge> &nbsp; vrsta
    </div>
  )
}