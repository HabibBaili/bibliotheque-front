import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = {
    getLivres: () => axios.get(`${API_URL}/livres`),
    getLivre: (id) => axios.get(`${API_URL}/livres/${id}`),
    createLivre: (data) => axios.post(`${API_URL}/livres`, data),
    updateLivre: (id, data) => axios.put(`${API_URL}/livres/${id}`, data),
    deleteLivre: (id) => axios.delete(`${API_URL}/livres/${id}`),

    getAdherents: () => axios.get(`${API_URL}/adherents`),
    getAdherent: (id) => axios.get(`${API_URL}/adherents/${id}`),
    createAdherent: (data) => axios.post(`${API_URL}/adherents`, data),
    updateAdherent: (id, data) => axios.put(`${API_URL}/adherents/${id}`, data),
    deleteAdherent: (id) => axios.delete(`${API_URL}/adherents/${id}`),

    getBibliotheques: () => axios.get(`${API_URL}/bibliotheques`),
    createBibliotheque: (data) => axios.post(`${API_URL}/bibliotheques`, data),
    deleteBibliotheque: (id) => axios.delete(`${API_URL}/bibliotheques/${id}`),

    getEmprunts: () => axios.get(`${API_URL}/emprunts`),
    createEmprunt: (data) => axios.post(`${API_URL}/emprunts`, data),
    deleteEmprunt: (id) => axios.delete(`${API_URL}/emprunts/${id}`),
};