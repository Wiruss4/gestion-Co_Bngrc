// frontend/src/views/admin/profile/components/UploadAjoutPopup.js

import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Select, Button, Input, FormControl, FormLabel, useToast
} from '@chakra-ui/react';
import axios from 'axios';

const UploadAjoutPopup = ({ isOpen, onClose, idSite }) => {
  const toast = useToast();
  const [types, setTypes] = useState([]);
  const [idType, setIdType] = useState('');
  const [etat, setEtat] = useState(1);
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:4000/api/types-besoin')
        .then((res) => setTypes(res.data))
        .catch((err) => console.error('Erreur chargement types:', err));
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!idType) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un type de besoin.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios.post('http://localhost:4000/api/besoins-site', { id_site: idSite, id_type: idType, etat, quantite })
      .then(() => {
        toast({
          title: 'Succès',
          description: 'Besoin ajouté avec succès !',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de l’ajout du besoin.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Erreur ajout besoin:', error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter un besoin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Type de besoin</FormLabel>
            <Select placeholder="Sélectionner un type" onChange={(e) => setIdType(e.target.value)}>
              {types.map((t) => <option key={t.id_type} value={t.id_type}>{t.nom_type}</option>)}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>État</FormLabel>
            <Select value={etat} onChange={(e) => setEtat(parseInt(e.target.value))}>
              <option value="1">✅ Besoin</option>
              <option value="0">❌ Aucun besoin</option>
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Quantité</FormLabel>
            <Input type="number" value={quantite} min="1" onChange={(e) => setQuantite(parseInt(e.target.value))} />
          </FormControl>

          <Button colorScheme="blue" onClick={handleSubmit}>Ajouter</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadAjoutPopup;
