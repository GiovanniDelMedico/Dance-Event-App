import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsList from "./pages/EventList";
import EventCreate from "./pages/EventCreate";
import EventEdit from "./pages/EventEdit";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
   
      <Routes>
       
        <Route path="/" element={<EventsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create"  element={<EventCreate/>}/>
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:id/edit" element={<EventEdit />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
