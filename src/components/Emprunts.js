import React, { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { api } from '../services/api';

function Emprunts() {
    const [emprunts, setEmprunts] = useState([]);
    const [livres, setLivres] = useState([]);
    const [adherents, setAdherents] = useState([]);
    const [form, setForm] = useState({ livreId: '', adherentId: '', dateE: '', dateRetourPrevue: '' });
    const [showForm, setShowForm] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createEmprunt(form);
            setForm({ livreId: '', adherentId: '', dateE: '', dateRetourPrevue: '' });
            setShowForm(false);
            loadAll();
        } catch (err) {
            alert("Erreur création emprunt !");
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

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaSync /> Emprunts</h2>

                <button className="btn btn-add" onClick={() => setShowForm(!showForm)}>
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
                                <input type="date" value={form.dateE} onChange={e => setForm({...form, dateE: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Retour Prévu</label>
                                <input type="date" value={form.dateRetourPrevue} onChange={e => setForm({...form, dateRetourPrevue: e.target.value})} required />
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
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {emprunts.length === 0 ? (
                            <tr><td colSpan="6" className="empty-state">Aucun emprunt</td></tr>
                        ) : (
                            emprunts.map(em => (
                                <tr key={em.idE}>
                                    <td>{em.idE}</td>
                                    <td>{em.livre ? em.livre.titre : 'Inconnu'}</td>
                                    <td>{em.adherent ? em.adherent.nom + ' ' + em.adherent.prenom : 'Inconnu'}</td>
                                    <td>{em.dateE}</td>
                                    <td>{em.dateRetourPrevue}</td>
                                    <td>
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