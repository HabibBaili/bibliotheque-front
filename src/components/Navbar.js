import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <span>◆</span> Book Hunter
            </div>
            <ul className="nav-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/bibliotheques">Bibliothèques</Link></li>
                <li><Link to="/livres">Livres</Link></li>
                <li><Link to="/adherents">Adhérents</Link></li>
                <li><Link to="/emprunts">Emprunts</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;