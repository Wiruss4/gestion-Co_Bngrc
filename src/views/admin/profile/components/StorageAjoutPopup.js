import { useState, useEffect } from "react";
import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  Button, Input, Select, useToast 
} from "@chakra-ui/react";
import { addSiteHebergement, updateSiteHebergement } from "views/admin/profile/variables/DataStorage";
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

  // 🔥 États pour stocker les options des selects
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [fokontanys, setFokontanys] = useState([]);
  const [types, setTypes] = useState([]);

  // ✅ Charger les types de sites depuis l'API
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/type-site")
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => console.error("❌ Erreur API Types de site :", error));
  }, []);

  // ✅ Charger **toutes** les régions (pas seulement celles avec des sites)
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/region")
      .then((response) => {
        setRegions(response.data);
      })
      .catch((error) => console.error("❌ Erreur API Régions :", error));
  }, []);

  // ✅ Charger les districts après sélection de la région
  useEffect(() => {
    if (formData.id_region) {
      axios
        .get(`http://localhost:4000/api/district?region=${formData.id_region}`)
        .then((response) => {
          setDistricts(response.data);
          setCommunes([]); // Réinitialiser communes
          setFokontanys([]); // Réinitialiser fokontanys
        })
        .catch((error) => console.error("❌ Erreur API Districts :", error));
    }
  }, [formData.id_region]);

  // ✅ Charger les communes après sélection du district
  useEffect(() => {
    if (formData.id_district) {
      axios
        .get(`http://localhost:4000/api/commune?district=${formData.id_district}`)
        .then((response) => {
          setCommunes(response.data);
          setFokontanys([]); // Réinitialiser fokontanys
        })
        .catch((error) => console.error("❌ Erreur API Communes :", error));
    }
  }, [formData.id_district]);

  // ✅ Charger les fokontany après sélection de la commune
  useEffect(() => {
    if (formData.id_commune) {
      axios
        .get(`http://localhost:4000/api/fokontany?commune=${formData.id_commune}`)
        .then((response) => {
          setFokontanys(response.data);
        })
        .catch((error) => console.error("❌ Erreur API Fokontanys :", error));
    }
  }, [formData.id_commune]);

  // 🔹 Remplir le formulaire en mode modification
  useEffect(() => {
    if (selectedSite) {
      setFormData(selectedSite);
    } else {
      setFormData({
        nom_site: "",
        capacite: "",
        id_type: "",
        id_region: "",
        id_district: "",
        id_commune: "",
        id_fokontany: ""
      });
    }
  }, [selectedSite]);

  // 🔹 Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_region") {
      setFormData({ ...formData, id_region: value, id_district: "", id_commune: "", id_fokontany: "" });
      setDistricts([]);
      setCommunes([]);
      setFokontanys([]);
    } else if (name === "id_district") {
      setFormData({ ...formData, id_district: value, id_commune: "", id_fokontany: "" });
      setCommunes([]);
      setFokontanys([]);
    } else if (name === "id_commune") {
      setFormData({ ...formData, id_commune: value, id_fokontany: "" });
      setFokontanys([]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Gérer la soumission du formulaire (ajout ou modification)
  const handleSubmit = async () => {
    setLoading(true);
    let result;

    if (selectedSite) {
      result = await updateSiteHebergement(selectedSite.id_site, formData);
    } else {
      result = await addSiteHebergement(formData);
    }

    setLoading(false);

    if (result.success) {
      toast({ 
        title: selectedSite ? "✅ Site modifié avec succès" : "✅ Site ajouté avec succès", 
        status: "success", 
        duration: 3000, 
        isClosable: true 
      });
      onClose();
    } else {
      toast({ 
        title: "❌ Erreur", 
        description: result.message, 
        status: "error", 
        duration: 3000, 
        isClosable: true 
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedSite ? "Modifier le site" : "Ajouter un site d'hébergement"}</ModalHeader>
        <ModalBody>
          <Input placeholder="Nom du site" name="nom_site" value={formData.nom_site} onChange={handleChange} mb={3} color="black"/>
          <Input placeholder="Capacité" name="capacite" type="number" value={formData.capacite} onChange={handleChange} mb={3} color="black"/>
          <Select placeholder="Type du site" name="id_type" onChange={handleChange} mb={3} color="black" value={formData.id_type}>
            <option value="">Sélectionner un type</option>
            {types.map((type) => (
              <option key={type.id_type} value={type.id_type}>
                {type.nom_type}
              </option>
            ))}
          </Select>
          <Select placeholder="Région" name="id_region" value={formData.id_region} onChange={handleChange} mb={3} color="black">
            <option value="">Sélectionner une région</option>
            {regions.map((region) => (
              <option key={region.id_region} value={region.id_region}>
                {region.nom_region}
              </option>
            ))}
          </Select>
          <Select placeholder="District" name="id_district" value={formData.id_district} onChange={handleChange} mb={3} color="black" disabled={!formData.id_region}>
            <option value="">Sélectionner un district</option>
            {districts.map((district) => (
              <option key={district.id_district} value={district.id_district}>
                {district.nom_district}
              </option>
            ))}
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
