import './App.css'
import React from 'react'
import Home from './Pages/Home.jsx'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import FetchCourses from './components/FetchCourses.jsx'
import Contact from './Pages/Contact.jsx';
import Footer from './Pages/Footer.jsx';
import AuthPage from './Pages/AuthPage.jsx';
import Layout from './components/Layout.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<Home />} />
          <Route path='/courses' element={<FetchCourses />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
        <Route path='/auth-register' element={<AuthPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}




export default App
