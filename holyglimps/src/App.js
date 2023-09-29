import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Signup from './pages/singup';
import Page404 from './pages/Page404';

function App() {
  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path='/*' element={<Page404 />} />
    </Routes>
  );
}

export default App;
