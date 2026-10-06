import { useState, useEffect } from "react";
import TipService from "../../services/tip/TipService";
import { RouteNames } from "../../constants";
import { Badge, Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function TipoviPregled() {
  const [tipovi, setTipovi] = useState([])
  const navigate = useNavigate()

  async function ucitajTipove() {
    await TipService.get().then((odgovor) => {
      setTipovi(odgovor.data)
    })
  }

  useEffect(() => {
    ucitajTipove()
  }, [])

  async function obrisi(id) {
    if (!confirm('Sigurno obrisati?')) {
      return
    }

    await TipService.obrisi(id)
    ucitajTipove()
  }

  return (
    <div className="container my-4">
      <Link to={RouteNames.TIP_NOVI}
        className="btn btn-secondary w-100 my-2">
        Dodaj novi tip
      </Link>

      <Table hover bordered responsive="sm">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {tipovi && tipovi.map((tip) => (
            <tr key={tip.id}>
              <td>{tip.naziv}</td>
              <td>
                <Button onClick={() => { navigate(`/tip/${tip.id}`) }}>
                  Promjena
                </Button>
                &nbsp; &nbsp;
                <Button variant="danger" onClick={() => obrisi(tip.id)}>
                  Obriši
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      Ukupno &nbsp;
      <Badge pill bg="secondary">
        {tipovi && tipovi.length}
      </Badge> &nbsp; tipova
    </div>
  )
}