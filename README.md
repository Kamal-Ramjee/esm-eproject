# EventSphere Management

**EventSphere Management** is a state-of-the-art, full-stack exhibition and conference management platform. Designed with a premium aesthetic and high-performance architecture, it bridges the gap between organizers, exhibitors, and attendees through a unified digital ecosystem.

---

## 🚀 Vision
To redefine the professional event experience by providing seamless registration, real-time schedule management, and interactive exhibition floor planning in a single, beautiful interface.

---

## 🛠 Tech Stack

### **Frontend**
- **Core**: React 19 + Vite
- **Styling**: Tailwind CSS 4 (with modern glassmorphism & gradients)
- **Animations**: Framer Motion
- **Icons**: Lucide React & FontAwesome
- **Routing**: React Router Dom 7
- **API Client**: Axios

### **Backend**
- **Runtime**: Node.js & Express
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.io (for live schedule & floor updates)
- **Security**: JWT (Authentication), Bcryptjs (Hashing), Helmet (Safe Headers)
- **Monitoring**: Morgan (logging)

---

## 🔑 Key Features

### **1. Public Interface**
- **Dynamic Landing Page**: High-impact visual design with smooth scroll animations.
- **Expo Details Page**: Real-time synced event details including rich metadata, speaker lineups, and session schedules.
- **Interactive Floor Plan**: A live-synced preview of the exhibition hall showing reserved vs. available booths.

### **2. Attendee Experience**
- **Event Discovery**: Browse upcoming global expos with advanced filtering.
- **Registration Hub**: One-click registration for events.
- **My Schedule**: Bookmark specific sessions and build a personal event itinerary.
- **Attendee Dashboard**: Manage all registered events and access private "Event Hubs" for live participation.
- **Registration Management**: Ability to cancel registrations and unassign associated booths/bookmarks.

### **3. Exhibitor Portal**
- **Brand Profiling**: Manage company title, description, and service category.
- **Booth Management**: Select specific booths from an interactive map and update showcased product data.
- **Onboarding Flow**: Streamlined exhibitor registration with industry-specific categorization.

### **4. Admin/Organizer Dashboard**
- **Global Analytics**: High-level stats on events, total attendees, and exhibitor participation.
- **Event Management**: CRUD operations for expos, including image uploads and date management.
- **Schedule Builder**: Manage sessions, speakers, and locations with live-sync capabilities.
- **Booth Allocation**: Real-time management of floor plans.
- **User Management**: Unified table to monitor all platform users and their roles.
- **Reporting**: Export platform metrics into professional CSV reports.

---

## 🏗 System Architecture

### **Database Models**
- `User`: Handles authentication, profiles, and role assignments (`admin`, `exhibitor`, `attendee`).
- `Expo`: Core event metadata (title, dates, location, image).
- `Booth`: Interactive space units within an expo, tracking status (`available`, `reserved`) and exhibitor assignments.
- `Session`: Individual scheduled items within an expo (talks, workshops, keynotes).
- `Registration`: Joiner model connecting Users to Expos, tracking specific role-based data (e.g., service type for exhibitors).

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18+)
- MongoDB (Local or Atlas)

### **Backend Setup**
1. Navigate to the `/backend` folder.
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Run in dev mode: `npm run dev`

### **Frontend Setup**
1. Navigate to the `/frontend` folder.
2. Install dependencies: `npm install`
3. Run in dev mode: `npm run dev` (Default: `http://localhost:5173`)

---

## 🛡 Security Practices
- **Role-Based Access Control (RBAC)**: Custom middleware ensures attendees cannot access admin charts or exhibitor booth settings.
- **Password Protection**: Salting and hashing with `bcryptjs`.
- **JWT Integrity**: Secure token-based authentication for all protected API calls.

---

## 🎨 Design Philosophy
The project follows a **Premium Dark/Light Hybrid** aesthetic:
- **Depth**: Sublte shadows and `backdrop-blur` for a glassmorphism effect.
- **Typography**: Heavy black weights for headings (e.g., `font-black`) contrasted with slate-gray UI text.
- **Accent**: Indigo-600 used as the primary action color to signify trust and professional innovation.

---

© 2026 **EventSphere Management Inc.** | Designed with Excellence.
