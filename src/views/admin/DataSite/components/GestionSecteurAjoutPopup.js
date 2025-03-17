// frontend/src/views/admin/DataSite/components/GestionSecteurAjoutPopup.js

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

const GestionSecteurAjoutPopup = ({
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
    if (type === "type_besoin") {
      url = `http://localhost:4000/api/types-besoin${id ? `/${id}` : ""}`;
    } else if (type === "sous_secteur") {
      url = `http://localhost:4000/api/sous-secteurs${id ? `/${id}` : ""}`;
    } else {
      url = `http://localhost:4000/api/${type}s${id ? `/${id}` : ""}`;
    }

    const method = id ? "put" : "post";
    let data = {};

    if (type === "secteur" || type === "sous_secteur") {
      data = { nom };
      if (type === "sous_secteur") {
        if (!selectedSecteur) {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner un secteur pour le sous‑secteur.",
            status: "error",
            duration: 3000
          });
          return;
        }
        data.id_secteur = selectedSecteur;
      }
    } else if (type === "type_besoin") {
      // Vérifier que les valeurs de nature et de sous-secteur existent
      if (!selectedNatureRight || !selectedSousSecteurRight) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une nature et un sous‑secteur.",
          status: "error",
          duration: 3000
        });
        return;
      }
      data = {
        id_nature: selectedNatureRight,
        id_sous_secteur: selectedSousSecteurRight,
        nom_type: nom
      };
    }
    
    console.log("🔍 Données envoyées pour type_besoin :", {
      id_nature: selectedNatureRight,
      id_sous_secteur: selectedSousSecteurRight,
      nom_type: nom
    });
    

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
        // Appel de la fonction de rafraîchissement selon le type
        if (type === "secteur" && fetchSecteurs) {
          fetchSecteurs();
        } else if (type === "sous_secteur" && fetchSousSecteurs) {
          fetchSousSecteurs();
        } else if (type === "type_besoin" && fetchTypes) {
          fetchTypes();
        }
        onClose();
      })
      .catch(err => {
        console.error("Erreur lors de l'enregistrement :", err);
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer ${type}.`,
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
            <Input 
              value={nom} 
              onChange={(e) => setNom(e.target.value)}
              bg="gray.300"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              _focusVisible={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px brand.500"
              }}
            />
          </FormControl>
          <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
            Valider
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GestionSecteurAjoutPopup;
