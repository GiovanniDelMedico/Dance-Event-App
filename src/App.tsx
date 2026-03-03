import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsList from "./pages/EventList";
import EventCreate from "./pages/EventCreate";


function App() {
  return (
    <BrowserRouter>
   
      <Routes>
       
        <Route path="/" element={<EventsList />} />
        <Route path="/create"  element={<EventCreate/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
