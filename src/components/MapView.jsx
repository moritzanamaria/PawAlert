import { MapContainer, TileLayer} from "react-leaflet";
import { CENTAR_OSIJEK} from "../constants";
import "leaflet/dist/leaflet.css";

function MapView() {
  return (
    
      <div className="card-body p-0">
        <MapContainer center={CENTAR_OSIJEK} zoom={13} style={{ height: "550px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    
  );
}

export default MapView