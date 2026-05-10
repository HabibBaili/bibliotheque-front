import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { api } from '../services/api';

function Livres() {
    const [livres, setLivres] = useState([]);
    const [bibliotheques, setBibliotheques] = useState([]);
    const [form, setForm] = useState({ titre: '', auteur: '', isbn: '', anneePublication: '', bibliothequeId: '', quantite: 1 });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadLivres();
        loadBibliotheques();
    }, []);

    const loadBibliotheques = async () => {
        try {
            const res = await api.getBibliotheques();
            setBibliotheques(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erreur bibliothèques:", err);
            setBibliotheques([]);
        }
    };

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
            const dataToSubmit = {
                ...form,
                bibliotheque: form.bibliothequeId ? { idB: parseInt(form.bibliothequeId) } : null
            };
            if (editingId) {
                await api.updateLivre(editingId, dataToSubmit);
            } else {
                await api.createLivre(dataToSubmit);
            }
            setForm({ titre: '', auteur: '', isbn: '', anneePublication: '', bibliothequeId: '', quantite: 1 });
            setShowForm(false);
            setEditingId(null);
            loadLivres();
        } catch (err) {
            alert("Erreur enregistrement livre !");
        }
    };

    const handleEdit = (l) => {
        setForm({
            titre: l.titre,
            auteur: l.auteur,
            isbn: l.isbn,
            anneePublication: l.anneePublication,
            quantite: l.quantite,
            bibliothequeId: l.bibliotheque ? l.bibliotheque.idB : ''
        });
        setEditingId(l.idLivre);
        setShowForm(true);
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

                <button className="btn btn-add" onClick={() => {
                    if (showForm) {
                        setForm({ titre: '', auteur: '', isbn: '', anneePublication: '', bibliothequeId: '', quantite: 1 });
                        setEditingId(null);
                    }
                    setShowForm(!showForm);
                }}>
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
                            <div className="form-group">
                                <label>Quantité</label>
                                <input type="number" min="1" value={form.quantite} onChange={e => setForm({...form, quantite: e.target.value})} required placeholder="1" />
                            </div>
                            <div className="form-group">
                                <label>Bibliothèque</label>
                                <select value={form.bibliothequeId} onChange={e => setForm({...form, bibliothequeId: e.target.value})} required>
                                    <option value="">Sélectionner une bibliothèque</option>
                                    {bibliotheques.map(b => (
                                        <option key={b.idB} value={b.idB}>{b.nomB}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-submit">
                            {editingId ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
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
                            <th>Quantité</th>
                            <th>Disponible</th>
                            <th>Bibliothèque</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr><td colSpan="9" className="empty-state">Aucun livre</td></tr>
                        ) : (
                            list.map(l => (
                                <tr key={l.idLivre}>
                                    <td>{l.idLivre}</td>
                                    <td>{l.titre}</td>
                                    <td>{l.auteur}</td>
                                    <td>{l.isbn}</td>
                                    <td>{l.anneePublication}</td>
                                    <td>{l.quantite}</td>
                                    <td>{l.quantiteDisponible}</td>
                                    <td>{l.bibliotheque ? l.bibliotheque.nomB : '-'}</td>
                                    <td>
                                        <button className="btn btn-submit" style={{marginRight: '5px', backgroundColor: '#007bff'}} onClick={() => handleEdit(l)}>Éditer</button>
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