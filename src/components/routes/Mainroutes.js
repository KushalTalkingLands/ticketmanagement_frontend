import { Routes, Route } from "react-router-dom";
import HomePage from "../homepage/Homepage";
import Ticket from "../newticket/Newticket";
import Admin_dashboard from "../admin/admin_board/Adminboard";
import AdminSingleTicket from "../admin/admin-single-ticket/Adminsinglepage";

const MainRoutes=()=>{
    return(
      <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='tickets/:id' element={<Ticket/>}></Route>
      <Route path='/admin' element={<Admin_dashboard/>}></Route>
      <Route path='/admin/tickets/:id' element={<AdminSingleTicket/>}></Route>
    </Routes>
    );
}
export default MainRoutes;