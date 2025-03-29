import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login'
import Users from './pages/Users'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Users' element={<Users/>}/>
        <Route path='*' element={<Navigate to="/Login"/>}/>
      </Routes>
    </Router>
  )
}

export default App
