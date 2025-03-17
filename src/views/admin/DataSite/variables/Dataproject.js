// frontend/src/views/admin/DataSite/variables/Dataproject.js
import axios from "axios";

// 📌 Fonction pour récupérer les suivis avec filtres (date_suivi et id_site)
export const fetchSuiviSiteHebergement = async (date_suivi = "", id_site = "") => {
  try {
    let url = "http://localhost:4000/api/suivi-site-hebergement";
    const params = new URLSearchParams();

    if (date_suivi) params.append("date_suivi", date_suivi);
    if (id_site) params.append("id_site", id_site);

    const response = await axios.get(`${url}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des suivis :", error);
    return [];
  }
};

// 📌 Fonction pour récupérer la liste des sites d'hébergement
export const fetchSiteHebergement = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/site-hebergement");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des sites :", error);
      return [];
    }
  };

// 📌 Fonction pour ajouter un suivi
export const addSuiviSiteHebergement = async (suiviData) => {
  try {
    const response = await axios.post("http://localhost:4000/api/suivi-site-hebergement", suiviData);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du suivi :", error);
    return { error: "Erreur lors de l'ajout du suivi" };
  }
};

// 📌 Fonction pour modifier un suivi existant
export const updateSuiviSiteHebergement = async (id, suiviData) => {
  try {
    const response = await axios.put(`http://localhost:4000/api/suivi-site-hebergement/${id}`, suiviData);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la modification du suivi :", error);
    return { error: "Erreur lors de la modification du suivi" };
  }
};

// 📌 Fonction pour supprimer un suivi
export const deleteSuiviSiteHebergement = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/suivi-site-hebergement/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du suivi :", error);
    return { error: "Erreur lors de la suppression du suivi" };
  }
};
