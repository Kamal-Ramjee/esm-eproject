import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ExhibitorProfile from './pages/ExhibitorProfile';
import BoothManagement from './pages/BoothManagement';
import RegisteredExpos from './pages/RegisteredExpos';
import AttendeeSchedule from './pages/AttendeeSchedule';
import EventSchedule from './pages/EventSchedule';
import EventAdminBooths from './pages/EventAdminBooths';
import ExpoDetails from './pages/ExpoDetails';
import AttendeeEventHub from './pages/AttendeeEventHub';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/expo/:id" element={<ExpoDetails />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          {/* Admin Routes */}
          <Route path="events" element={<Events />} />
          <Route path="events/:id/schedule" element={<EventSchedule />} />
          <Route path="events/:id/booths" element={<EventAdminBooths />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />

          {/* Exhibitor Routes */}
          <Route path="profile" element={<ExhibitorProfile />} />
          <Route path="my-booth" element={<BoothManagement />} />
          <Route path="registered-expos" element={<RegisteredExpos />} />

          {/* Attendee Routes */}
          <Route path="browse-events" element={<Events />} />
          <Route path="my-schedule" element={<AttendeeSchedule />} />

          <Route path="expo/:id/hub" element={<AttendeeEventHub />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen font-bold text-slate-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;