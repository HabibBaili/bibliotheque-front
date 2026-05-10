import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

function Navbar() {
    const { language, languages, setLanguage, t } = useI18n();

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <span>◆</span> Book Hunter
            </Link>
            <ul className="nav-links">
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/bibliotheques">{t('nav.libraries')}</Link></li>
                <li><Link to="/livres">{t('nav.books')}</Link></li>
                <li><Link to="/adherents">{t('nav.members')}</Link></li>
                <li><Link to="/emprunts">{t('nav.loans')}</Link></li>
            </ul>
            <label className="language-switch">
                <span>{t('nav.language')}</span>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                    {languages.map(item => (
                        <option key={item.code} value={item.code}>{item.label}</option>
                    ))}
                </select>
            </label>
        </nav>
    );
}

export default Navbar;
