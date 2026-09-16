import { BrowserRouter, Routes, Route } from "react-router-dom"
import Pocetna from "./pages/Pocetna"
import Prijave from "./pages/Prijave"
import DetaljiSlucaja from "./pages/DetaljiSlucaja"
import PrijaviSlucaj from "./pages/PrijaviSlucaj"
import Profil from "./pages/Profil"
import Registracija from "./pages/Registracija"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/prijave" element={<Prijave />} />
        <Route path="/prijave/ :id" element={<DetaljiSlucaja />} />
        <Route path="/prijavi-slucaj" element={<PrijaviSlucaj />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/registracija" element={<Registracija />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
