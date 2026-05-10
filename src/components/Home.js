import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaSync, FaBuilding } from 'react-icons/fa';
import { api } from '../services/api';

function Home() {
    const [stats, setStats] = useState({ livres: 0, adherents: 0, emprunts: 0, biblios: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [livres, adherents, emprunts, biblios] = await Promise.all([
                    api.getLivres(),
                    api.getAdherents(),
                    api.getEmprunts(),
                    api.getBibliotheques(),
                ]);
                setStats({
                    livres: Array.isArray(livres.data) ? livres.data.length : 0,
                    adherents: Array.isArray(adherents.data) ? adherents.data.length : 0,
                    emprunts: Array.isArray(emprunts.data) ? emprunts.data.length : 0,
                    biblios: Array.isArray(biblios.data) ? biblios.data.length : 0,
                });
            } catch (err) {
                console.error("Erreur stats:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="hero">
                <div className="hero-content">
                    <h1>The Book Hunter Store</h1>
                    <p>Découvrez notre collection de livres soigneusement sélectionnés. Gérez vos emprunts et adhérents avec élégance.</p>
                    <Link to="/livres" className="hero-btn">Explorer la Collection</Link>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
                        alt="Livre ouvert"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><FaBook /></div>
                        <div className="stat-number">{stats.livres}</div>
                        <div className="stat-label">Livres</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaUsers /></div>
                        <div className="stat-number">{stats.adherents}</div>
                        <div className="stat-label">Adhérents</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaSync /></div>
                        <div className="stat-number">{stats.emprunts}</div>
                        <div className="stat-label">Emprunts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaBuilding /></div>
                        <div className="stat-number">{stats.biblios}</div>
                        <div className="stat-label">Bibliothèques</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;