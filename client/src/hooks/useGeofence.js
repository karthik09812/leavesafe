import { useEffect, useRef, useState } from "react";
import { haversineDistance } from "../utils/geo";

/**
 * Watches the user's live location and calls onExit() once when they move
 * from inside the home boundary to outside it.
 */
export default function useGeofence({ enabled, home, radius, onExit }) {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const wasInside = useRef(null); // null = we don't know yet
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    if (!enabled || !home) return;
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    wasInside.current = null;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPosition({ lat: latitude, lng: longitude, accuracy });
        setError("");

        // Ignore very inaccurate readings so a GPS jump doesn't cause a false alarm
        if (accuracy > Math.max(radius, 100)) return;

        const d = haversineDistance(home.lat, home.lng, latitude, longitude);
        setDistance(d);
        const inside = d <= radius;

        // Trigger only on the transition inside -> outside
        if (wasInside.current === true && !inside) onExitRef.current();
        wasInside.current = inside;
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, home?.lat, home?.lng, radius]);

  const inside = distance == null ? null : distance <= radius;
  return { position, distance, inside, error };
}
