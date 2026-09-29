import { Routes, Route } from "react-router-dom"
import Pocetna from "./pages/Home"
import PrijavePregled from "./pages/PrijavePregled"
import PrijavaNova  from "./pages/PrijavaNova"
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
        <Route path={RouteNames.KATALOG_PRIJAVA} element={<KatalogPrijava />} />
        <Route path={RouteNames.PROFIL} element={<Profil />} />
        <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
      </Routes>
    </>
  )
}
