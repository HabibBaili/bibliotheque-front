import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaSync, FaBuilding } from 'react-icons/fa';
import { api } from '../services/api';
import { useI18n } from '../i18n/I18nContext';

function Home() {
    const { t } = useI18n();
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
                console.error('Erreur stats:', err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="hero">
                <div className="hero-content">
                    <h1>{t('home.title')}</h1>
                    <p>{t('home.description')}</p>
                    <Link to="/livres" className="hero-btn">{t('home.cta')}</Link>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
                        alt={t('home.imageAlt')}
                    />
                </div>
            </div>

            <div className="container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><FaBook /></div>
                        <div className="stat-number">{stats.livres}</div>
                        <div className="stat-label">{t('home.stats.books')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaUsers /></div>
                        <div className="stat-number">{stats.adherents}</div>
                        <div className="stat-label">{t('home.stats.members')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaSync /></div>
                        <div className="stat-number">{stats.emprunts}</div>
                        <div className="stat-label">{t('home.stats.loans')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaBuilding /></div>
                        <div className="stat-number">{stats.biblios}</div>
                        <div className="stat-label">{t('home.stats.libraries')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
