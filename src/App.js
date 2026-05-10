import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Bibliotheques from './components/Bibliotheques';
import Livres from './components/Livres';
import Adherents from './components/Adherents';
import Emprunts from './components/Emprunts';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bibliotheques" element={<Bibliotheques />} />
                <Route path="/livres" element={<Livres />} />
                <Route path="/adherents" element={<Adherents />} />
                <Route path="/emprunts" element={<Emprunts />} />
            </Routes>
        </Router>
    );
}

export default App;