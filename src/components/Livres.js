import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBook, FaSearch, FaTimes } from 'react-icons/fa';
import { api } from '../services/api';

const EMPTY_FORM = {
    titre: '',
    auteur: '',
    isbn: '',
    anneePublication: '',
    bibliothequeId: '',
    quantite: 1,
    categorie: ''
};

const CATEGORIE_LABELS = {
    LITTERATURE: 'Littérature (romans, nouvelles, poésie, théâtre)',
    RELIGIEUX: 'Livres religieux (exégèse, hadith, jurisprudence, théologie, comparaison des religions)',
    PHILOSOPHIE_PSYCHOLOGIE: 'Philosophie et psychologie (philosophie, développement personnel, psychologie, sociologie)',
    SCIENCES: 'Sciences (physique, chimie, biologie, mathématiques)',
    TECHNOLOGIE_INFORMATIQUE: 'Technologie et informatique (programmation, intelligence artificielle, réseaux, cybersécurité)',
    HISTOIRE_GEOGRAPHIE: 'Histoire et géographie (histoire, civilisations, géographie)',
    ECONOMIE_GESTION: 'Économie et gestion (marketing, comptabilité, entrepreneuriat, gestion de projet)',
    EDUCATIF_ACADEMIQUE: 'Livres éducatifs et académiques (manuels scolaires, livres universitaires, ouvrages de référence)',
    ARTS_CULTURE: 'Arts et culture (dessin, musique, cinéma, design)',
    ENFANTS: 'Livres pour enfants (contes, livres éducatifs, coloriage)',
    BIOGRAPHIES_MEMOIRES: 'Biographies et mémoires (récits de vie, autobiographies)',
    LOISIRS_STYLE_VIE: 'Loisirs et style de vie (cuisine, sport, voyage, jardinage)'
};

function Livres() {
    const [livres, setLivres] = useState([]);
    const [bibliotheques, setBibliotheques] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategorie, setFilterCategorie] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const loadStaticData = useCallback(async () => {
        try {
            const [bibliothequesRes, categoriesRes] = await Promise.all([
                api.getBibliotheques(),
                api.getCategories()
            ]);
            setBibliotheques(Array.isArray(bibliothequesRes.data) ? bibliothequesRes.data : []);
            setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        } catch (err) {
            console.error('Erreur chargement des données:', err);
            setPageError('Impossible de charger les bibliothèques ou les catégories.');
            setBibliotheques([]);
            setCategories([]);
        }
    }, []);

    const loadLivres = useCallback(async (categorie = filterCategorie) => {
        setLoading(true);
        setPageError('');
        try {
            const res = await api.getLivres(categorie);
            setLivres(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Erreur chargement des livres:', err);
            setPageError('Impossible de charger les livres pour le moment.');
            setLivres([]);
        } finally {
            setLoading(false);
        }
    }, [filterCategorie]);

    useEffect(() => {
        loadStaticData();
    }, [loadStaticData]);

    useEffect(() => {
        loadLivres(filterCategorie);
    }, [filterCategorie, loadLivres]);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setFormErrors({});
    };

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const currentYear = new Date().getFullYear();
        const year = Number(form.anneePublication);
        const quantity = Number(form.quantite);

        if (!form.titre.trim()) errors.titre = 'Veuillez saisir le titre.';
        if (!form.auteur.trim()) errors.auteur = "Veuillez saisir le nom de l'auteur.";
        if (!form.isbn.trim()) errors.isbn = "Veuillez saisir l'ISBN.";
        if (!form.anneePublication || Number.isNaN(year) || year < 1000 || year > currentYear + 1) {
            errors.anneePublication = `Veuillez saisir une année valide entre 1000 et ${currentYear + 1}.`;
        }
        if (!form.quantite || Number.isNaN(quantity) || quantity < 1) {
            errors.quantite = 'La quantité doit être supérieure à 0.';
        }
        if (!form.bibliothequeId) errors.bibliothequeId = 'Veuillez sélectionner une bibliothèque.';
        if (!form.categorie) errors.categorie = 'Veuillez sélectionner une catégorie.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPageError('');

        if (!validateForm()) return;

        try {
            const dataToSubmit = {
                titre: form.titre.trim(),
                auteur: form.auteur.trim(),
                isbn: form.isbn.trim(),
                anneePublication: Number(form.anneePublication),
                quantite: Number(form.quantite),
                categorie: form.categorie,
                bibliotheque: { idB: Number(form.bibliothequeId) }
            };

            if (editingId) {
                await api.updateLivre(editingId, dataToSubmit);
            } else {
                await api.createLivre(dataToSubmit);
            }

            resetForm();
            setShowForm(false);
            loadLivres();
        } catch (err) {
            console.error('Erreur enregistrement livre:', err);
            setPageError("Impossible d'enregistrer le livre. Vérifiez les informations puis réessayez.");
        }
    };

    const handleEdit = (livre) => {
        setForm({
            titre: livre.titre || '',
            auteur: livre.auteur || '',
            isbn: livre.isbn || '',
            anneePublication: livre.anneePublication || '',
            quantite: livre.quantite || 1,
            bibliothequeId: livre.bibliotheque ? livre.bibliotheque.idB : '',
            categorie: livre.categorie || ''
        });
        setEditingId(livre.idLivre);
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce livre ?')) {
            try {
                await api.deleteLivre(id);
                loadLivres();
            } catch (err) {
                console.error('Erreur suppression livre:', err);
                setPageError('Impossible de supprimer ce livre.');
            }
        }
    };

    const handleToggleForm = () => {
        if (showForm) {
            resetForm();
        }
        setShowForm(!showForm);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilterCategorie('');
    };

    const getCategoryLabel = (categorie) => CATEGORIE_LABELS[categorie] || categorie || '-';

    const getAvailabilityBadge = (livre) => {
        const available = Number(livre.quantiteDisponible || 0);
        const total = Number(livre.quantite || 0);

        if (available <= 0) {
            return <span className="badge badge-overdue">Indisponible</span>;
        }
        if (available <= Math.max(1, Math.ceil(total * 0.25))) {
            return <span className="badge badge-warning">Stock bas: {available}</span>;
        }
        return <span className="badge badge-success">Disponible: {available}</span>;
    };

    const filteredLivres = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const list = Array.isArray(livres) ? livres : [];

        if (!query) return list;

        return list.filter(livre => {
            const haystack = [
                livre.titre,
                livre.auteur,
                livre.isbn
            ].join(' ').toLowerCase();
            return haystack.includes(query);
        });
    }, [livres, searchQuery]);

    const hasActiveFilters = Boolean(searchQuery.trim() || filterCategorie);
    const emptyMessage = hasActiveFilters
        ? 'Aucun livre ne correspond aux filtres sélectionnés.'
        : 'Aucun livre enregistré.';

    return (
        <div className="container">
            <div className="card">
                <div className="livres-header">
                    <h2 className="card-title"><FaBook /> Livres</h2>
                    <button className="btn btn-add livres-add-btn" onClick={handleToggleForm}>
                        {showForm ? 'Annuler' : '+ Nouveau livre'}
                    </button>
                </div>

                {pageError && (
                    <div className="error-message livres-page-error" role="alert">
                        {pageError}
                    </div>
                )}

                {showForm && (
                    <form onSubmit={handleSubmit} className="livres-form">
                        <div className="form-grid">
                            <div className={`form-group ${formErrors.titre ? 'form-error' : ''}`}>
                                <label>Titre</label>
                                <input
                                    value={form.titre}
                                    onChange={e => handleFormChange('titre', e.target.value)}
                                    className={formErrors.titre ? 'input-error' : ''}
                                    placeholder="Titre du livre"
                                />
                                {formErrors.titre && <div className="error-message" role="alert">{formErrors.titre}</div>}
                            </div>
                            <div className={`form-group ${formErrors.auteur ? 'form-error' : ''}`}>
                                <label>Auteur</label>
                                <input
                                    value={form.auteur}
                                    onChange={e => handleFormChange('auteur', e.target.value)}
                                    className={formErrors.auteur ? 'input-error' : ''}
                                    placeholder="Nom de l'auteur"
                                />
                                {formErrors.auteur && <div className="error-message" role="alert">{formErrors.auteur}</div>}
                            </div>
                            <div className={`form-group ${formErrors.isbn ? 'form-error' : ''}`}>
                                <label>ISBN</label>
                                <input
                                    value={form.isbn}
                                    onChange={e => handleFormChange('isbn', e.target.value)}
                                    className={formErrors.isbn ? 'input-error' : ''}
                                    placeholder="ISBN"
                                />
                                {formErrors.isbn && <div className="error-message" role="alert">{formErrors.isbn}</div>}
                            </div>
                            <div className={`form-group ${formErrors.anneePublication ? 'form-error' : ''}`}>
                                <label>Année</label>
                                <input
                                    type="number"
                                    value={form.anneePublication}
                                    onChange={e => handleFormChange('anneePublication', e.target.value)}
                                    className={formErrors.anneePublication ? 'input-error' : ''}
                                    placeholder="2024"
                                />
                                {formErrors.anneePublication && <div className="error-message" role="alert">{formErrors.anneePublication}</div>}
                            </div>
                            <div className={`form-group ${formErrors.quantite ? 'form-error' : ''}`}>
                                <label>Quantité</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.quantite}
                                    onChange={e => handleFormChange('quantite', e.target.value)}
                                    className={formErrors.quantite ? 'input-error' : ''}
                                    placeholder="1"
                                />
                                {formErrors.quantite && <div className="error-message" role="alert">{formErrors.quantite}</div>}
                            </div>
                            <div className={`form-group ${formErrors.bibliothequeId ? 'form-error' : ''}`}>
                                <label>Bibliothèque</label>
                                <select
                                    value={form.bibliothequeId}
                                    onChange={e => handleFormChange('bibliothequeId', e.target.value)}
                                    className={formErrors.bibliothequeId ? 'input-error' : ''}
                                >
                                    <option value="">Sélectionner une bibliothèque</option>
                                    {bibliotheques.map(b => (
                                        <option key={b.idB} value={b.idB}>{b.nomB}</option>
                                    ))}
                                </select>
                                {formErrors.bibliothequeId && <div className="error-message" role="alert">{formErrors.bibliothequeId}</div>}
                            </div>
                            <div className={`form-group ${formErrors.categorie ? 'form-error' : ''}`}>
                                <label>Catégorie</label>
                                <select
                                    value={form.categorie}
                                    onChange={e => handleFormChange('categorie', e.target.value)}
                                    className={formErrors.categorie ? 'input-error' : ''}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{getCategoryLabel(c)}</option>
                                    ))}
                                </select>
                                {formErrors.categorie && <div className="error-message" role="alert">{formErrors.categorie}</div>}
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-submit">
                                {editingId ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-edit" onClick={() => { resetForm(); setShowForm(false); }}>
                                    Annuler la modification
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <div className="livres-toolbar">
                    <div className="livres-search">
                        <FaSearch className="livres-search-icon" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par titre, auteur ou ISBN..."
                        />
                    </div>
                    <div className="form-group livres-filter">
                        <label>Catégorie</label>
                        <select value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)}>
                            <option value="">Toutes les catégories</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{getCategoryLabel(c)}</option>
                            ))}
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button className="btn btn-edit livres-reset-btn" onClick={resetFilters}>
                            <FaTimes /> Réinitialiser
                        </button>
                    )}
                </div>

                <div className="table-container">
                    <div className="table-count">
                        {loading ? 'Chargement des livres...' : `${filteredLivres.length} livre(s) affiché(s)`}
                    </div>
                    <table className="livres-table">
                        <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>ISBN</th>
                            <th>Année</th>
                            <th>Quantité</th>
                            <th>Disponibilité</th>
                            <th>Catégorie</th>
                            <th>Bibliothèque</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="9" className="empty-state">Chargement...</td></tr>
                        ) : filteredLivres.length === 0 ? (
                            <tr><td colSpan="9" className="empty-state">{emptyMessage}</td></tr>
                        ) : (
                            filteredLivres.map(l => (
                                <tr key={l.idLivre}>
                                    <td>
                                        <div className="livre-title">{l.titre}</div>
                                        <div className="livre-id">ID #{l.idLivre}</div>
                                    </td>
                                    <td>{l.auteur}</td>
                                    <td>{l.isbn}</td>
                                    <td>{l.anneePublication}</td>
                                    <td>{l.quantite}</td>
                                    <td>{getAvailabilityBadge(l)}</td>
                                    <td>
                                        <span className="category-pill" title={getCategoryLabel(l.categorie)}>
                                            {getCategoryLabel(l.categorie)}
                                        </span>
                                    </td>
                                    <td>{l.bibliotheque ? l.bibliotheque.nomB : '-'}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn btn-edit" onClick={() => handleEdit(l)}>Éditer</button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(l.idLivre)}>Supprimer</button>
                                        </div>
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
