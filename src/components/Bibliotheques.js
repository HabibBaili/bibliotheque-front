import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

function Bibliotheques() {
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
            console.error("Erreur:", err);
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
            alert("Erreur création bibliothèque !");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette bibliothèque ?')) {
            try {
                await api.deleteBibliotheque(id);
                loadBibliotheques();
            } catch (err) {
                alert("Erreur suppression !");
            }
        }
    };

    const list = Array.isArray(bibliotheques) ? bibliotheques : [];

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title">🏛️ Bibliothèques</h2>

                <button className="btn btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Annuler' : '+ Nouvelle Bibliothèque'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nom</label>
                                <input value={form.nomB} onChange={e => setForm({...form, nomB: e.target.value})} required placeholder="Nom de la bibliothèque" />
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input value={form.adresseB} onChange={e => setForm({...form, adresseB: e.target.value})} required placeholder="Adresse" />
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
                            <th>Nom</th>
                            <th>Adresse</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr><td colSpan="4" className="empty-state">Aucune bibliothèque</td></tr>
                        ) : (
                            list.map(b => (
                                <tr key={b.idB}>
                                    <td>{b.idB}</td>
                                    <td>{b.nomB}</td>
                                    <td>{b.adresseB}</td>
                                    <td>
                                        <button className="btn btn-delete" onClick={() => handleDelete(b.idB)}>Supprimer</button>
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