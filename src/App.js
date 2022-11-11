import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import HomePage from './components/homepage/Homepage.js';
import Ticket from './components/newticket/Newticket';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='tickets/:id' element={<Ticket/>}></Route>
    </Routes>
  );
}

export default App;
