import './App.css'
import React from 'react'
import Home from './Pages/Home.jsx'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import CoursesList from './Pages/CoursesList.jsx'
import Contact from './Pages/Contact.jsx';
import Footer from './Pages/Footer.jsx';
import AuthPage from './Pages/AuthPage.jsx';
import Layout from './components/Layout.jsx';
import Profile from './Pages/Profile.jsx';
import TeacherDashboard from './Pages/TeacherDashboard.jsx';
import StudentDashboard from './Pages/StudentDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<Home />} />
          <Route path='/courses' element={<CoursesList />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='/teacher-dashboard' element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path='/student-dashboard' element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path='/auth-register' element={<AuthPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App
