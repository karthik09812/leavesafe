import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import api from "../api";

const DEFAULT_CENTER = [20.5937, 78.9629]; // centre of India

// Lets the user click the map to choose home
function ClickToSet({ onPick }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

// Moves the map when the home location changes
function Recenter({ home }) {
  const map = useMap();
  useEffect(() => { if (home) map.setView([home.lat, home.lng], 17); }, [home, map]);
  return null;
}

export default function Settings() {
  const [home, setHome] = useState(null);
  const [radius, setRadius] = useState(100);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    api.get("/settings").then(({ data }) => {
      if (data.homeLat != null) setHome({ lat: data.homeLat, lng: data.homeLng });
      setRadius(data.radius);
    });
  }, []);

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setHome({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setMsg({ type: "danger", text: err.message }),
      { enableHighAccuracy: true }
    );
  };

  const save = async () => {
    try {
      await api.put("/settings", { homeLat: home.lat, homeLng: home.lng, radius });
      setMsg({ type: "success", text: "Home location saved" });
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Could not save" });
    }
  };

  return (
    <>
      <h3>Home location</h3>
      <p className="text-muted">Click on the map to set your home, or use your current location.</p>

      <MapContainer center={home ? [home.lat, home.lng] : DEFAULT_CENTER} zoom={home ? 17 : 5}
        style={{ height: 400, borderRadius: 8 }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickToSet onPick={setHome} />
        <Recenter home={home} />
        {home && (
          <>
            <CircleMarker center={[home.lat, home.lng]} radius={8} pathOptions={{ color: "blue" }} />
            <Circle center={[home.lat, home.lng]} radius={radius} pathOptions={{ color: "red", fillOpacity: 0.1 }} />
          </>
        )}
      </MapContainer>

      <div className="row g-3 mt-2 align-items-center">
        <div className="col-md-6">
          <label className="form-label">Boundary radius: {radius} m</label>
          <input type="range" className="form-range" min="30" max="1000" step="10"
            value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
        </div>
        <div className="col-md-6 d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={useCurrentLocation}>Use my current location</button>
          <button className="btn btn-primary" disabled={!home} onClick={save}>Save</button>
        </div>
      </div>
      {msg.text && <div className={`alert alert-${msg.type} mt-3`}>{msg.text}</div>}
    </>
  );
}
