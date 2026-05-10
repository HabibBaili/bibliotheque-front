import React, { useEffect, useState } from 'react';
import { FaSync, FaPlus, FaTimes, FaChevronDown, FaChevronRight, FaExclamationTriangle, FaUndo, FaHistory, FaBook } from 'react-icons/fa';
import { api } from '../services/api';
import { useI18n } from '../i18n/I18nContext';

const MAX_BOOKS_PER_LOAN = 10;
const MAX_QTY_SAME_BOOK = 2;

function Emprunts() {
    const { t } = useI18n();
    const [emprunts, setEmprunts] = useState([]);
    const [livres, setLivres] = useState([]);
    const [adherents, setAdherents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [expandedRow, setExpandedRow] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [overdueEmprunts, setOverdueEmprunts] = useState([]);
    const [selectedAdherentHistory, setSelectedAdherentHistory] = useState('');
    const [historyEmprunts, setHistoryEmprunts] = useState([]);

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
            console.error('Erreur:', err);
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
            console.error('Erreur chargement retards:', err);
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
            console.error('Erreur chargement historique:', err);
            setHistoryEmprunts([]);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'overdue') loadOverdue();
    };

    const addBookRow = () => {
        if (lignes.length >= MAX_BOOKS_PER_LOAN) {
            alert(t('loans.messages.maxBooks', { max: MAX_BOOKS_PER_LOAN }));
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

        if (!adherentId) newErrors.adherent = t('loans.validations.member');
        if (!dateE) newErrors.dateE = t('loans.validations.loanDate');
        if (!dateRetourPrevue) newErrors.dateRetourPrevue = t('loans.validations.plannedReturn');

        if (dateE && dateRetourPrevue && new Date(dateRetourPrevue) <= new Date(dateE)) {
            newErrors.dateRetourPrevue = t('loans.validations.plannedReturnAfterLoan');
        }

        const selectedBooks = {};
        lignes.forEach((ligne, index) => {
            if (!ligne.livreId) {
                newErrors[`ligne_${index}`] = t('loans.validations.chooseBook');
                return;
            }
            if (ligne.quantite <= 0) {
                newErrors[`ligne_${index}`] = t('loans.validations.quantityPositive');
                return;
            }
            if (ligne.quantite > MAX_QTY_SAME_BOOK) {
                newErrors[`ligne_${index}`] = t('loans.validations.maxSameBook', { max: MAX_QTY_SAME_BOOK });
                return;
            }

            const stock = getAvailableStock(ligne.livreId);
            if (ligne.quantite > stock) {
                newErrors[`ligne_${index}`] = t('loans.validations.insufficientStock', { stock });
                return;
            }

            if (selectedBooks[ligne.livreId]) {
                newErrors[`ligne_${index}`] = t('loans.validations.duplicateBook');
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
            alert(err.response?.data?.message || t('loans.messages.createError'));
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
        if (window.confirm(t('loans.messages.deleteConfirm'))) {
            try {
                await api.deleteEmprunt(id);
                loadAll();
            } catch (err) {
                alert(t('loans.messages.deleteError'));
            }
        }
    };

    const handleRetourComplet = async (id) => {
        if (window.confirm(t('loans.messages.returnAllConfirm'))) {
            try {
                await api.retournerEmprunt(id);
                loadAll();
                if (activeTab === 'overdue') loadOverdue();
            } catch (err) {
                alert(err.response?.data?.message || t('loans.messages.returnError'));
            }
        }
    };

    const handleRetourLigne = async (empruntId, ligneId, livreTitre) => {
        if (window.confirm(t('loans.messages.returnOneConfirm', { title: livreTitre }))) {
            try {
                await api.retournerLigne(empruntId, ligneId);
                loadAll();
                if (activeTab === 'overdue') loadOverdue();
            } catch (err) {
                alert(err.response?.data?.message || t('loans.messages.returnError'));
            }
        }
    };

    const getStatutBadge = (statut, dateRetourPrevueValue) => {
        const isOverdue = dateRetourPrevueValue && new Date(dateRetourPrevueValue) < new Date() && statut !== 'RETOURNE';
        if (statut === 'RETOURNE') return <span className="badge badge-success">{t('loans.status.returned')}</span>;
        if (statut === 'RETOURNE_PARTIELLEMENT') return <span className={`badge badge-warning ${isOverdue ? 'badge-overdue' : ''}`}>{t('loans.status.partial')} {isOverdue && <FaExclamationTriangle />}</span>;
        return <span className={`badge badge-active ${isOverdue ? 'badge-overdue' : ''}`}>{t('loans.status.active')} {isOverdue && <FaExclamationTriangle />}</span>;
    };

    const getTotalBooks = (emprunt) => {
        if (!emprunt.lignes) return 0;
        return emprunt.lignes.reduce((sum, l) => sum + l.quantite, 0);
    };

    const renderEmpruntTable = (empruntsList, showTitle) => (
        <div className="table-container">
            {showTitle && empruntsList.length > 0 && (
                <div className="table-count">{t('loans.messages.count', { count: empruntsList.length })}</div>
            )}
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>{t('common.id')}</th>
                    <th>{t('loans.fields.member')}</th>
                    <th>{t('loans.fields.books')}</th>
                    <th>{t('loans.fields.loanDate')}</th>
                    <th>{t('loans.fields.plannedReturn')}</th>
                    <th>{t('loans.fields.actualReturn')}</th>
                    <th>{t('loans.fields.status')}</th>
                    <th>{t('common.actions')}</th>
                </tr>
                </thead>
                <tbody>
                {empruntsList.length === 0 ? (
                    <tr><td colSpan="9" className="empty-state">{t('loans.messages.empty')}</td></tr>
                ) : (
                    empruntsList.map(em => (
                        <React.Fragment key={em.idE}>
                            <tr className={`${em.lignes && em.lignes.some(l => !l.retourne) && em.dateRetourPrevue && new Date(em.dateRetourPrevue) < new Date() ? 'row-overdue' : ''}`}>
                                <td>
                                    <button className="btn-expand" onClick={() => setExpandedRow(expandedRow === em.idE ? null : em.idE)}>
                                        {expandedRow === em.idE ? <FaChevronDown /> : <FaChevronRight />}
                                    </button>
                                </td>
                                <td>{em.idE}</td>
                                <td>{em.adherent ? `${em.adherent.nom} ${em.adherent.prenom}` : t('common.unknown')}</td>
                                <td><span className="book-count">{getTotalBooks(em)} {t('common.book_many')}</span></td>
                                <td>{em.dateE}</td>
                                <td>{em.dateRetourPrevue}</td>
                                <td>{em.dateRetourEffective || t('common.dash')}</td>
                                <td>{getStatutBadge(em.statut, em.dateRetourPrevue)}</td>
                                <td className="actions-cell">
                                    {em.statut !== 'RETOURNE' && (
                                        <button className="btn btn-return" onClick={() => handleRetourComplet(em.idE)} title={t('loans.actions.fullReturnTitle')}>
                                            <FaUndo /> {t('loans.actions.fullReturn')}
                                        </button>
                                    )}
                                    <button className="btn btn-delete" onClick={() => handleDelete(em.idE)}>{t('common.delete')}</button>
                                </td>
                            </tr>
                            {expandedRow === em.idE && (
                                <tr className="expanded-row">
                                    <td colSpan="9">
                                        <div className="ligne-details">
                                            <h4><FaBook /> {t('loans.messages.details')}</h4>
                                            <table className="inner-table">
                                                <thead>
                                                <tr>
                                                    <th>{t('common.book_one')}</th>
                                                    <th>{t('loans.fields.author')}</th>
                                                    <th>{t('loans.fields.quantity')}</th>
                                                    <th>{t('loans.fields.status')}</th>
                                                    <th>{t('loans.fields.action')}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {em.lignes && em.lignes.map(ligne => (
                                                    <tr key={ligne.id} className={ligne.retourne ? 'ligne-returned' : ''}>
                                                        <td>{ligne.livre ? ligne.livre.titre : t('common.unknown')}</td>
                                                        <td>{ligne.livre ? ligne.livre.auteur : t('common.dash')}</td>
                                                        <td>{ligne.quantite}</td>
                                                        <td>
                                                            {ligne.retourne
                                                                ? <span className="badge badge-success">{t('loans.status.returned')}</span>
                                                                : <span className="badge badge-active">{t('loans.status.active')}</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            {!ligne.retourne && (
                                                                <button className="btn btn-return-sm" onClick={() => handleRetourLigne(em.idE, ligne.id, ligne.livre?.titre || t('common.book_one'))}>
                                                                    <FaUndo /> {t('loans.actions.returnBook')}
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
                <h2 className="card-title"><FaSync /> {t('loans.title')}</h2>

                <div className="tabs">
                    <button className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`} onClick={() => handleTabChange('all')}>
                        <FaBook /> {t('loans.tabs.all')}
                    </button>
                    <button className={`tab ${activeTab === 'overdue' ? 'tab-active' : ''}`} onClick={() => handleTabChange('overdue')}>
                        <FaExclamationTriangle /> {t('loans.tabs.overdue')}
                    </button>
                    <button className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`} onClick={() => handleTabChange('history')}>
                        <FaHistory /> {t('loans.tabs.history')}
                    </button>
                </div>

                {activeTab === 'all' && (
                    <>
                        <button className="btn btn-add" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                            {showForm ? t('common.cancel') : t('loans.add')}
                        </button>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="emprunt-form">
                                <div className="form-grid">
                                    <div className={`form-group ${errors.adherent ? 'form-error' : ''}`}>
                                        <label>{t('loans.fields.member')}</label>
                                        <select value={adherentId} onChange={e => { setAdherentId(e.target.value); setErrors({...errors, adherent: undefined}); }} required>
                                            <option value="">{t('loans.placeholders.chooseMember')}</option>
                                            {adherents.map(a => <option key={a.idA} value={a.idA}>{a.nom} {a.prenom}</option>)}
                                        </select>
                                        {errors.adherent && <div className="error-message" role="alert">{errors.adherent}</div>}
                                    </div>
                                    <div className={`form-group ${errors.dateE ? 'form-error' : ''}`}>
                                        <label>{t('loans.fields.loanDate')}</label>
                                        <input type="date" value={dateE} onChange={e => { setDateE(e.target.value); setErrors({...errors, dateE: undefined}); }} required />
                                        {errors.dateE && <div className="error-message" role="alert">{errors.dateE}</div>}
                                    </div>
                                    <div className={`form-group ${errors.dateRetourPrevue ? 'form-error' : ''}`}>
                                        <label>{t('loans.fields.plannedReturn')}</label>
                                        <input type="date" className={errors.dateRetourPrevue ? 'input-error' : ''} value={dateRetourPrevue} onChange={e => { setDateRetourPrevue(e.target.value); setErrors({...errors, dateRetourPrevue: undefined}); }} required />
                                        {errors.dateRetourPrevue && <div className="error-message" role="alert">{errors.dateRetourPrevue}</div>}
                                    </div>
                                </div>

                                <div className="multi-book-section">
                                    <div className="multi-book-header">
                                        <h3><FaBook /> {t('loans.messages.bookRowsTitle')}</h3>
                                        <span className="book-counter">{lignes.length} / {MAX_BOOKS_PER_LOAN}</span>
                                    </div>

                                    {lignes.map((ligne, index) => (
                                        <div key={index} className={`book-row ${errors[`ligne_${index}`] ? 'book-row-error' : ''}`}>
                                            <div className="book-row-number">{index + 1}</div>
                                            <div className="book-row-fields">
                                                <div className="book-select-wrapper">
                                                    <select value={ligne.livreId} onChange={e => updateBookRow(index, 'livreId', e.target.value)} required>
                                                        <option value="">{t('loans.placeholders.chooseBook')}</option>
                                                        {livres.map(l => (
                                                            <option key={l.idLivre} value={l.idLivre} disabled={lignes.some((other, i) => i !== index && String(other.livreId) === String(l.idLivre))}>
                                                                {l.titre} — {l.auteur}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {ligne.livreId && (
                                                        <span className="stock-info">
                                                            {t('common.stock')}: <strong>{getAvailableStock(ligne.livreId)}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="quantity-wrapper">
                                                    <label>{t('loans.fields.quantity')}</label>
                                                    <input type="number" min="1" max={MAX_QTY_SAME_BOOK} value={ligne.quantite} onChange={e => updateBookRow(index, 'quantite', parseInt(e.target.value) || 1)} className="quantity-input" />
                                                </div>
                                            </div>
                                            {lignes.length > 1 && (
                                                <button type="button" className="btn-remove-row" onClick={() => removeBookRow(index)} title={t('loans.actions.removeRowTitle')}>
                                                    <FaTimes />
                                                </button>
                                            )}
                                            {errors[`ligne_${index}`] && (
                                                <div className="book-row-error-msg">{errors[`ligne_${index}`]}</div>
                                            )}
                                        </div>
                                    ))}

                                    <button type="button" className="btn btn-add-book" onClick={addBookRow} disabled={lignes.length >= MAX_BOOKS_PER_LOAN}>
                                        <FaPlus /> {t('loans.messages.addBook')}
                                    </button>
                                </div>

                                {lignes.some(l => l.livreId) && (
                                    <div className="loan-summary">
                                        <h4>{t('loans.messages.summary')}</h4>
                                        <div className="summary-items">
                                            {lignes.filter(l => l.livreId).map((l, i) => (
                                                <div key={i} className="summary-item">
                                                    <span className="summary-title">{getBookTitle(l.livreId)}</span>
                                                    <span className="summary-qty">×{l.quantite}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="summary-total">
                                            {t('common.total')}: <strong>{lignes.filter(l => l.livreId).reduce((s, l) => s + (l.quantite || 0), 0)}</strong> {t('common.book_many')}
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-submit">{t('loans.messages.saveLoan')}</button>
                            </form>
                        )}

                        {renderEmpruntTable(emprunts, true)}
                    </>
                )}

                {activeTab === 'overdue' && (
                    <>
                        <div className="overdue-header">
                            <FaExclamationTriangle className="overdue-icon" />
                            <p>{t('loans.messages.overdueInfo')}</p>
                        </div>
                        {renderEmpruntTable(overdueEmprunts, true)}
                    </>
                )}

                {activeTab === 'history' && (
                    <>
                        <div className="history-section">
                            <div className="form-group">
                                <label>{t('loans.messages.selectMember')}</label>
                                <select value={selectedAdherentHistory} onChange={e => { setSelectedAdherentHistory(e.target.value); loadHistory(e.target.value); }}>
                                    <option value="">{t('loans.placeholders.chooseMember')}</option>
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
