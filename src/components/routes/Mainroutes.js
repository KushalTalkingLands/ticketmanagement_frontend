import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../homepage/Homepage";
import Ticket from "../newticket/Newticket";

const Routes=()=>{
    return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/tickets/:id" element={<Ticket />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}