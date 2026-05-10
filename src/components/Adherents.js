import React, { useCallback, useEffect, useState } from 'react';
import { FaUsers, FaSearch, FaEnvelope } from 'react-icons/fa';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { api } from '../services/api';
import { useI18n } from '../i18n/I18nContext';

const EMPTY_FORM = { nom: '', prenom: '', adresse: '', tel: '', email: '' };

function Adherents() {
    const { t, isRtl } = useI18n();
    const [adherents, setAdherents] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const loadAdherents = useCallback(async () => {
        try {
            const res = await api.getAdherents();
            setAdherents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Erreur:', err);
            setAdherents([]);
        }
    }, []);

    const handleSearch = useCallback(async () => {
        try {
            const res = await api.searchAdherents(searchQuery);
            setAdherents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Erreur recherche:', err);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
        loadAdherents();
    }, [searchQuery, handleSearch, loadAdherents]);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setError('');
        setPhoneError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPhoneError('');

        if (!validateEmail(form.email)) {
            setError(t('members.invalidEmail'));
            return;
        }

        if (!form.tel || !isValidPhoneNumber(form.tel)) {
            setPhoneError(t('members.invalidPhone'));
            return;
        }

        try {
            if (editingId) {
                await api.updateAdherent(editingId, form);
            } else {
                await api.createAdherent(form);
            }
            setForm(EMPTY_FORM);
            setShowForm(false);
            setEditingId(null);
            setPhoneError('');
            loadAdherents();
        } catch (err) {
            if (err.response && (err.response.status === 409 || err.response.status === 400)) {
                setError(t('members.emailUsed'));
            } else {
                alert(t('members.saveError'));
            }
        }
    };

    const handleEdit = (a) => {
        setForm({ nom: a.nom, prenom: a.prenom, adresse: a.adresse, tel: a.tel, email: a.email || '' });
        setEditingId(a.idA);
        setShowForm(true);
        setError('');
        setPhoneError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('members.deleteConfirm'))) {
            try {
                await api.deleteAdherent(id);
                loadAdherents();
            } catch (err) {
                alert(t('members.deleteError'));
            }
        }
    };

    const list = Array.isArray(adherents) ? adherents : [];

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title"><FaUsers /> {t('members.title')}</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-add" style={{ marginBottom: 0 }} onClick={() => {
                        if (showForm) resetForm();
                        setShowForm(!showForm);
                    }}>
                        {showForm ? t('common.cancel') : t('members.add')}
                    </button>

                    <div className="search-bar" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: isRtl ? 'auto' : '1rem', right: isRtl ? '1rem' : 'auto', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                        <input
                            type="text"
                            placeholder={t('members.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: isRtl ? '0.8rem 2.5rem 0.8rem 1rem' : '0.8rem 1rem 0.8rem 2.5rem',
                                borderRadius: '12px',
                                border: '2px solid var(--beige)',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--beige)', borderRadius: '16px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>{t('common.name')}</label>
                                <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder={t('common.name')} />
                            </div>
                            <div className="form-group">
                                <label>{t('members.firstName')}</label>
                                <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required placeholder={t('members.firstName')} />
                            </div>
                            <div className="form-group">
                                <label>{t('members.email')}</label>
                                <div style={{ position: 'relative' }}>
                                    <FaEnvelope style={{ position: 'absolute', left: isRtl ? 'auto' : '1rem', right: isRtl ? '1rem' : 'auto', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '0.9rem' }} />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => {
                                            setForm({...form, email: e.target.value});
                                            if (error) setError('');
                                        }}
                                        required
                                        placeholder="user@example.com"
                                        className={error ? 'input-error' : ''}
                                        style={isRtl ? { paddingRight: '2.5rem' } : { paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>
                            <div className={`form-group ${phoneError ? 'form-error' : ''}`}>
                                <label>{t('members.phone')}</label>
                                <PhoneInput
                                    international
                                    defaultCountry="DZ"
                                    value={form.tel}
                                    onChange={value => {
                                        setForm({...form, tel: value || ''});
                                        if (phoneError) setPhoneError('');
                                    }}
                                    required
                                    placeholder={t('members.phone')}
                                    className={`phone-input ${phoneError ? 'input-error' : ''}`}
                                />
                                {phoneError && <div className="error-message" role="alert">{phoneError}</div>}
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>{t('common.address')}</label>
                                <input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} required placeholder={t('common.address')} />
                            </div>
                        </div>

                        {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                        <button type="submit" className="btn btn-submit">
                            {editingId ? t('common.update') : t('common.save')}
                        </button>
                    </form>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>{t('common.id')}</th>
                            <th>{t('members.fullName')}</th>
                            <th>{t('members.email')}</th>
                            <th>{t('members.phone')}</th>
                            <th>{t('common.address')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr><td colSpan="6" className="empty-state">{t('members.empty')}</td></tr>
                        ) : (
                            list.map(a => (
                                <tr key={a.idA}>
                                    <td>{a.idA}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{a.nom} {a.prenom}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <FaEnvelope style={{ color: 'var(--tan)', fontSize: '0.8rem' }} />
                                            {a.email}
                                        </div>
                                    </td>
                                    <td>{a.tel}</td>
                                    <td>{a.adresse}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-edit" onClick={() => handleEdit(a)}>{t('common.edit')}</button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(a.idA)}>{t('common.delete')}</button>
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

export default Adherents;
