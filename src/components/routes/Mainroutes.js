import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../homepage/Homepage";
import Ticket from "../newticket/Newticket";
import AdminDashboard from "../admin/admin_board/Adminboard";
import AdminSingleTicket from "../admin/admin-single-ticket/Adminsinglepage";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

const RequireAuth = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const userRaw = localStorage.getItem("currentUser");
  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }
  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    // Non-admin trying to access admin-only route
    return <Navigate to="/" replace />;
  }
  return children;
};

const HomeEntry = () => {
  const userRaw = localStorage.getItem("currentUser");
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user.role === "admin") {
        // Admins land directly on admin dashboard
        return <Navigate to="/admin" replace />;
      }
    } catch {
      // fall through to normal home
    }
  }
  return <HomePage />;
};

const MainRoutes=()=>{
    return(
      <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/' element={
        <RequireAuth>
          <HomeEntry/>
        </RequireAuth>
      }></Route>
      <Route path='tickets/:id' element={
        <RequireAuth>
          <Ticket/>
        </RequireAuth>
      }></Route>
      <Route path='/admin' element={
        <RequireAuth role="admin">
          <AdminDashboard/>
        </RequireAuth>
      }></Route>
      <Route path='/admin/tickets/:id' element={
        <RequireAuth role="admin">
          <AdminSingleTicket/>
        </RequireAuth>
      }></Route>
    </Routes>
    );
}
export default MainRoutes;