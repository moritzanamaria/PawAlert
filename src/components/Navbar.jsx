import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <Link to="/">Početna</Link>
            <Link to="/prijave">Katalog</Link>
            <Link to="/prijavi-slucaj">Prijavi slučaj</Link>
            <Link to="/profil">Profil</Link>
            <Link to="/registracija">Registracija</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button>Prijava</button>
        </nav>
    )
}

export default Navbar