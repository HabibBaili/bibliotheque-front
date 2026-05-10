import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { api } from '../services/api';

function Adherents() {
    const [adherents, setAdherents] = useState([]);
    const [form, setForm] = useState({ nom: '', prenom: '', adresse: '', tel: '' });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadAdherents();
    }, []);

    const loadAdherents = async () => {
        try {
            const res = await api.getAdherents();
            setAdherents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erreur:", err);
            setAdherents([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.updateAdherent(editingId, form);
            } else {
                await api.createAdherent(form);
            }
            setForm({ nom: '', prenom: '', adresse: '', tel: '' });
            setShowForm(false);
            setEditingId(null);
            loadAdherents();
        } catch (err) {
            alert("Erreur enregistrement adhérent !");
        }
    };

    const handleEdit = (a) => {
        setForm({ nom: a.nom, prenom: a.prenom, adresse: a.adresse, tel: a.tel });
        setEditingId(a.idA);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet adhérent ?')) {
            try {
                await api.deleteAdherent(id);
                loadAdherents();
            } catch (err) {
                alert("Erreur suppression !");
            }
        }
    };

    const list = Array.isArray(adherents) ? adherents : [];

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaUsers /> Adhérents</h2>

                <button className="btn btn-add" onClick={() => {
                    if (showForm) {
                        setForm({ nom: '', prenom: '', adresse: '', tel: '' });
                        setEditingId(null);
                    }
                    setShowForm(!showForm);
                }}>
                    {showForm ? 'Annuler' : '+ Nouvel Adhérent'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nom</label>
                                <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder="Nom" />
                            </div>
                            <div className="form-group">
                                <label>Prénom</label>
                                <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required placeholder="Prénom" />
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} required placeholder="Adresse" />
                            </div>
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input value={form.tel} onChange={e => setForm({...form, tel: e.target.value})} required placeholder="Téléphone" />
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
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Adresse</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr><td colSpan="6" className="empty-state">Aucun adhérent</td></tr>
                        ) : (
                            list.map(a => (
                                <tr key={a.idA}>
                                    <td>{a.idA}</td>
                                    <td>{a.nom}</td>
                                    <td>{a.prenom}</td>
                                    <td>{a.adresse}</td>
                                    <td>{a.tel}</td>
                                    <td>
                                        <button className="btn btn-submit" style={{marginRight: '5px', backgroundColor: '#007bff'}} onClick={() => handleEdit(a)}>Éditer</button>
                                        <button className="btn btn-delete" onClick={() => handleDelete(a.idA)}>Supprimer</button>
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

export default Adherents;