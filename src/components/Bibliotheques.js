import React, { useEffect, useState } from 'react';
import { FaBuilding } from 'react-icons/fa';
import { api } from '../services/api';
import { useI18n } from '../i18n/I18nContext';

function Bibliotheques() {
    const { t } = useI18n();
    const [bibliotheques, setBibliotheques] = useState([]);
    const [form, setForm] = useState({ nomB: '', adresseB: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadBibliotheques();
    }, []);

    const loadBibliotheques = async () => {
        try {
            const res = await api.getBibliotheques();
            setBibliotheques(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Erreur:', err);
            setBibliotheques([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createBibliotheque(form);
            setForm({ nomB: '', adresseB: '' });
            setShowForm(false);
            loadBibliotheques();
        } catch (err) {
            alert(t('libraries.createError'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('libraries.deleteConfirm'))) {
            try {
                await api.deleteBibliotheque(id);
                loadBibliotheques();
            } catch (err) {
                alert(t('libraries.deleteError'));
            }
        }
    };

    const list = Array.isArray(bibliotheques) ? bibliotheques : [];

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaBuilding /> {t('libraries.title')}</h2>

                <button className="btn btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? t('common.cancel') : t('libraries.add')}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>{t('common.name')}</label>
                                <input value={form.nomB} onChange={e => setForm({...form, nomB: e.target.value})} required placeholder={t('libraries.namePlaceholder')} />
                            </div>
                            <div className="form-group">
                                <label>{t('common.address')}</label>
                                <input value={form.adresseB} onChange={e => setForm({...form, adresseB: e.target.value})} required placeholder={t('common.address')} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-submit">{t('common.save')}</button>
                    </form>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>{t('common.id')}</th>
                            <th>{t('common.name')}</th>
                            <th>{t('common.address')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr><td colSpan="4" className="empty-state">{t('libraries.empty')}</td></tr>
                        ) : (
                            list.map(b => (
                                <tr key={b.idB}>
                                    <td>{b.idB}</td>
                                    <td>{b.nomB}</td>
                                    <td>{b.adresseB}</td>
                                    <td>
                                        <button className="btn btn-delete" onClick={() => handleDelete(b.idB)}>{t('common.delete')}</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Bibliotheques;
