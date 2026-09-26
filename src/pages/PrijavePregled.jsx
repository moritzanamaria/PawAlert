import { useState, useEffect } from "react";
import prijaveService from "../services/prijaveService";
import { BojeStatusa } from "../constants";
import { Badge, Table } from "react-bootstrap";
import FormatDatuma from "../components/FormatDatuma";
import { GrAlert } from "react-icons/gr";

function PrijavePregled() {
  const [prijave, setPrijave] = useState([])
  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data)
    })    
  }

   useEffect(() => {
    ucitajPrijave()
  }, [])

  
  const getStatusBadge = (status) => BojeStatusa[status] || "bg-secondary";
  return (
    <div className="container my-4">
      <Table hover bordered responsive="sm">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Vrsta</th>
            <th>Lokacija</th>
            <th>Vrijeme prijave</th>
            <th>Status</th>
             <th>Hitno</th>
          </tr>
        </thead>
        <tbody>
          {prijave && prijave.map((prijava) => (
            <tr key={prijava.id}>
              <td>{prijava.zivotinja_ime}</td>
              <td className="text-end">{prijava.zivotinja_vrsta}</td>
              <td className="desno">{prijava.lokacija_opis}</td>
              <td style={{textAlign: "center"}}>
                 <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                 </td>
              <td>
                <span className={`badge ${getStatusBadge(prijava.status)}`}>{prijava.status}</span>
              </td>
              <td>
              <GrAlert
        size={25}
        color={prijava.hitno ? 'red' : 'grey'}
        title={prijava.hitno ? 'Hitno' : 'Nije hitno'}
    />
    </td>
            </tr>
          ))}
        </tbody>
      </Table>
      Ukupno &nbsp;
      <Badge pill bg="secondary">
        {prijave && prijave.length}
      </Badge> &nbsp; prijava
    </div>

  )
}
export default PrijavePregled;