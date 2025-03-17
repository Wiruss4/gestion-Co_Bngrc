// frontend/src/views/admin/DataSite/components/Upload.js

import { useState, useEffect } from "react";
import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  Button, Input, Select, useToast 
} from "@chakra-ui/react";
import axios from "axios";

export default function StorageAjoutPopup({ isOpen, onClose, selectedSite }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom_site: "",
    capacite: "",
    id_type: "",
    id_region: "",
    id_district: "",
    id_commune: "",
    id_fokontany: ""
  });

  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [fokontanys, setFokontanys] = useState([]);
  const [types, setTypes] = useState([]);

  // ✅ Charger toutes les données au chargement du composant
  useEffect(() => {
    axios.get("http://localhost:4000/api/type-site").then((res) => setTypes(res.data));
    axios.get("http://localhost:4000/api/region").then((res) => setRegions(res.data));
    axios.get("http://localhost:4000/api/district").then((res) => setDistricts(res.data));
    axios.get("http://localhost:4000/api/commune").then((res) => setCommunes(res.data));
    axios.get("http://localhost:4000/api/fokontany").then((res) => setFokontanys(res.data));
  }, []);

  // ✅ Remplir le formulaire en mode modification
  useEffect(() => {
    if (selectedSite) {
      console.log("📢 Site sélectionné pour modification :", selectedSite); // 🔹 Vérification

      setFormData({
        nom_site: selectedSite.nom_site || "",
        capacite: selectedSite.capacite || "",
        id_type: selectedSite.id_type || "",
        id_region: selectedSite.id_region || "",
        id_district: selectedSite.id_district || "",
        id_commune: selectedSite.id_commune || "",
        id_fokontany: selectedSite.id_fokontany || ""
      });
    }
  }, [selectedSite]);

  // ✅ Gérer les changements et réinitialiser les champs dépendants
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_region") {
      setFormData({ ...formData, id_region: value, id_district: "", id_commune: "", id_fokontany: "" });
    } else if (name === "id_district") {
      setFormData({ ...formData, id_district: value, id_commune: "", id_fokontany: "" });
    } else if (name === "id_commune") {
      setFormData({ ...formData, id_commune: value, id_fokontany: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Filtrer dynamiquement les options en fonction de la sélection
  const filteredDistricts = districts.filter(d => Number(d.id_region) === Number(formData.id_region));
  const filteredCommunes = communes.filter(c => Number(c.id_district) === Number(formData.id_district));
  const filteredFokontanys = fokontanys.filter(f => Number(f.id_commune) === Number(formData.id_commune));

  // ✅ Gérer la soumission du formulaire
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (selectedSite) {
        await axios.put(`http://localhost:4000/api/site-hebergement/${selectedSite.id_site}`, formData);
        toast({ title: "✅ Site modifié avec succès", status: "success", duration: 3000, isClosable: true });
      } else {
        await axios.post("http://localhost:4000/api/site-hebergement", formData);
        toast({ title: "✅ Site ajouté avec succès", status: "success", duration: 3000, isClosable: true });
      }
      onClose(); // 🔹 Fermer la popup après soumission
    } catch (error) {
      toast({ 
        title: "❌ Erreur", 
        description: error.response?.data?.message || "Une erreur est survenue", 
        status: "error", 
        duration: 3000, 
        isClosable: true 
      });
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedSite ? "Modifier le site" : "Ajouter un site d'hébergement"}</ModalHeader>
        <ModalBody>
          <Input placeholder="Nom du site" name="nom_site" value={formData.nom_site} onChange={handleChange} mb={3} color="inherit" 
  _placeholder={{ color: "inherit" }}  />
          <Input placeholder="Capacité" name="capacite" type="number" value={formData.capacite} onChange={handleChange} mb={3} color="inherit" 
  _placeholder={{ color: "inherit" }}  />
          
          <Select name="id_type" value={formData.id_type} onChange={handleChange} mb={3}>
            <option value="">Sélectionner un type</option>
            {types.map((type) => <option key={type.id_type} value={type.id_type}>{type.nom_type}</option>)}
          </Select>

          <Select name="id_region" value={formData.id_region} onChange={handleChange} mb={3}>
            <option value="">Sélectionner une région</option>
            {regions.map((region) => <option key={region.id_region} value={region.id_region}>{region.nom_region}</option>)}
          </Select>

          <Select name="id_district" value={formData.id_district} onChange={handleChange} mb={3} disabled={!formData.id_region}>
            <option value="">Sélectionner un district</option>
            {filteredDistricts.map((district) => <option key={district.id_district} value={district.id_district}>{district.nom_district}</option>)}
          </Select>

          <Select name="id_commune" value={formData.id_commune} onChange={handleChange} mb={3} disabled={!formData.id_district}>
            <option value="">Sélectionner une commune</option>
            {filteredCommunes.map((commune) => <option key={commune.id_commune} value={commune.id_commune}>{commune.nom_commune}</option>)}
          </Select>

          <Select name="id_fokontany" value={formData.id_fokontany} onChange={handleChange} mb={3} disabled={!formData.id_commune}>
            <option value="">Sélectionner un fokontany</option>
            {filteredFokontanys.map((fokontany) => <option key={fokontany.id_fokontany} value={fokontany.id_fokontany}>{fokontany.nom_fokontany}</option>)}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="red" mr="3">Annuler</Button>
          <Button onClick={handleSubmit} colorScheme="blue" isLoading={loading}>
            {selectedSite ? "Modifier" : "Ajouter"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
