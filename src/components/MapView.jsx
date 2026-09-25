import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { CENTAR_OSIJEK, BojeStatusa } from "../constants";
import { VrstaIkone } from "../utils/mapHelpers";
import "leaflet/dist/leaflet.css";

function MapView({ prijave }) {
  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="card-body p-0">
        <MapContainer center={CENTAR_OSIJEK} zoom={13} style={{ height: "550px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {prijave.map((prijava) => {
            const vrsta = prijava.zivotinja_vrsta?.toLowerCase();
            const status = prijava.status?.toLowerCase();

            return (
              <Marker
                key={prijava.id}
                position={[prijava.lokacija_lat, prijava.lokacija_lng]}
                icon={VrstaIkone[vrsta] || VrstaIkone.ostalo}
              >
                <Popup>
                  <div className="p-1" style={{ minWidth: "180px" }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="fw-bold m-0 text-primary">{prijava.zivotinja_ime}</h6>
                      <span className="badge bg-light text-dark border ms-1">
                        {prijava.zivotinja_vrsta}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="mb-2">
                      <small className="text-muted d-block">Tip prijave:</small>
                      <span className="fw-semibold text-capitalize">{prijava.tip_prijave}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-1 border-top">
                      <span className={`badge ${BojeStatusa[status] || "bg-secondary"}`}>
                        {prijava.status}
                      </span>
                      <Link
                        to={`/prijave/${prijava.id}`}
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Detalji
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView