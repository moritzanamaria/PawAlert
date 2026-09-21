import { BrowserRouter, Routes, Route } from "react-router-dom"
import Pocetna from "./pages/Home"
import Prijave from "./pages/Prijave"
import DetaljiSlucaja from "./pages/DetaljiSlucaja"
import PrijaviSlucaj from "./pages/PrijaviSlucaj"
import Profil from "./pages/Profil"
import Registracija from "./pages/Registracija"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"
import { RouteNames } from "./constants"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={RouteNames.HOME} element={<Pocetna />} />
        <Route path={RouteNames.PRIJAVE} element={<Prijave />} />
        <Route path={RouteNames.DETALJI_SLUCAJA} element={<DetaljiSlucaja />} />
        <Route path={RouteNames.PRIJAVI_SLUCAJ} element={<PrijaviSlucaj />} />
        <Route path={RouteNames.DASHBOARD} element={<Dashboard />} />
        <Route path={RouteNames.PROFIL} element={<Profil />} />
        <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
      </Routes>
    </>
  )
}
export default App
