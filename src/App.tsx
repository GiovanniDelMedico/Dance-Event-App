import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsList from "./pages/EventList";
import EventCreate from "./pages/EventCreate";
import EventEdit from "./pages/EventEdit";


function App() {
  return (
    <BrowserRouter>
   
      <Routes>
       
        <Route path="/" element={<EventsList />} />
        <Route path="/create"  element={<EventCreate/>}/>
        <Route path="/events/:id/edit" element={<EventEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
