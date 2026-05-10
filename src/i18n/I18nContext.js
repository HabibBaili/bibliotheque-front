import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, translations } from './translations';

const STORAGE_KEY = 'bookHunterLanguage';
const RTL_LANGUAGES = new Set(['ar']);

const I18nContext = createContext(null);

const getInitialLanguage = () => {
    try {
        const storedLanguage = localStorage.getItem(STORAGE_KEY);
        if (translations[storedLanguage]) return storedLanguage;
    } catch (err) {
        // localStorage can be unavailable in restricted browser contexts.
    }
    return DEFAULT_LANGUAGE;
};

const getNestedValue = (source, path) => (
    path.split('.').reduce((value, key) => (value && value[key] !== undefined ? value[key] : undefined), source)
);

const interpolate = (template, params = {}) => (
    String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => (
        params[key] !== undefined ? String(params[key]) : ''
    ))
);

export function I18nProvider({ children }) {
    const [language, setLanguage] = useState(getInitialLanguage);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (err) {
            // Ignore storage failures; the current session still switches language.
        }
    }, [language]);

    const value = useMemo(() => {
        const t = (key, params) => {
            const translated = getNestedValue(translations[language], key);
            const fallback = getNestedValue(translations[DEFAULT_LANGUAGE], key);
            return interpolate(translated ?? fallback ?? key, params);
        };

        return {
            language,
            setLanguage,
            languages: LANGUAGES,
            isRtl: RTL_LANGUAGES.has(language),
            t
        };
    }, [language]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used inside I18nProvider');
    }
    return context;
};
