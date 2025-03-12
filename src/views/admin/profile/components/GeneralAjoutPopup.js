// frontend/src/views/admin/profile/components/GeneralAjoutPopup.js

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const GeneralAjoutPopup = ({
  isOpen,
  onClose,
  type,
  id,
  fetchTypes,
  fetchSecteurs,
  fetchSousSecteurs,
  selectedSecteur,
  selectedNatureRight,
  selectedSousSecteurRight
}) => {
  const toast = useToast();
  const [nom, setNom] = useState('');

  // Ajout d'un log pour vérifier les valeurs en cas de type_besoin
  useEffect(() => {
    if (type === "type_besoin") {
      console.log("DEBUG - Type de besoin ouvert avec :");
      console.log("Nature sélectionnée :", selectedNatureRight);
      console.log("Sous-secteur sélectionné :", selectedSousSecteurRight);
    }
  }, [type, selectedNatureRight, selectedSousSecteurRight]);

  // Chargement des données existantes en cas de modification
  useEffect(() => {
    if (id) {
      const endpoint = type === 'type_besoin' ? 'types-besoin' : `${type}s`;
      axios.get(`http://localhost:4000/api/${endpoint}/${id}`)
        .then(res => {
          if (type === "secteur") {
            setNom(res.data.nom_secteur);
          } else if (type === "sous_secteur") {
            setNom(res.data.nom_sous_secteur);
          } else if (type === "type_besoin") {
            setNom(res.data.nom_type);
          }
        })
        .catch(err => console.error('Erreur lors du chargement :', err));
    } else {
      setNom('');
    }
  }, [id, type]);

 // In GeneralAjoutPopup.js, update the handleSubmit function:

const handleSubmit = () => {
  if (!nom) {
    toast({
      title: "Erreur",
      description: `Le nom du ${type} est requis.`,
      status: "error",
      duration: 3000
    });
    return;
  }

  let url = '';
  let data = {};

  if (type === "type_besoin") {
    url = `http://localhost:4000/api/types-besoin${id ? `/${id}` : ""}`;
    
    // Vérification des valeurs requises
    if (!selectedNatureRight || !selectedSousSecteurRight) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une nature et un sous-secteur.",
        status: "error",
        duration: 3000
      });
      return;
    }

    data = {
      nom_type: nom,
      id_nature: selectedNatureRight,
      id_sous_secteur: selectedSousSecteurRight
    };
  } else if (type === "sous_secteur") {
    url = `http://localhost:4000/api/sous-secteurs${id ? `/${id}` : ""}`;
    if (!selectedSecteur) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un secteur.",
        status: "error",
        duration: 3000
      });
      return;
    }
    data = {
      nom: nom,
      id_secteur: selectedSecteur
    };
  } else {
    url = `http://localhost:4000/api/${type}s${id ? `/${id}` : ""}`;
    data = { nom };
  }

  const method = id ? "put" : "post";

  console.log("Sending data:", data);  // Debug log

  axios({
    method,
    url,
    data,
    headers: { "Content-Type": "application/json" }
  })
    .then(() => {
      toast({
        title: "Succès",
        description: id ? `${type} modifié.` : `${type} ajouté.`,
        status: "success",
        duration: 3000
      });
      if (fetchTypes) fetchTypes();
      onClose();
    })
    .catch(err => {
      console.error("Erreur lors de l'enregistrement :", err);
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le ${type}.`,
        status: "error",
        duration: 3000
      });
    });
};


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{id ? "Modifier" : "Ajouter"} {type}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nom</FormLabel>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
            Valider
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GeneralAjoutPopup;
