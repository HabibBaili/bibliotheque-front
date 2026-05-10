import React, { useEffect, useState } from 'react';
import { FaSync, FaPlus, FaTimes, FaChevronDown, FaChevronRight, FaExclamationTriangle, FaUndo, FaHistory, FaBook } from 'react-icons/fa';
import { api } from '../services/api';

const MAX_BOOKS_PER_LOAN = 10;
const MAX_QTY_SAME_BOOK = 2;

function Emprunts() {
    const [emprunts, setEmprunts] = useState([]);
    const [livres, setLivres] = useState([]);
    const [adherents, setAdherents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [expandedRow, setExpandedRow] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'overdue', 'history'
    const [overdueEmprunts, setOverdueEmprunts] = useState([]);
    const [selectedAdherentHistory, setSelectedAdherentHistory] = useState('');
    const [historyEmprunts, setHistoryEmprunts] = useState([]);

    // Form state
    const [adherentId, setAdherentId] = useState('');
    const [dateE, setDateE] = useState('');
    const [dateRetourPrevue, setDateRetourPrevue] = useState('');
    const [lignes, setLignes] = useState([{ livreId: '', quantite: 1 }]);

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

    const loadOverdue = async () => {
        try {
            const res = await api.getEmpruntsEnRetard();
            setOverdueEmprunts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erreur chargement retards:", err);
            setOverdueEmprunts([]);
        }
    };

    const loadHistory = async (adhId) => {
        if (!adhId) {
            setHistoryEmprunts([]);
            return;
        }
        try {
            const res = await api.getEmpruntsByAdherent(adhId);
            setHistoryEmprunts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erreur chargement historique:", err);
            setHistoryEmprunts([]);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'overdue') loadOverdue();
    };

    // --- Multi-book form logic ---
    const addBookRow = () => {
        if (lignes.length >= MAX_BOOKS_PER_LOAN) {
            alert(`Maximum ${MAX_BOOKS_PER_LOAN} livres par emprunt`);
            return;
        }
        setLignes([...lignes, { livreId: '', quantite: 1 }]);
    };

    const removeBookRow = (index) => {
        if (lignes.length <= 1) return;
        setLignes(lignes.filter((_, i) => i !== index));
    };

    const updateBookRow = (index, field, value) => {
        const updated = [...lignes];
        updated[index] = { ...updated[index], [field]: value };
        setLignes(updated);
        // Clear related errors
        const newErrors = { ...errors };
        delete newErrors[`ligne_${index}`];
        setErrors(newErrors);
    };

    const getAvailableStock = (livreId) => {
        const livre = livres.find(l => String(l.idLivre) === String(livreId));
        return livre ? livre.quantiteDisponible : 0;
    };

    const getBookTitle = (livreId) => {
        const livre = livres.find(l => String(l.idLivre) === String(livreId));
        return livre ? livre.titre : '';
    };

    const validateForm = () => {
        const newErrors = {};

        if (!adherentId) newErrors.adherent = 'Veuillez sélectionner un adhérent';
        if (!dateE) newErrors.dateE = 'Veuillez saisir la date d\'emprunt';
        if (!dateRetourPrevue) newErrors.dateRetourPrevue = 'Veuillez saisir la date de retour';

        if (dateE && dateRetourPrevue && new Date(dateRetourPrevue) <= new Date(dateE)) {
            newErrors.dateRetourPrevue = 'La date de retour prévue doit être après la date d\'emprunt';
        }

        // Validate each line
        const selectedBooks = {};
        lignes.forEach((ligne, index) => {
            if (!ligne.livreId) {
                newErrors[`ligne_${index}`] = 'Veuillez sélectionner un livre';
                return;
            }
            if (ligne.quantite <= 0) {
                newErrors[`ligne_${index}`] = 'La quantité doit être supérieure à 0';
                return;
            }
            if (ligne.quantite > MAX_QTY_SAME_BOOK) {
                newErrors[`ligne_${index}`] = `Maximum ${MAX_QTY_SAME_BOOK} exemplaires du même livre`;
                return;
            }

            const stock = getAvailableStock(ligne.livreId);
            if (ligne.quantite > stock) {
                newErrors[`ligne_${index}`] = `Quantité insuffisante (disponible: ${stock})`;
                return;
            }

            // Check duplicates
            if (selectedBooks[ligne.livreId]) {
                newErrors[`ligne_${index}`] = 'Ce livre est déjà sélectionné';
                return;
            }
            selectedBooks[ligne.livreId] = true;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dto = {
            adherentId: Number(adherentId),
            dateE,
            dateRetourPrevue,
            lignes: lignes.map(l => ({
                livreId: Number(l.livreId),
                quantite: Number(l.quantite)
            }))
        };

        try {
            await api.createEmprunt(dto);
            resetForm();
            loadAll();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur création emprunt !");
            console.error(err);
        }
    };

    const resetForm = () => {
        setAdherentId('');
        setDateE('');
        setDateRetourPrevue('');
        setLignes([{ livreId: '', quantite: 1 }]);
        setShowForm(false);
        setErrors({});
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet emprunt ? Le stock sera restauré pour les livres non retournés.')) {
            try {
                await api.deleteEmprunt(id);
                loadAll();
            } catch (err) {
                alert("Erreur suppression !");
            }
        }
    };

    const handleRetourComplet = async (id) => {
        if (window.confirm('Retourner tous les livres de cet emprunt ?')) {
            try {
                await api.retournerEmprunt(id);
                loadAll();
                if (activeTab === 'overdue') loadOverdue();
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors du retour !");
            }
        }
    };

    const handleRetourLigne = async (empruntId, ligneId, livreTitre) => {
        if (window.confirm(`Retourner "${livreTitre}" ?`)) {
            try {
                await api.retournerLigne(empruntId, ligneId);
                loadAll();
                if (activeTab === 'overdue') loadOverdue();
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors du retour !");
            }
        }
    };

    const getStatutBadge = (statut, dateRetourPrevue) => {
        const isOverdue = dateRetourPrevue && new Date(dateRetourPrevue) < new Date() && statut !== 'RETOURNE';
        if (statut === 'RETOURNE') return <span className="badge badge-success">Retourné</span>;
        if (statut === 'RETOURNE_PARTIELLEMENT') return <span className={`badge badge-warning ${isOverdue ? 'badge-overdue' : ''}`}>Partiel {isOverdue && <FaExclamationTriangle />}</span>;
        return <span className={`badge badge-active ${isOverdue ? 'badge-overdue' : ''}`}>En cours {isOverdue && <FaExclamationTriangle />}</span>;
    };

    const getTotalBooks = (emprunt) => {
        if (!emprunt.lignes) return 0;
        return emprunt.lignes.reduce((sum, l) => sum + l.quantite, 0);
    };

    const renderEmpruntTable = (empruntsList, showTitle) => (
        <div className="table-container">
            {showTitle && empruntsList.length > 0 && (
                <div className="table-count">{empruntsList.length} emprunt(s)</div>
            )}
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Adhérent</th>
                    <th>Livres</th>
                    <th>Date Emprunt</th>
                    <th>Retour Prévu</th>
                    <th>Retour Effectif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {empruntsList.length === 0 ? (
                    <tr><td colSpan="9" className="empty-state">Aucun emprunt</td></tr>
                ) : (
                    empruntsList.map(em => (
                        <React.Fragment key={em.idE}>
                            <tr className={`${em.lignes && em.lignes.some(l => !l.retourne) && em.dateRetourPrevue && new Date(em.dateRetourPrevue) < new Date() ? 'row-overdue' : ''}`}>
                                <td>
                                    <button
                                        className="btn-expand"
                                        onClick={() => setExpandedRow(expandedRow === em.idE ? null : em.idE)}
                                    >
                                        {expandedRow === em.idE ? <FaChevronDown /> : <FaChevronRight />}
                                    </button>
                                </td>
                                <td>{em.idE}</td>
                                <td>{em.adherent ? `${em.adherent.nom} ${em.adherent.prenom}` : 'Inconnu'}</td>
                                <td><span className="book-count">{getTotalBooks(em)} livre(s)</span></td>
                                <td>{em.dateE}</td>
                                <td>{em.dateRetourPrevue}</td>
                                <td>{em.dateRetourEffective || '—'}</td>
                                <td>{getStatutBadge(em.statut, em.dateRetourPrevue)}</td>
                                <td className="actions-cell">
                                    {em.statut !== 'RETOURNE' && (
                                        <button
                                            className="btn btn-return"
                                            onClick={() => handleRetourComplet(em.idE)}
                                            title="Retour complet"
                                        >
                                            <FaUndo /> Tout
                                        </button>
                                    )}
                                    <button className="btn btn-delete" onClick={() => handleDelete(em.idE)}>Supprimer</button>
                                </td>
                            </tr>
                            {expandedRow === em.idE && (
                                <tr className="expanded-row">
                                    <td colSpan="9">
                                        <div className="ligne-details">
                                            <h4><FaBook /> Détail des livres empruntés</h4>
                                            <table className="inner-table">
                                                <thead>
                                                <tr>
                                                    <th>Livre</th>
                                                    <th>Auteur</th>
                                                    <th>Quantité</th>
                                                    <th>Statut</th>
                                                    <th>Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {em.lignes && em.lignes.map(ligne => (
                                                    <tr key={ligne.id} className={ligne.retourne ? 'ligne-returned' : ''}>
                                                        <td>{ligne.livre ? ligne.livre.titre : 'Inconnu'}</td>
                                                        <td>{ligne.livre ? ligne.livre.auteur : '—'}</td>
                                                        <td>{ligne.quantite}</td>
                                                        <td>
                                                            {ligne.retourne
                                                                ? <span className="badge badge-success">Retourné</span>
                                                                : <span className="badge badge-active">En cours</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            {!ligne.retourne && (
                                                                <button
                                                                    className="btn btn-return-sm"
                                                                    onClick={() => handleRetourLigne(em.idE, ligne.id, ligne.livre?.titre || 'livre')}
                                                                >
                                                                    <FaUndo /> Retourner
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaSync /> Emprunts</h2>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange('all')}
                    >
                        <FaBook /> Tous les emprunts
                    </button>
                    <button
                        className={`tab ${activeTab === 'overdue' ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange('overdue')}
                    >
                        <FaExclamationTriangle /> En retard
                    </button>
                    <button
                        className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange('history')}
                    >
                        <FaHistory /> Historique
                    </button>
                </div>

                {/* All Emprunts Tab */}
                {activeTab === 'all' && (
                    <>
                        <button className="btn btn-add" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                            {showForm ? 'Annuler' : '+ Nouvel Emprunt'}
                        </button>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="emprunt-form">
                                <div className="form-grid">
                                    <div className={`form-group ${errors.adherent ? 'form-error' : ''}`}>
                                        <label>Adhérent</label>
                                        <select value={adherentId} onChange={e => { setAdherentId(e.target.value); setErrors({...errors, adherent: undefined}); }} required>
                                            <option value="">Choisir un adhérent...</option>
                                            {adherents.map(a => <option key={a.idA} value={a.idA}>{a.nom} {a.prenom}</option>)}
                                        </select>
                                        {errors.adherent && <div className="error-message" role="alert">{errors.adherent}</div>}
                                    </div>
                                    <div className={`form-group ${errors.dateE ? 'form-error' : ''}`}>
                                        <label>Date Emprunt</label>
                                        <input
                                            type="date"
                                            value={dateE}
                                            onChange={e => { setDateE(e.target.value); setErrors({...errors, dateE: undefined}); }}
                                            required
                                        />
                                        {errors.dateE && <div className="error-message" role="alert">{errors.dateE}</div>}
                                    </div>
                                    <div className={`form-group ${errors.dateRetourPrevue ? 'form-error' : ''}`}>
                                        <label>Retour Prévu</label>
                                        <input
                                            type="date"
                                            className={errors.dateRetourPrevue ? 'input-error' : ''}
                                            value={dateRetourPrevue}
                                            onChange={e => { setDateRetourPrevue(e.target.value); setErrors({...errors, dateRetourPrevue: undefined}); }}
                                            required
                                        />
                                        {errors.dateRetourPrevue && <div className="error-message" role="alert">{errors.dateRetourPrevue}</div>}
                                    </div>
                                </div>

                                {/* Multi-Book Selector */}
                                <div className="multi-book-section">
                                    <div className="multi-book-header">
                                        <h3><FaBook /> Livres à emprunter</h3>
                                        <span className="book-counter">{lignes.length} / {MAX_BOOKS_PER_LOAN}</span>
                                    </div>

                                    {lignes.map((ligne, index) => (
                                        <div key={index} className={`book-row ${errors[`ligne_${index}`] ? 'book-row-error' : ''}`}>
                                            <div className="book-row-number">{index + 1}</div>
                                            <div className="book-row-fields">
                                                <div className="book-select-wrapper">
                                                    <select
                                                        value={ligne.livreId}
                                                        onChange={e => updateBookRow(index, 'livreId', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Choisir un livre...</option>
                                                        {livres.map(l => (
                                                            <option
                                                                key={l.idLivre}
                                                                value={l.idLivre}
                                                                disabled={lignes.some((other, i) => i !== index && String(other.livreId) === String(l.idLivre))}
                                                            >
                                                                {l.titre} — {l.auteur}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {ligne.livreId && (
                                                        <span className="stock-info">
                                                            Stock: <strong>{getAvailableStock(ligne.livreId)}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="quantity-wrapper">
                                                    <label>Qté</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={MAX_QTY_SAME_BOOK}
                                                        value={ligne.quantite}
                                                        onChange={e => updateBookRow(index, 'quantite', parseInt(e.target.value) || 1)}
                                                        className="quantity-input"
                                                    />
                                                </div>
                                            </div>
                                            {lignes.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-remove-row"
                                                    onClick={() => removeBookRow(index)}
                                                    title="Supprimer cette ligne"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                            {errors[`ligne_${index}`] && (
                                                <div className="book-row-error-msg">{errors[`ligne_${index}`]}</div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="btn btn-add-book"
                                        onClick={addBookRow}
                                        disabled={lignes.length >= MAX_BOOKS_PER_LOAN}
                                    >
                                        <FaPlus /> Ajouter un livre
                                    </button>
                                </div>

                                {/* Loan Summary */}
                                {lignes.some(l => l.livreId) && (
                                    <div className="loan-summary">
                                        <h4>Résumé de l'emprunt</h4>
                                        <div className="summary-items">
                                            {lignes.filter(l => l.livreId).map((l, i) => (
                                                <div key={i} className="summary-item">
                                                    <span className="summary-title">{getBookTitle(l.livreId)}</span>
                                                    <span className="summary-qty">×{l.quantite}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="summary-total">
                                            Total: <strong>{lignes.filter(l => l.livreId).reduce((s, l) => s + (l.quantite || 0), 0)}</strong> livre(s)
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-submit">Enregistrer l'emprunt</button>
                            </form>
                        )}

                        {renderEmpruntTable(emprunts, true)}
                    </>
                )}

                {/* Overdue Tab */}
                {activeTab === 'overdue' && (
                    <>
                        <div className="overdue-header">
                            <FaExclamationTriangle className="overdue-icon" />
                            <p>Emprunts dont la date de retour prévue est dépassée</p>
                        </div>
                        {renderEmpruntTable(overdueEmprunts, true)}
                    </>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <>
                        <div className="history-section">
                            <div className="form-group">
                                <label>Sélectionner un adhérent</label>
                                <select
                                    value={selectedAdherentHistory}
                                    onChange={e => {
                                        setSelectedAdherentHistory(e.target.value);
                                        loadHistory(e.target.value);
                                    }}
                                >
                                    <option value="">Choisir un adhérent...</option>
                                    {adherents.map(a => <option key={a.idA} value={a.idA}>{a.nom} {a.prenom}</option>)}
                                </select>
                            </div>
                        </div>
                        {selectedAdherentHistory && renderEmpruntTable(historyEmprunts, true)}
                    </>
                )}
            </div>
        </div>
    );
}

export default Emprunts;