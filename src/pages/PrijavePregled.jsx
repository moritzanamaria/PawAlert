import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import prijaveService from "../services/prijaveService";
import { RouteNames, BojeStatusa } from "../constants";
import { Badge, Table } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa"

function PrijavePregled() {
  const [prijave, setPrijave] = useState([])

  useEffect(() => {
    ucitajPrijave()
  }, [])

  async function ucitajPrijave() {
    await prijaveService.get().then((odgovor) => {
      setPrijave(odgovor.data)
    })
  }
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
          </tr>
        </thead>
        <tbody>
          {prijave && prijave.map((prijava) => (
            <tr key={prijava.id}
              className={prijava.hitno ? "table-danger" : ""}
            >
              <td>
                {prijava.hitno && (
                  <FaExclamationTriangle className="text-danger me-1" title="Hitno" />
                )}
                {prijava.zivotinja_ime}</td>
              <td>{prijava.zivotinja_vrsta}</td>
              <td>{prijava.lokacija_opis}</td>
              <td>{prijava.datum}</td>
              <td>
                <span className={`badge ${getStatusBadge(prijava.status)}`}>{prijava.status}</span>
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