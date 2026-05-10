import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { api } from '../services/api';

function Livres() {
    const [livres, setLivres] = useState([]);
    const [form, setForm] = useState({ titre: '', auteur: '', isbn: '', anneePublication: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadLivres();
    }, []);

    const loadLivres = async () => {
        try {
            const res = await api.getLivres();
            setLivres(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erreur:", err);
            setLivres([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createLivre(form);
            setForm({ titre: '', auteur: '', isbn: '', anneePublication: '' });
            setShowForm(false);
            loadLivres();
        } catch (err) {
            alert("Erreur création livre !");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce livre ?')) {
            try {
                await api.deleteLivre(id);
                loadLivres();
            } catch (err) {
                alert("Erreur suppression !");
            }
        }
    };

    const list = Array.isArray(livres) ? livres : [];

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaBook /> Livres</h2>

                <button className="btn btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Annuler' : '+ Nouveau Livre'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Titre</label>
                                <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} required placeholder="Titre du livre" />
                            </div>
                            <div className="form-group">
                                <label>Auteur</label>
                                <input value={form.auteur} onChange={e => setForm({...form, auteur: e.target.value})} required placeholder="Nom de l'auteur" />
                            </div>
                            <div className="form-group">
                                <label>ISBN</label>
                                <input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} required placeholder="ISBN" />
                            </div>
                            <div className="form-group">
                                <label>Année</label>
                                <input type="number" value={form.anneePublication} onChange={e => setForm({...form, anneePublication: e.target.value})} required placeholder="2024" />
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
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>ISBN</th>
                            <th>Année</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr><td colSpan="6" className="empty-state">Aucun livre</td></tr>
                        ) : (
                            list.map(l => (
                                <tr key={l.idLivre}>
                                    <td>{l.idLivre}</td>
                                    <td>{l.titre}</td>
                                    <td>{l.auteur}</td>
                                    <td>{l.isbn}</td>
                                    <td>{l.anneePublication}</td>
                                    <td>
                                        <button className="btn btn-delete" onClick={() => handleDelete(l.idLivre)}>Supprimer</button>
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

export default Livres;