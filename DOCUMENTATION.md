# Technical Documentation: EventSphere Management

This document provides deep technical insights into the architecture, API design, and internal logic of the EventSphere Management system.

---

## 1. Directory Structure

### **Backend**
- `/src/config`: Database connection logic.
- `/src/controllers`: Request handlers (Business Logic).
- `/src/middleware`: Auth (JWT), role-validation, and error handling.
- `/src/models`: Mongoose schemas for User, Expo, Booth, Session, and Registration.
- `/src/routes`: Express router definitions.

### **Frontend**
- `/src/components`: Global UI elements (Sidebar, Navbar, Cards).
- `/src/layouts`: Dashboard and Public wrappers.
- `/src/pages`: Feature-specific views (Landing, Hub, Dashboards).
- `/src/styles`: Tailwind configuration and global CSS.

---

## 2. API Reference

### **Authentication (`/api/auth`)**
- `POST /register`: Create a new user (admin, exhibitor, or attendee).
- `POST /login`: authenticate user and return JWT + User data.
- `GET /profile`: Get current logged-in user details.

### **Expos & Events (`/api/expos`)**
- `GET /`: List all expos.
- `GET /:id`: Detailed expo data + booths + sessions.
- `POST /`: (Admin) Create a new expo.
- `PUT /:id`: (Admin) Update expo details.
- `DELETE /:id`: (Admin) Remove expo.

### **Attendee Operations (`/api/attendees`)**
- `GET /registrations`: Fetch all events the current user is registered for.
- `POST /expo/:id/register`: Join an expo.
- `DELETE /expo/:id/cancel`: Cancel registration, unassign booths, and remove bookmarks.
- `POST /session/:id/bookmark`: Toggle session attendance in personal schedule.
- `GET /expo/:expoId/status`: Check current user's role/details for a specific event.

### **Exhibition Management (`/api/expos/booth`)**
- `GET /:id/booths`: Fetch all booths for an expo.
- `PUT /booth/:boothId`: Update booth details (products, titles).
- `PUT /booth/:boothId/request`: (Exhibitor) Request to occupy a specific booth.
- `GET /booths/mine`: List booths assigned to the current exhibitor.

---

## 3. Advanced Implementation Details

### **Parallel Data Synchronization**
The `ExpoDetails.jsx` and `AttendeeEventHub.jsx` pages use `Promise.all` to fetch data concurrently. This ensures that the page title, the floor plan, and the session list all load simultaneously, preventing UI "flicker."

```javascript
const [expoRes, boothRes, sessionRes] = await Promise.all([
    axios.get(`/api/expos/${id}`),
    axios.get(`/api/expos/${id}/booths`),
    axios.get(`/api/sessions/${id}`)
]);
```

### **The "Booth-Registration" Linkage**
A unique architectural pattern is used to track participation:
1. When a user registers, a `Registration` record is created.
2. If the user is an `exhibitor`, they then interact with the `Booth` model.
3. The `Booth` model stores the `exhibitor` ID.
4. If a registration is cancelled via `attendeeController.cancelRegistration`, the system automatically runs a cleanup query to set any `Booth` occupied by that user back to `available`.

### **Real-time Engine**
Socket.io is integrated into the root `index.js`. While currently used for infrastructure signaling, it's designed to support:
- **Live Notifications**: When a session room changes.
- **Booth Heatmaps**: Real-time occupancy visualization.
- **Chat**: Between exhibitors and attendees.

---

## 4. Environment Variables
Ensure the following are set in the backend environment:
- `MONGO_URI`: The MongoDB connection string.
- `JWT_SECRET`: A secure string for token signing.
- `PORT`: (Default 5000).

---

## 5. Deployment Guide

### **Frontend (Vite)**
Run `npm run build`. The output folder `/dist` can be hosted on Vercel, Netlify, or AWS S3.

### **Backend (Express)**
Ensure `NODE_ENV=production` is set. Can be deployed via Heroku, Railway, or a custom VPS using PM2.

---

© 2026 **EventSphere Management**. Technical Maintenance Team.
