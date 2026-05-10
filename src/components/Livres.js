import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBook, FaSearch, FaTimes } from 'react-icons/fa';
import { api } from '../services/api';
import { useI18n } from '../i18n/I18nContext';

const EMPTY_FORM = {
    titre: '',
    auteur: '',
    isbn: '',
    anneePublication: '',
    bibliothequeId: '',
    quantite: 1,
    categorie: ''
};

function Livres() {
    const { t } = useI18n();
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

    const getCategoryLabel = useCallback((categorie) => (
        categorie ? t(`books.categories.${categorie}`) : '-'
    ), [t]);

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
            setPageError(t('books.messages.staticError'));
            setBibliotheques([]);
            setCategories([]);
        }
    }, [t]);

    const loadLivres = useCallback(async (categorie = filterCategorie) => {
        setLoading(true);
        setPageError('');
        try {
            const res = await api.getLivres(categorie);
            setLivres(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Erreur chargement des livres:', err);
            setPageError(t('books.messages.loadError'));
            setLivres([]);
        } finally {
            setLoading(false);
        }
    }, [filterCategorie, t]);

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
        const maxYear = currentYear + 1;
        const year = Number(form.anneePublication);
        const quantity = Number(form.quantite);

        if (!form.titre.trim()) errors.titre = t('books.validations.title');
        if (!form.auteur.trim()) errors.auteur = t('books.validations.author');
        if (!form.isbn.trim()) errors.isbn = t('books.validations.isbn');
        if (!form.anneePublication || Number.isNaN(year) || year < 1000 || year > maxYear) {
            errors.anneePublication = t('books.validations.year', { maxYear });
        }
        if (!form.quantite || Number.isNaN(quantity) || quantity < 1) {
            errors.quantite = t('books.validations.quantity');
        }
        if (!form.bibliothequeId) errors.bibliothequeId = t('books.validations.library');
        if (!form.categorie) errors.categorie = t('books.validations.category');

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
            setPageError(t('books.messages.saveError'));
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
        if (window.confirm(t('books.messages.deleteConfirm'))) {
            try {
                await api.deleteLivre(id);
                loadLivres();
            } catch (err) {
                console.error('Erreur suppression livre:', err);
                setPageError(t('books.messages.deleteError'));
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

    const getAvailabilityBadge = (livre) => {
        const available = Number(livre.quantiteDisponible || 0);
        const total = Number(livre.quantite || 0);

        if (available <= 0) {
            return <span className="badge badge-overdue">{t('books.availability.unavailable')}</span>;
        }
        if (available <= Math.max(1, Math.ceil(total * 0.25))) {
            return <span className="badge badge-warning">{t('books.availability.lowStock', { count: available })}</span>;
        }
        return <span className="badge badge-success">{t('books.availability.available', { count: available })}</span>;
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
        ? t('books.messages.noFilterResults')
        : t('books.messages.empty');

    return (
        <div className="container">
            <div className="card">
                <div className="livres-header">
                    <h2 className="card-title"><FaBook /> {t('books.title')}</h2>
                    <button className="btn btn-add livres-add-btn" onClick={handleToggleForm}>
                        {showForm ? t('common.cancel') : t('books.add')}
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
                                <label>{t('books.fields.title')}</label>
                                <input value={form.titre} onChange={e => handleFormChange('titre', e.target.value)} className={formErrors.titre ? 'input-error' : ''} placeholder={t('books.placeholders.title')} />
                                {formErrors.titre && <div className="error-message" role="alert">{formErrors.titre}</div>}
                            </div>
                            <div className={`form-group ${formErrors.auteur ? 'form-error' : ''}`}>
                                <label>{t('books.fields.author')}</label>
                                <input value={form.auteur} onChange={e => handleFormChange('auteur', e.target.value)} className={formErrors.auteur ? 'input-error' : ''} placeholder={t('books.placeholders.author')} />
                                {formErrors.auteur && <div className="error-message" role="alert">{formErrors.auteur}</div>}
                            </div>
                            <div className={`form-group ${formErrors.isbn ? 'form-error' : ''}`}>
                                <label>{t('books.fields.isbn')}</label>
                                <input value={form.isbn} onChange={e => handleFormChange('isbn', e.target.value)} className={formErrors.isbn ? 'input-error' : ''} placeholder={t('books.placeholders.isbn')} />
                                {formErrors.isbn && <div className="error-message" role="alert">{formErrors.isbn}</div>}
                            </div>
                            <div className={`form-group ${formErrors.anneePublication ? 'form-error' : ''}`}>
                                <label>{t('books.fields.year')}</label>
                                <input type="number" value={form.anneePublication} onChange={e => handleFormChange('anneePublication', e.target.value)} className={formErrors.anneePublication ? 'input-error' : ''} placeholder={t('books.placeholders.year')} />
                                {formErrors.anneePublication && <div className="error-message" role="alert">{formErrors.anneePublication}</div>}
                            </div>
                            <div className={`form-group ${formErrors.quantite ? 'form-error' : ''}`}>
                                <label>{t('books.fields.quantity')}</label>
                                <input type="number" min="1" value={form.quantite} onChange={e => handleFormChange('quantite', e.target.value)} className={formErrors.quantite ? 'input-error' : ''} placeholder="1" />
                                {formErrors.quantite && <div className="error-message" role="alert">{formErrors.quantite}</div>}
                            </div>
                            <div className={`form-group ${formErrors.bibliothequeId ? 'form-error' : ''}`}>
                                <label>{t('books.fields.library')}</label>
                                <select value={form.bibliothequeId} onChange={e => handleFormChange('bibliothequeId', e.target.value)} className={formErrors.bibliothequeId ? 'input-error' : ''}>
                                    <option value="">{t('books.placeholders.selectLibrary')}</option>
                                    {bibliotheques.map(b => (
                                        <option key={b.idB} value={b.idB}>{b.nomB}</option>
                                    ))}
                                </select>
                                {formErrors.bibliothequeId && <div className="error-message" role="alert">{formErrors.bibliothequeId}</div>}
                            </div>
                            <div className={`form-group ${formErrors.categorie ? 'form-error' : ''}`}>
                                <label>{t('books.fields.category')}</label>
                                <select value={form.categorie} onChange={e => handleFormChange('categorie', e.target.value)} className={formErrors.categorie ? 'input-error' : ''}>
                                    <option value="">{t('books.placeholders.selectCategory')}</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{getCategoryLabel(c)}</option>
                                    ))}
                                </select>
                                {formErrors.categorie && <div className="error-message" role="alert">{formErrors.categorie}</div>}
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-submit">
                                {editingId ? t('common.update') : t('common.save')}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-edit" onClick={() => { resetForm(); setShowForm(false); }}>
                                    {t('books.messages.cancelEdit')}
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <div className="livres-toolbar">
                    <div className="livres-search">
                        <FaSearch className="livres-search-icon" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('books.placeholders.search')} />
                    </div>
                    <div className="form-group livres-filter">
                        <label>{t('books.fields.category')}</label>
                        <select value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)}>
                            <option value="">{t('books.placeholders.allCategories')}</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{getCategoryLabel(c)}</option>
                            ))}
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button className="btn btn-edit livres-reset-btn" onClick={resetFilters}>
                            <FaTimes /> {t('books.messages.reset')}
                        </button>
                    )}
                </div>

                <div className="table-container">
                    <div className="table-count">
                        {loading ? t('books.messages.loadingBooks') : t('books.messages.displayedCount', { count: filteredLivres.length })}
                    </div>
                    <table className="livres-table">
                        <thead>
                        <tr>
                            <th>{t('books.fields.title')}</th>
                            <th>{t('books.fields.author')}</th>
                            <th>{t('books.fields.isbn')}</th>
                            <th>{t('books.fields.year')}</th>
                            <th>{t('books.fields.quantity')}</th>
                            <th>{t('books.fields.availability')}</th>
                            <th>{t('books.fields.category')}</th>
                            <th>{t('books.fields.library')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="9" className="empty-state">{t('common.loading')}</td></tr>
                        ) : filteredLivres.length === 0 ? (
                            <tr><td colSpan="9" className="empty-state">{emptyMessage}</td></tr>
                        ) : (
                            filteredLivres.map(l => (
                                <tr key={l.idLivre}>
                                    <td>
                                        <div className="livre-title">{l.titre}</div>
                                        <div className="livre-id">{t('common.id')} #{l.idLivre}</div>
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
                                            <button className="btn btn-edit" onClick={() => handleEdit(l)}>{t('common.edit')}</button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(l.idLivre)}>{t('common.delete')}</button>
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
