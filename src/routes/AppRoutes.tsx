import { Routes, Route } from "react-router-dom";

// EVENTS
import EventsHome from "../modules/events/pages/EventsHome";
import EventDetail from "../modules/events/pages/EventDetail";
import EventCreate from "../modules/events/pages/EventCreate";
import EventEdit from "../modules/events/pages/EventEdit";

// USERS
import Login from "../modules/users/pages/Login";
import Register from "../modules/users/pages/Register";
import ProfilePage from "../modules/users/pages/ProfilePage";

// CHAT
import MessagesList from "../modules/messages/pages/MessageList";
import ChatPage from "../modules/messages/pages/ChatPage";

// OPTIONS
import OptionsPage from "../modules/users/pages/OptionsPage";

// ROUTING
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

      {/* EDIT EVENTO (solo loggati) */}
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <EventEdit />
          </ProtectedRoute>
        }
      />

      {/* CHAT (solo loggati) */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages/:id"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* PROFILO (solo loggati) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* OPZIONI (solo loggati) */}
      <Route
        path="/options"
        element={
          <ProtectedRoute>
            <OptionsPage />
          </ProtectedRoute>
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
