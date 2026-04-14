import { Routes, Route } from "react-router-dom";

import EventsHome from "../modules/events/pages/EventsHome";
import EventDetail from "../modules/events/pages/EventDetail";
import EventCreate from "../modules/events/pages/EventCreate";
import EventEdit from "../modules/events/pages/EventEdit";

import Login from "../modules/users/pages/Login";
import Register from "../modules/users/pages/Register";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME / LISTA EVENTI */}
      <Route path="/" element={<EventsHome />} />
      <Route path="/events" element={<EventsHome />} />

      {/* DETTAGLIO EVENTO */}
      <Route path="/events/:id" element={<EventDetail />} />

      {/* CREA EVENTO (solo loggati) */}
      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <EventCreate />
          </ProtectedRoute>
        }
      />

      {/* EDIT EVENTO (solo loggati, controllo creator dentro EventEdit) */}
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <EventEdit />
          </ProtectedRoute>
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
