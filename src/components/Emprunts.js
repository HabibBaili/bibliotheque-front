import React, { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { api } from '../services/api';

function Emprunts() {
    const [emprunts, setEmprunts] = useState([]);
    const [livres, setLivres] = useState([]);
    const [adherents, setAdherents] = useState([]);
    const [form, setForm] = useState({ livreId: '', adherentId: '', dateE: '', dateRetourPrevue: '' });
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            const [e, l, a] = await Promise.all([
                api.getEmprunts(),
                api.getLivres(),
                api.getAdherents()
            ]);
            setEmprunts(Array.isArray(e.data) ? e.data : []);
            setLivres(Array.isArray(l.data) ? l.data : []);
            setAdherents(Array.isArray(a.data) ? a.data : []);
        } catch (err) {
            console.error("Erreur:", err);
            setEmprunts([]);
            setLivres([]);
            setAdherents([]);
        }
    };

    const validateDates = (nextForm = form) => {
        const newErrors = {};
        if (nextForm.dateE && nextForm.dateRetourPrevue) {
            if (new Date(nextForm.dateRetourPrevue) <= new Date(nextForm.dateE)) {
                newErrors.dateRetourPrevue = 'La date de retour prévue doit être après la date d\'emprunt.';
            }
        }
        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateDates(form);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        try {
            await api.createEmprunt(form);
            setForm({ livreId: '', adherentId: '', dateE: '', dateRetourPrevue: '' });
            setShowForm(false);
            setErrors({});
            loadAll();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur création emprunt ! (Peut-être livre indisponible)");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet emprunt ?')) {
            try {
                await api.deleteEmprunt(id);
                loadAll();
            } catch (err) {
                alert("Erreur suppression !");
            }
        }
    };

    const handleRetour = async (id) => {
        if (window.confirm('Marquer cet emprunt comme retourné ?')) {
            try {
                await api.retournerEmprunt(id);
                loadAll();
            } catch (err) {
                alert("Erreur lors du retour !");
            }
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaSync /> Emprunts</h2>

                <button className="btn btn-add" onClick={() => { setShowForm(!showForm); if (showForm) setErrors({}); }}>
                    {showForm ? 'Annuler' : '+ Nouvel Emprunt'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Livre</label>
                                <select value={form.livreId} onChange={e => setForm({...form, livreId: e.target.value})} required>
                                    <option value="">Choisir un livre...</option>
                                    {livres.map(l => <option key={l.idLivre} value={l.idLivre}>{l.titre}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Adhérent</label>
                                <select value={form.adherentId} onChange={e => setForm({...form, adherentId: e.target.value})} required>
                                    <option value="">Choisir un adhérent...</option>
                                    {adherents.map(a => <option key={a.idA} value={a.idA}>{a.nom} {a.prenom}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date Emprunt</label>
                                <input
                                    type="date"
                                    value={form.dateE}
                                    onChange={e => {
                                        const nextForm = { ...form, dateE: e.target.value };
                                        setForm(nextForm);
                                        validateDates(nextForm);
                                    }}
                                    required
                                />
                            </div>
                            <div className={`form-group${errors.dateRetourPrevue ? ' form-error' : ''}`}>
                                <label>Retour Prévu</label>
                                <input
                                    type="date"
                                    className={errors.dateRetourPrevue ? 'input-error' : ''}
                                    value={form.dateRetourPrevue}
                                    onChange={e => {
                                        const nextForm = { ...form, dateRetourPrevue: e.target.value };
                                        setForm(nextForm);
                                        validateDates(nextForm);
                                    }}
                                    aria-invalid={errors.dateRetourPrevue ? 'true' : 'false'}
                                    required
                                />
                                {errors.dateRetourPrevue && (
                                    <div className="error-message" role="alert">
                                        {errors.dateRetourPrevue}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-submit">Enregistrer</button>
                    </form>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Livre</th>
                            <th>Adhérent</th>
                            <th>Date Emprunt</th>
                            <th>Retour Prévu</th>
                            <th>Retour Effectif</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {emprunts.length === 0 ? (
                            <tr><td colSpan="7" className="empty-state">Aucun emprunt</td></tr>
                        ) : (
                            emprunts.map(em => (
                                <tr key={em.idE}>
                                    <td>{em.idE}</td>
                                    <td>{em.livre ? em.livre.titre : 'Inconnu'}</td>
                                    <td>{em.adherent ? em.adherent.nom + ' ' + em.adherent.prenom : 'Inconnu'}</td>
                                    <td>{em.dateE}</td>
                                    <td>{em.dateRetourPrevue}</td>
                                    <td>{em.dateRetourEffective || '-'}</td>
                                    <td>
                                        {!em.dateRetourEffective && (
                                            <button className="btn btn-submit" style={{marginRight: '5px', backgroundColor: '#28a745'}} onClick={() => handleRetour(em.idE)}>Retourner</button>
                                        )}
                                        <button className="btn btn-delete" onClick={() => handleDelete(em.idE)}>Supprimer</button>
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

export default Emprunts;