import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import prijaveService from "../services/prijaveService";
import { RouteNames, BojeStatusa } from "../constants";
import { Badge, Table } from "react-bootstrap";


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

    return  (
     <>
            <Table hover bordered>
              <thead>
                <tr>
                  <th>Životinja</th>
                  <th>Tip prijave</th>
                  <th>Status</th>
                  <th>Lokacija</th>
                  <th>Vrijeme prijave</th>
                </tr>
              </thead>
              <tbody>
                {prijave && prijave.map((prijava) => (
                <tr key={prijava.id}>
                  <td>{prijava.zivotinja}</td>
                  <td>{prijava.tip_prijave}</td>
                  <td>{prijava.status}</td>
                  <td>{prijava.lokacija_opis}</td>
                  <td>{prijava.datum}</td>
                    
                        </tr>
                    ))}
                </tbody>
            </Table>
            Ukupno  
            <Badge pill bg="info">
        {prijave && prijave.length}
      </Badge> prijava
            {/* <pre>
            {JSON.stringify(prijave, null, 2)}
            </pre> */}

        </>
    )
  }
export default PrijavePregled;