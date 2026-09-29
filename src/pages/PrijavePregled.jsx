import { useState, useEffect } from "react";
import prijaveService from "../services/prijaveService";
import { BojeStatusa, RouteNames } from "../constants";
import { Badge, Table } from "react-bootstrap";
import FormatDatuma from "../components/FormatDatuma";
import { GrAlert } from "react-icons/gr";
import { Link } from "react-router-dom";

export default function PrijavePregled() {
  const [prijave, setPrijave] = useState([])

  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data)
    })    
  }

   useEffect(() => {
    ucitajPrijave()
  }, [])

  
  
  return (
    <>
    <Link to={RouteNames.PRIJAVA_NOVA}
    className="btn btn-secondary w-100">
      Dodaj novu prijavu
    </Link>
    
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
              <td>{prijava.lokacija_opis}</td>
              <td style={{textAlign: "center"}}>
                 <FormatDatuma datum={prijava.datum} prikazDatuma="Nepoznato" />
                 </td>
              <td>{prijava.status}</td>
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
    </>
  )
}
