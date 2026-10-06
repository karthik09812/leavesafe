import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import useGeofence from "../hooks/useGeofence";
import { playAlarm, askNotificationPermission, showNotification } from "../utils/alert";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [settings, setSettings] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    api.get("/checklist").then((res) => setItems(res.data));
    api.get("/settings").then((res) => setSettings(res.data));
  }, []);

  const home = settings?.homeLat != null ? { lat: settings.homeLat, lng: settings.homeLng } : null;
  const unchecked = items.filter((i) => !i.checked);

  // Runs when the user crosses the boundary
  const handleExit = () => {
    if (unchecked.length === 0) return;
    const names = unchecked.map((i) => i.name).join(", ");
    setAlertMsg(`You left without: ${names}`);
    playAlarm();
    showNotification("Did you forget something?", `You left without: ${names}`);
  };

  const { distance, inside, error } = useGeofence({
    enabled: tracking,
    home,
    radius: settings?.radius || 100,
    onExit: handleExit,
  });

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const res = await api.post("/checklist", { name: newItem });
    setItems([...items, res.data]);
    setNewItem("");
  };

  const toggleItem = async (item) => {
    const res = await api.patch(`/checklist/${item._id}`, { checked: !item.checked });
    setItems(items.map((i) => (i._id === item._id ? res.data : i)));
  };

  const deleteItem = async (id) => {
    await api.delete(`/checklist/${id}`);
    setItems(items.filter((i) => i._id !== id));
  };

  const resetAll = async () => {
    await api.patch("/checklist/reset");
    setItems(items.map((i) => ({ ...i, checked: false })));
    setAlertMsg("");
  };

  const toggleTracking = async () => {
    if (!tracking) await askNotificationPermission();
    setTracking(!tracking);
    setAlertMsg("");
  };

  return (
    <div className="row g-4">
      <div className="col-md-7">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Before you leave</h3>
          <button className="btn btn-sm btn-outline-secondary" onClick={resetAll}>Reset checklist</button>
        </div>

        <form onSubmit={addItem} className="input-group mb-3">
          <input className="form-control" placeholder="Add an item (e.g. Keys, ID card)"
            value={newItem} onChange={(e) => setNewItem(e.target.value)} />
          <button className="btn btn-primary">Add</button>
        </form>

        {items.length === 0 && <p className="text-muted">Your checklist is empty.</p>}
        <ul className="list-group">
          {items.map((item) => (
            <li key={item._id} className="list-group-item d-flex align-items-center">
              <input type="checkbox" className="form-check-input me-3" checked={item.checked}
                onChange={() => toggleItem(item)} />
              <span className={item.checked ? "text-decoration-line-through text-muted" : ""}>{item.name}</span>
              <button className="btn btn-sm btn-link text-danger ms-auto" onClick={() => deleteItem(item._id)}>Remove</button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-muted small">{unchecked.length} of {items.length} items not yet checked</p>
      </div>

      <div className="col-md-5">
        <div className="card">
          <div className="card-body">
            <h5>Location tracking</h5>
            {!home ? (
              <p>Set your <Link to="/settings">home location</Link> first.</p>
            ) : (
              <>
                <button className={`btn w-100 mb-3 ${tracking ? "btn-danger" : "btn-success"}`} onClick={toggleTracking}>
                  {tracking ? "Stop tracking" : "Start tracking"}
                </button>
                {tracking && (
                  <>
                    <p className="mb-1">Status: {inside == null ? "Getting location..." : inside ? "Inside home boundary" : "Outside home boundary"}</p>
                    {distance != null && <p className="mb-1">Distance from home: {Math.round(distance)} m</p>}
                    <p className="text-muted small">Boundary radius: {settings.radius} m. Keep this page open while tracking.</p>
                  </>
                )}
                {error && <div className="alert alert-warning small">{error}</div>}
              </>
            )}
          </div>
        </div>
        {alertMsg && <div className="alert alert-danger mt-3 fw-bold">{alertMsg}</div>}
      </div>
    </div>
  );
}
