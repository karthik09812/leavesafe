# LeaveSafe – Location-Based Departure Reminder

Never leave home without your keys again. LeaveSafe lets you keep a checklist of things to carry, set a boundary around your home on a map, and raises an alarm if you cross that boundary with items still unchecked.

## Features
- Register and login with JWT authentication (passwords hashed with bcrypt)
- Personal checklist: add, tick, remove and reset items
- Set home location by clicking on a Leaflet map or using your current location, with an adjustable boundary radius (30–1000 m)
- Live location tracking with the browser Geolocation API (`watchPosition`)
- Distance from home calculated with the Haversine formula
- When you move from inside to outside the boundary with unchecked items, the app plays an alarm and shows a browser notification
- Inaccurate GPS readings are ignored to avoid false alarms

## How the boundary check works
1. `watchPosition` sends a new location every few seconds.
2. The Haversine formula gives the distance between home and the current point.
3. If distance <= radius, the user is inside; otherwise outside.
4. The alarm fires only on the change from inside to outside, not on every update.

## Limitation
Browsers only share location while the page is open, so the tab must stay open while tracking. Tracking in the background would need a mobile app (for example React Native with background location).

## Tech stack
MongoDB, Express.js, React.js (Vite), Node.js, JWT, bcrypt, Leaflet.js / React-Leaflet, OpenStreetMap, Geolocation API, Notification API, Web Audio API, Bootstrap

## Project structure
```
server/
  models/      User, ChecklistItem, Settings
  middleware/  auth.js (JWT check)
  routes/      auth, checklist, settings
client/
  src/pages/   Login, Register, Dashboard, Settings
  src/hooks/   useGeofence.js (live tracking + boundary check)
  src/utils/   geo.js (Haversine), alert.js (alarm + notification)
```

## API
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/checklist | My checklist |
| POST | /api/checklist | Add item |
| PATCH | /api/checklist/:id | Tick or untick item |
| PATCH | /api/checklist/reset | Untick all items |
| DELETE | /api/checklist/:id | Remove item |
| GET | /api/settings | Home location and radius |
| PUT | /api/settings | Save home location and radius |

## Run locally
1. Create a free MongoDB Atlas cluster.
2. Server:
   ```
   cd server
   npm install
   cp .env.example .env     # then fill in your values
   npm run dev
   ```
3. Client (in a new terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173 and allow location and notification access.

Note: browsers allow location only on `localhost` or HTTPS, so deploy the client on an HTTPS host such as Vercel.
