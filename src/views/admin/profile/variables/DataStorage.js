import axios from "axios";

// 📌 Fonction pour ajouter un site d'hébergement
export const addSiteHebergement = async (siteData) => {
  try {
    const response = await axios.post("http://localhost:4000/api/site-hebergement", siteData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du site d'hébergement :", error);
    return { success: false, message: "Erreur lors de l'ajout du site" };
  }
};

// 📌 Fonction pour modifier un site d'hébergement existant
export const updateSiteHebergement = async (id, siteData) => {
  try {
    const response = await axios.put(`http://localhost:4000/api/site-hebergement/${id}`, siteData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Erreur lors de la modification du site d'hébergement :", error);
    return { success: false, message: "Erreur lors de la modification du site" };
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

// 📌 Fonction pour supprimer un site d'hébergement
export const deleteSiteHebergement = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/site-hebergement/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du site :", error);
    return { success: false, message: "Erreur lors de la suppression du site" };
  }
};
