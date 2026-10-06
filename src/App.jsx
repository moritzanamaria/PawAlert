import { Routes, Route } from "react-router-dom"
import Pocetna from "./pages/Home"
import PrijavePregled from "./pages/prijave/PrijavePregled"
import PrijavaNova from "./pages/prijave/PrijavaNova"
import PrijavaPromjena from "./pages/prijave/PrijavaPromjena"
import TipoviPregled from "./pages/tipovi/TipoviPregled"
import TipNovi from "./pages/tipovi/TipNovi"
import TipPromjena from "./pages/tipovi/TipPromjena"
import VrstePregled from "./pages/vrste/VrstePregled"
import VrstaNova from "./pages/vrste/VrstaNova"
import VrstaPromjena from "./pages/vrste/VrstaPromjena"
import KatalogPrijava from "./pages/KatalogPrijava"
import Profil from "./pages/Profil"
import Registracija from "./pages/Registracija"
import Navbar from "./components/Navbar"
import { RouteNames } from "./constants"


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={RouteNames.HOME} element={<Pocetna />} />
        <Route path={RouteNames.PRIJAVE_PREGLED} element={<PrijavePregled />} />
        <Route path={RouteNames.PRIJAVA_NOVA} element={<PrijavaNova />} />
        <Route path={RouteNames.PRIJAVA_PROMJENA} element={<PrijavaPromjena />} />
        <Route path={RouteNames.TIPOVI_PREGLED} element={<TipoviPregled />} />
        <Route path={RouteNames.TIP_NOVI} element={<TipNovi />} />
        <Route path={RouteNames.TIP_PROMJENA} element={<TipPromjena />} />
        <Route path={RouteNames.VRSTE_PREGLED} element={<VrstePregled />} />
        <Route path={RouteNames.VRSTA_NOVA} element={<VrstaNova />} />
        <Route path={RouteNames.VRSTA_PROMJENA} element={<VrstaPromjena />} />
        <Route path={RouteNames.KATALOG_PRIJAVA} element={<KatalogPrijava />} />
        <Route path={RouteNames.PROFIL} element={<Profil />} />
        <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
      </Routes>
    </>
  )
}
