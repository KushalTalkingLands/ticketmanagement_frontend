import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import HomePage from './components/homepage/Homepage.js';
import Ticket from './components/newticket/Newticket';
import Admin_dashboard from './components/admin/admin_board/Adminboard';
import AdminSingleTicket from './components/admin/admin-single-ticket/Adminsinglepage';
import MainRoutes from './components/routes/Mainroutes';

function App() {
  return (
    <MainRoutes/>
  );
}

export default App;
