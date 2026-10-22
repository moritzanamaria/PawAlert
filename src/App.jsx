import { Routes, Route } from "react-router-dom"
import Pocetna from "./pages/Home"
import PrijavePregled from "./pages/prijave/PrijavePregled"
import PrijavaNova from "./pages/prijave/PrijavaNova"
import PrijavaPromjena from "./pages/prijave/PrijavaPromjena"
import TipoviIVrstePregled from "./pages/tipovi_vrste/TipoviIVrstePregled"
import TipNovi from "./pages/tipovi_vrste/TipNovi"
import TipPromjena from "./pages/tipovi_vrste/TipPromjena"
import VrstaNova from "./pages/tipovi_vrste/VrstaNova"
import VrstaPromjena from "./pages/tipovi_vrste/VrstaPromjena"
import TragPregled from "./pages/tragovi/TragPregled"
import TragNovi from "./pages/tragovi/TragNovi"
import TragPromjena from "./pages/tragovi/TragPromjena"

import Navbar from "./components/Navbar"
import { IME_APLIKACIJE, RouteNames } from "./constants"
import Katalog from "./pages/Katalog"
import DetaljiSlucaja from "./pages/DetaljiSlucaja"
import GeneriranjePodataka from "./pages/GeneriranjePodataka"
import ScrollToTop from "./components/ScrollToTop";


export default function App() {
  return (
    <div className="container my-1">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path={RouteNames.HOME} element={<Pocetna />} />
        <Route path={RouteNames.KATALOG} element={<Katalog />} />
        <Route path={RouteNames.DETALJI_SLUCAJA} element={<DetaljiSlucaja />} />
        <Route path={RouteNames.PRIJAVE_PREGLED} element={<PrijavePregled />} />
        <Route path={RouteNames.PRIJAVA_NOVA} element={<PrijavaNova />} />
        <Route path={RouteNames.PRIJAVA_PROMJENA} element={<PrijavaPromjena />} />
        <Route path={RouteNames.TIPOVI_I_VRSTE_PREGLED} element={<TipoviIVrstePregled />} />
        <Route path={RouteNames.TIP_NOVI} element={<TipNovi />} />
        <Route path={RouteNames.TIP_PROMJENA} element={<TipPromjena />} />
        <Route path={RouteNames.VRSTA_NOVA} element={<VrstaNova />} />
        <Route path={RouteNames.VRSTA_PROMJENA} element={<VrstaPromjena />} />
        <Route path={RouteNames.TRAG_PREGLED} element={<TragPregled />} />
        <Route path={RouteNames.TRAG_NOVI} element={<TragNovi />} />
        <Route path={RouteNames.TRAG_PROMJENA} element={<TragPromjena />} />
        <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<GeneriranjePodataka />} />
      </Routes>

      <hr />
      <div> &copy; {IME_APLIKACIJE}
      </div>
    </div>
  )
}
