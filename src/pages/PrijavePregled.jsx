import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import prijaveService from "../services/prijaveService";
import { RouteNames, BojeStatusa } from "../constants";


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
            Ovdje dođe pregled prijava
            <hr />
            <pre>
            {JSON.stringify(prijave, null, 2)}
            </pre>
        </>
    )
  }
export default PrijavePregled;